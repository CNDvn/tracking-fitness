import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../../_app';

export default function ExerciseDetail() {
    const router = useRouter();
    const { id, exerciseIndex } = router.query;
    const { user } = useContext(UserContext);
    const [workout, setWorkout] = useState(null);
    const [trackings, setTrackings] = useState([]);
    const [trackingData, setTrackingData] = useState({});
    const [message, setMessage] = useState('');
    const [isHeavyDay, setIsHeavyDay] = useState(false);
    const [editingLastSession, setEditingLastSession] = useState(false);

    useEffect(() => {
        if (id && user) {
            const token = localStorage.getItem('token');
            fetch(`/api/workouts/${id}`)
                .then(res => res.json())
                .then(data => setWorkout(data));
            fetch(`/api/trackings?workoutId=${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => setTrackings(data));
        }
    }, [id, user]);

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
            const token = localStorage.getItem('token');
            const res = await fetch('/api/trackings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ workoutId: id, date: new Date().toISOString(), exercises, isSingleSet: true, userId: user.id })
            });

            if (res.ok) {
                setMessage(`✓ Set ${setIndex + 1} saved!`);
                setTimeout(() => setMessage(''), 2000);
                const updatedTrackings = await fetch(`/api/trackings?workoutId=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(r => r.json());
                setTrackings(updatedTrackings);
            }
        } catch (error) {
            setMessage('Error saving set');
        }
    };

    const saveHeavyDay = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/trackings/heavy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ workoutId: id, exerciseName: exercise.name, userId: user.id })
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
            const token = localStorage.getItem('token');
            const res = await fetch('/api/trackings/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    trackingId: trackingData[exercise.name].trackingId,
                    exerciseName: exercise.name,
                    setIndex: setIndex,
                    setData: setData,
                    userId: user.id
                })
            });

            if (res.ok) {
                setMessage(`✓ Set ${setIndex + 1} updated!`);
                setTimeout(() => setMessage(''), 2000);
                const updatedTrackings = await fetch(`/api/trackings?workoutId=${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(r => r.json());
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
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <button
                    onClick={() => router.back()}
                    aria-label="Go back"
                    className="back-btn"
                >
                    <span className="back-icon" aria-hidden>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="back-label">Back</span>
                </button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>{exercise.name}</h1>
                    <div className="muted" style={{ marginTop: '6px', fontSize: '13px' }}>Track sets, save progress, and edit sessions</div>
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <div style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    backgroundColor: message.includes('✓') ? '#ecfdf5' : '#fef2f2',
                    color: message.includes('✓') ? '#059669' : '#dc2626',
                    fontWeight: 600,
                    marginBottom: '16px',
                    borderRadius: '10px',
                    border: `2px solid ${message.includes('✓') ? '#d1fae5' : '#fecaca'}`,
                    fontSize: '14px',
                    animation: 'slideIn 0.3s ease'
                }}>
                    {message}
                </div>
            )}

            {/* Exercise Details */}
            <div style={{
                padding: '16px',
                backgroundColor: '#f0f9ff',
                border: '2px solid #bfdbfe',
                borderRadius: '12px',
                marginBottom: '18px'
            }}>
                <h3 style={{ marginTop: 0, color: '#1e40af', fontSize: '16px' }}>📋 Plan</h3>
                <p style={{ margin: '8px 0', fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                    <span style={{ backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '6px', marginRight: '8px' }}>{exercise.sets}</span>
                    sets ×
                    <span style={{ backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '6px', margin: '0 8px' }}>{exercise.reps}</span>
                    reps
                </p>
                {exercise.description && <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569', fontStyle: 'italic' }}>📝 {exercise.description}</p>}
                {exercise.restTime && <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569' }}>⏱️ Rest: <strong>{exercise.restTime}s</strong></p>}
                {(exercise.rpe || exercise.tempo) && <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569' }}>
                    {exercise.rpe && `📊 RPE: ${exercise.rpe}`} {exercise.rpe && exercise.tempo && ' | '} {exercise.tempo && `⚡ Tempo: ${exercise.tempo}`}
                </p>}
            </div>

            {/* Last Session */}
            {last && !editingLastSession && (
                <div style={{
                    padding: '16px',
                    backgroundColor: '#ecfdf5',
                    border: '2px solid #a7f3d0',
                    borderRadius: '12px',
                    marginBottom: '18px'
                }}>
                    <h3 style={{ marginTop: 0, color: '#047857', fontSize: '16px' }}>✅ Last Session</h3>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                        {last.exercises.find(e => e.name === exercise.name)?.sets?.map((set, idx) => (
                            <p key={idx} style={{ margin: '8px 0', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                                Set {idx + 1}:
                                <span style={{ backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '6px', marginLeft: '8px', fontWeight: 700 }}>
                                    {set.weight}kg × {set.reps} reps
                                </span>
                            </p>
                        ))}
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                        📅 {new Date(last.date).toLocaleDateString()}
                    </p>
                    <button
                        onClick={startEditingLastSession}
                        style={{
                            width: '100%',
                            marginTop: '12px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 700,
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                        }}
                    >
                        ✎ Edit Last Session
                    </button>
                </div>
            )}

            {/* Edit Last Session */}
            {editingLastSession && (
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fef3c7',
                    border: '2px solid #fcd34d',
                    borderRadius: '12px',
                    marginBottom: '18px'
                }}>
                    <h3 style={{ marginTop: 0, color: '#92400e', fontSize: '16px' }}>✏️ Edit Last Session</h3>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', marginBottom: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                        {trackingData[exercise.name]?.sets?.map((setData, setIdx) => (
                            <div key={setIdx} style={{ marginBottom: '14px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '0 0 10px 0' }}>Set {setIdx + 1}</p>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="number"
                                        placeholder="Weight (kg)"
                                        value={setData.weight}
                                        onChange={(e) => {
                                            const updated = { ...trackingData };
                                            updated[exercise.name].sets[setIdx].weight = e.target.value;
                                            setTrackingData(updated);
                                        }}
                                        style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}
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
                                        style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '14px' }}
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
                                        fontWeight: 700,
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    Save Set {setIdx + 1}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setEditingLastSession(false);
                            setTrackingData({});
                        }}
                        style={{
                            width: '100%',
                            backgroundColor: '#94a3b8',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 700,
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Heavy Session */}
            {heavy && (
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fee2e2',
                    border: '2px solid #fca5a5',
                    borderRadius: '12px',
                    marginBottom: '18px'
                }}>
                    <h3 style={{ marginTop: 0, color: '#991b1b', fontSize: '16px' }}>💪 Heavy Day</h3>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                        {heavy.exercises.find(e => e.name === exercise.name)?.sets?.map((set, idx) => (
                            <p key={idx} style={{ margin: '8px 0', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                                Set {idx + 1}:
                                <span style={{ backgroundColor: '#fecaca', padding: '4px 8px', borderRadius: '6px', marginLeft: '8px', fontWeight: 700 }}>
                                    {set.weight}kg × {set.reps} reps
                                </span>
                            </p>
                        ))}
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                        📅 {new Date(heavy.date).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* Track Today */}
            <div className="glass-card" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px' }}>🏋️ Track Today</h3>

                {!trackingData[exercise.name] ? (
                    <button onClick={initializeTracking} className="btn-cta" style={{ width: '100%' }}>▶ Start Tracking</button>
                ) : (
                    <>
                        <div style={{ backgroundColor: 'transparent', padding: '6px 0', borderRadius: '8px', marginBottom: '14px', maxHeight: '350px', overflowY: 'auto' }}>
                            {trackingData[exercise.name]?.sets?.map((setData, setIdx) => (
                                <div key={setIdx} style={{ marginBottom: '14px', padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>Set {setIdx + 1}</p>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input type="number" placeholder="Weight (kg)" value={setData.weight} onChange={(e) => handleSetChange(setIdx, 'weight', e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '14px' }} />
                                        <input type="number" placeholder="Reps" value={setData.reps} onChange={(e) => handleSetChange(setIdx, 'reps', e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '14px' }} />
                                    </div>
                                    <button onClick={() => saveSetTracking(setIdx, setData)} className="btn-cta" style={{ width: '100%', background: 'linear-gradient(90deg, var(--accent-neon-purple), var(--accent-electric-blue))', padding: '10px', borderRadius: '10px' }}>✓ Save Set {setIdx + 1}</button>
                                </div>
                            ))}
                        </div>

                        <button onClick={saveHeavyDay} className="btn-cta" style={{ width: '100%', marginTop: '12px', background: isHeavyDay ? 'linear-gradient(90deg,#ef4444,#dc2626)' : 'linear-gradient(90deg,var(--accent-soft-orange),var(--accent-neon-purple))' }}>{isHeavyDay ? '💪 Heavy Day!' : '💪 Mark as Heavy Day'}</button>
                    </>
                )}
            </div>
        </div>
    );
}