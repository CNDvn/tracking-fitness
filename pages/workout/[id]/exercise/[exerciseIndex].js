import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ExerciseDetail() {
    const router = useRouter();
    const { id, exerciseIndex } = router.query;
    const [workout, setWorkout] = useState(null);
    const [trackings, setTrackings] = useState([]);
    const [trackingData, setTrackingData] = useState({});
    const [message, setMessage] = useState('');
    const [isHeavyDay, setIsHeavyDay] = useState(false);
    const [editingLastSession, setEditingLastSession] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`/api/workouts/${id}`)
                .then(res => res.json())
                .then(data => setWorkout(data));
            fetch(`/api/trackings?workoutId=${id}`)
                .then(res => res.json())
                .then(data => setTrackings(data));
        }
    }, [id]);

    if (!workout || !exerciseIndex) return <div className="container">Loading...</div>;

    const exIndex = parseInt(exerciseIndex);
    const exercise = workout.exercises[exIndex];

    const getLastSession = () => {
        const sorted = trackings.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted.find(t => t.exercises.some(e => e.name === exercise.name));
    };

    const getHeavySession = () => {
        const relevantTrackings = trackings.filter(t => t.exercises.some(e => e.name === exercise.name && e.isHeavy));
        const sorted = relevantTrackings.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted[0];
    };

    const initializeTracking = () => {
        if (!trackingData[exercise.name]) {
            const sets = Array(parseInt(exercise.sets) || 1).fill(null).map(() => ({
                weight: '',
                reps: ''
            }));
            setTrackingData({
                [exercise.name]: { sets }
            });
        }
    };

    const handleSetChange = (setIndex, field, value) => {
        const updated = { [exercise.name]: { sets: [...(trackingData[exercise.name]?.sets || [])] } };
        if (!updated[exercise.name].sets[setIndex]) {
            updated[exercise.name].sets[setIndex] = { weight: '', reps: '' };
        }
        updated[exercise.name].sets[setIndex][field] = value;
        setTrackingData(updated);
    };

    const saveSetTracking = async (setIndex, setData) => {
        if (setData.weight === '' || setData.reps === '') {
            setMessage('Please fill weight and reps');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        const exercises = [
            {
                name: exercise.name,
                sets: [setData]
            }
        ];

        try {
            const res = await fetch('/api/trackings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workoutId: id, date: new Date().toISOString(), exercises, isSingleSet: true })
            });

            if (res.ok) {
                setMessage(`✓ Set ${setIndex + 1} saved!`);
                setTimeout(() => setMessage(''), 2000);
                const updatedTrackings = await fetch(`/api/trackings?workoutId=${id}`).then(r => r.json());
                setTrackings(updatedTrackings);
            }
        } catch (error) {
            setMessage('Error saving set');
        }
    };

    const saveHeavyDay = async () => {
        try {
            const res = await fetch('/api/trackings/heavy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workoutId: id, exerciseName: exercise.name })
            });

            if (res.ok) {
                setMessage('✓ Marked as heavy!');
                setIsHeavyDay(true);
                setTimeout(() => setMessage(''), 2000);
            }
        } catch (error) {
            setMessage('Error marking as heavy');
        }
    };

    const startEditingLastSession = () => {
        if (last) {
            const lastExerciseData = last.exercises.find(e => e.name === exercise.name);
            if (lastExerciseData?.sets) {
                // Initialize with all planned sets, filling in data from last session
                const totalSets = parseInt(exercise.sets) || 1;
                const sets = Array(totalSets).fill(null).map((_, idx) =>
                    lastExerciseData.sets[idx] || { weight: '', reps: '' }
                );
                setTrackingData({
                    [exercise.name]: { sets, trackingId: last.id, lastDate: last.date }
                });
                setEditingLastSession(true);
            }
        }
    };

    const updateLastSession = async (setIndex, setData) => {
        if (setData.weight === '' || setData.reps === '') {
            setMessage('Please fill weight and reps');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            const res = await fetch('/api/trackings/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trackingId: trackingData[exercise.name].trackingId,
                    exerciseName: exercise.name,
                    setIndex: setIndex,
                    setData: setData
                })
            });

            if (res.ok) {
                setMessage(`✓ Set ${setIndex + 1} updated!`);
                setTimeout(() => setMessage(''), 2000);
                const updatedTrackings = await fetch(`/api/trackings?workoutId=${id}`).then(r => r.json());
                setTrackings(updatedTrackings);
                setEditingLastSession(false);
                setTrackingData({});
            }
        } catch (error) {
            setMessage('Error updating set');
        }
    };

    const last = getLastSession();
    const heavy = getHeavySession();

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        backgroundColor: '#94a3b8',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    ← Back
                </button>
                <h1 style={{ margin: 0 }}>{exercise.name}</h1>
            </div>

            {message && <p style={{ textAlign: 'center', color: message.includes('✓') ? '#059669' : '#dc2626', fontWeight: 'bold', marginBottom: '16px' }}>{message}</p>}

            {/* Exercise Details */}
            <div className="exercise-card">
                <h3 style={{ marginTop: 0 }}>Plan</h3>
                <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>{exercise.sets}</strong> sets × <strong>{exercise.reps}</strong> reps</p>
                {exercise.description && <p style={{ margin: '4px 0', fontSize: '13px', color: '#64748b' }}>{exercise.description}</p>}
                {exercise.restTime && <p style={{ margin: '4px 0', fontSize: '13px', color: '#64748b' }}>Rest: {exercise.restTime}s</p>}
                {(exercise.rpe || exercise.tempo) && <p style={{ margin: '4px 0', fontSize: '13px', color: '#64748b' }}>
                    {exercise.rpe && `RPE: ${exercise.rpe}`} {exercise.rpe && exercise.tempo && ' | '} {exercise.tempo && `Tempo: ${exercise.tempo}`}
                </p>}
            </div>

            {/* Last Session */}
            {last && !editingLastSession && (
                <div className="exercise-card">
                    <h3 style={{ marginTop: 0, color: '#059669' }}>Last Session</h3>
                    {last.exercises.find(e => e.name === exercise.name)?.sets?.map((set, idx) => (
                        <p key={idx} style={{ margin: '4px 0', fontSize: '14px' }}>
                            Set {idx + 1}: <strong>{set.weight}kg × {set.reps} reps</strong>
                        </p>
                    ))}
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        {new Date(last.date).toLocaleDateString()}
                    </p>
                    <button
                        onClick={startEditingLastSession}
                        style={{
                            width: '100%',
                            marginTop: '12px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600'
                        }}
                    >
                        ✎ Edit Last Session
                    </button>
                </div>
            )}

            {/* Edit Last Session */}
            {editingLastSession && (
                <div className="exercise-card">
                    <h3 style={{ marginTop: 0, color: '#059669' }}>Edit Last Session</h3>
                    {trackingData[exercise.name]?.sets?.map((setData, setIdx) => (
                        <div key={setIdx} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Set {setIdx + 1}</p>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="number"
                                    placeholder="Weight (kg)"
                                    value={setData.weight}
                                    onChange={(e) => {
                                        const updated = { ...trackingData };
                                        updated[exercise.name].sets[setIdx].weight = e.target.value;
                                        setTrackingData(updated);
                                    }}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    placeholder="Reps"
                                    value={setData.reps}
                                    onChange={(e) => {
                                        const updated = { ...trackingData };
                                        updated[exercise.name].sets[setIdx].reps = e.target.value;
                                        setTrackingData(updated);
                                    }}
                                    style={{ flex: 1 }}
                                />
                            </div>
                            <button
                                onClick={() => updateLastSession(setIdx, setData)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#059669',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                }}
                            >
                                Save Set {setIdx + 1}
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            setEditingLastSession(false);
                            setTrackingData({});
                        }}
                        style={{
                            width: '100%',
                            marginTop: '12px',
                            backgroundColor: '#94a3b8',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Heavy Session */}
            {heavy && (
                <div className="exercise-card">
                    <h3 style={{ marginTop: 0, color: '#dc2626' }}>💪 Heavy Day</h3>
                    {heavy.exercises.find(e => e.name === exercise.name)?.sets?.map((set, idx) => (
                        <p key={idx} style={{ margin: '4px 0', fontSize: '14px' }}>
                            Set {idx + 1}: <strong>{set.weight}kg × {set.reps} reps</strong>
                        </p>
                    ))}
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        {new Date(heavy.date).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* Track Today */}
            <div className="exercise-card">
                <h3 style={{ marginTop: 0 }}>Track Today</h3>

                {!trackingData[exercise.name] ? (
                    <button
                        onClick={initializeTracking}
                        style={{
                            width: '100%',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}
                    >
                        Start Tracking
                    </button>
                ) : (
                    <>
                        {trackingData[exercise.name]?.sets?.map((setData, setIdx) => (
                            <div key={setIdx} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Set {setIdx + 1}</p>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        type="number"
                                        placeholder="Weight (kg)"
                                        value={setData.weight}
                                        onChange={(e) => handleSetChange(setIdx, 'weight', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Reps"
                                        value={setData.reps}
                                        onChange={(e) => handleSetChange(setIdx, 'reps', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <button
                                    onClick={() => saveSetTracking(setIdx, setData)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#059669',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Save Set {setIdx + 1}
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={saveHeavyDay}
                            style={{
                                width: '100%',
                                marginTop: '12px',
                                backgroundColor: isHeavyDay ? '#dc2626' : '#f59e0b',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            {isHeavyDay ? '💪 Heavy Day!' : 'Mark as Heavy Day'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}