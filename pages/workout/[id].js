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

    if (!workout) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Loading...</p>
        </div>
    );

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
                <div>
                    <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{workout.name}</h1>
                </div>
            </div>

            {/* Exercises Section */}
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                    Exercises ({workout.exercises?.length || 0})
                </h2>
            </div>

            {/* Exercises List */}
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {workout.exercises.map((ex, index) => (
                    <li key={index}>
                        <Link href={`/workout/${id}/exercise/${index}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 18px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.2)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        marginBottom: '6px'
                                    }}>
                                        {ex.name}
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        color: '#64748b',
                                        fontWeight: 500
                                    }}>
                                        {ex.sets} sets × {ex.reps} reps
                                    </p>
                                </div>
                                <div style={{
                                    fontSize: '20px',
                                    color: '#3b82f6',
                                    fontWeight: 700,
                                    transition: 'transform 0.3s ease'
                                }}>
                                    →
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}