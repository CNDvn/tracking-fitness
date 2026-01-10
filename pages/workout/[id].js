import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function WorkoutDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [workout, setWorkout] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/workouts/${id}`)
                .then(res => res.json())
                .then(data => setWorkout(data));
        }
    }, [id]);

    if (!workout) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
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
                <h1 style={{ margin: 0 }}>{workout.name}</h1>
            </div>

            <h2 style={{ marginTop: '20px', marginBottom: '16px' }}>Exercises</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {workout.exercises.map((ex, index) => (
                    <li key={index} style={{ marginBottom: '12px' }}>
                        <Link href={`/workout/${id}/exercise/${index}`} className="workout-link" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{ex.name}</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>{ex.sets} sets × {ex.reps} reps</p>
                            </div>
                            <span style={{ fontSize: '18px' }}>→</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}