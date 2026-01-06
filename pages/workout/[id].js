import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WorkoutDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [workout, setWorkout] = useState(null);
    const [trackings, setTrackings] = useState([]);
    const [trackingData, setTrackingData] = useState({});

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

    const getLastSession = (exerciseName) => {
        const sorted = trackings.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted.find(t => t.exercises.some(e => e.name === exerciseName));
    };

    const getHeavyDay = (exerciseName) => {
        const relevantTrackings = trackings.filter(t => t.exercises.some(e => e.name === exerciseName && e.isHeavy));
        const sorted = relevantTrackings.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted[0];
    };

    const handleTrackingChange = (exerciseName, field, value) => {
        setTrackingData({
            ...trackingData,
            [exerciseName]: { ...trackingData[exerciseName], [field]: value }
        });
    };

    const saveTracking = async () => {
        const exercises = workout.exercises.map(ex => ({
            name: ex.name,
            weight: trackingData[ex.name]?.weight || 0,
            sets: trackingData[ex.name]?.sets || ex.sets,
            reps: trackingData[ex.name]?.reps || ex.reps,
            isHeavy: trackingData[ex.name]?.isHeavy || false
        }));
        await fetch('/api/trackings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workoutId: id, date: new Date().toISOString(), exercises })
        });
        router.reload();
    };

    if (!workout) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>{workout.name}</h1>
            {workout.exercises.map((ex, index) => {
                const last = getLastSession(ex.name);
                const heavy = getHeavyDay(ex.name);
                return (
                    <div key={index} className="exercise-card">
                        <h3>{ex.name}</h3>
                        <p style={{ color: '#64748b', margin: '4px 0' }}>{ex.description}</p>
                        <p style={{ fontSize: '14px', color: '#475569' }}>Planned: {ex.sets} sets x {ex.reps} reps, Rest: {ex.restTime}s</p>
                        {(ex.rpe || ex.tempo) && <p style={{ fontSize: '14px', color: '#475569' }}>
                            {ex.rpe && `RPE: ${ex.rpe}/10`} {ex.rpe && ex.tempo && ' | '} {ex.tempo && `Tempo: ${ex.tempo}`}
                        </p>}
                        {last && <p style={{ fontSize: '14px', color: '#059669' }}>Last: Weight {last.exercises.find(e => e.name === ex.name)?.weight}, Sets {last.exercises.find(e => e.name === ex.name)?.sets}, Reps {last.exercises.find(e => e.name === ex.name)?.reps}</p>}
                        {heavy && <p style={{ fontSize: '14px', color: '#dc2626' }}>Heavy: Weight {heavy.exercises.find(e => e.name === ex.name)?.weight}, Sets {heavy.exercises.find(e => e.name === ex.name)?.sets}, Reps {heavy.exercises.find(e => e.name === ex.name)?.reps}</p>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <input
                                type="number"
                                placeholder="Weight"
                                onChange={(e) => handleTrackingChange(ex.name, 'weight', e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                placeholder="Sets"
                                defaultValue={ex.sets}
                                onChange={(e) => handleTrackingChange(ex.name, 'sets', e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                placeholder="Reps"
                                defaultValue={ex.reps}
                                onChange={(e) => handleTrackingChange(ex.name, 'reps', e.target.value)}
                                style={{ flex: 1 }}
                            />
                        </div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                onChange={(e) => handleTrackingChange(ex.name, 'isHeavy', e.target.checked)}
                            />
                            Mark as Heavy
                        </label>
                    </div>
                );
            })}
            <button onClick={saveTracking} style={{ width: '100%', marginTop: '20px' }}>Save Tracking</button>
        </div>
    );
}