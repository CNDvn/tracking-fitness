import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Setup() {
    const [name, setName] = useState('');
    const [exercises, setExercises] = useState([]);
    const [exerciseName, setExerciseName] = useState('');
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [description, setDescription] = useState('');
    const [restTime, setRestTime] = useState('');
    const [rpe, setRpe] = useState('');
    const [tempo, setTempo] = useState('');
    const router = useRouter();

    const addExercise = () => {
        if (exerciseName && reps && sets) {
            setExercises([...exercises, { name: exerciseName, reps, sets, description, restTime, rpe, tempo }]);
            setExerciseName('');
            setReps('');
            setSets('');
            setDescription('');
            setRestTime('');
            setRpe('');
            setTempo('');
        }
    };

    const saveWorkout = async () => {
        if (name && exercises.length > 0) {
            const res = await fetch('/api/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, exercises })
            });
            if (res.ok) {
                router.push('/');
            }
        }
    };

    return (
        <div className="container">
            <h1>Setup Workout</h1>
            <div className="exercise-card">
                <input
                    type="text"
                    placeholder="Workout Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <h2>Add Exercises</h2>
            <div className="exercise-card">
                <input
                    type="text"
                    placeholder="Exercise Name"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        placeholder="Sets"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <input
                        type="number"
                        placeholder="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        style={{ flex: 1 }}
                    />
                </div>
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                />
                <input
                    type="number"
                    placeholder="Rest Time (seconds)"
                    value={restTime}
                    onChange={(e) => setRestTime(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        placeholder="RPE (1-10)"
                        value={rpe}
                        onChange={(e) => setRpe(e.target.value)}
                        min="1"
                        max="10"
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        placeholder="Tempo (e.g., 3-1-2-0)"
                        value={tempo}
                        onChange={(e) => setTempo(e.target.value)}
                        style={{ flex: 1 }}
                    />
                </div>
                <button onClick={addExercise} style={{ width: '100%', marginTop: '12px' }}>Add Exercise</button>
            </div>
            <h2>Exercises Added</h2>
            <ul>
                {exercises.map((ex, index) => (
                    <li key={index} className="exercise-card">
                        <strong>{ex.name}</strong> - {ex.sets} sets x {ex.reps} reps
                        {ex.description && <p style={{ margin: '4px 0', color: '#64748b' }}>{ex.description}</p>}
                        {ex.restTime && <p style={{ margin: '4px 0', color: '#64748b' }}>Rest: {ex.restTime}s</p>}
                        {ex.rpe && <p style={{ margin: '4px 0', color: '#64748b' }}>RPE: {ex.rpe}/10</p>}
                        {ex.tempo && <p style={{ margin: '4px 0', color: '#64748b' }}>Tempo: {ex.tempo}</p>}
                    </li>
                ))}
            </ul>
            <button onClick={saveWorkout} style={{ width: '100%', marginTop: '20px' }}>Save Workout</button>
        </div>
    );
}