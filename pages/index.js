import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from './_app';

export default function Home() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (user && router.isReady) {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('No token found in localStorage');
                setLoading(false);
                return;
            }

            fetch(`/api/workouts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    // Handle both array responses and error objects
                    if (Array.isArray(data)) {
                        setWorkouts(data);
                    } else {
                        console.error('API returned non-array response:', data);
                        setWorkouts([]);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching workouts:', error);
                    setWorkouts([]);
                    setLoading(false);
                });
        }
    }, [user, router.isReady]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <div className="container">
            {/* Header with User Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0' }}>Fitness Tracker</h1>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '14px', fontWeight: 500 }}>
                        Welcome, {user?.name}! 👋
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: '2px solid #fecaca',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                >
                    🚪 Logout
                </button>
            </div>

            {/* Create New Workout Button */}
            <Link href="/setup">
                <button style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    marginBottom: '28px',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                }}>
                    ＋ Setup New Workout
                </button>
            </Link>

            {/* Workouts Section */}
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>
                    Your Workouts ({workouts.length})
                </h2>
            </div>

            {/* Workouts List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <p style={{ fontSize: '14px' }}>Loading...</p>
                </div>
            ) : workouts.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '12px',
                    border: '2px dashed #bbf7d0'
                }}>
                    <p style={{ color: '#047857', fontSize: '14px', fontWeight: 500, margin: 0 }}>
                        No workouts yet. Create one to get started! 💪
                    </p>
                </div>
            ) : (
                <ul style={{ gap: '14px' }}>
                    {workouts.map(workout => (
                        <li key={workout.id}>
                            <Link href={`/workout/${workout.id}`} style={{ textDecoration: 'none' }}>
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
                                            {workout.name}
                                        </p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '13px',
                                            color: '#64748b',
                                            fontWeight: 500
                                        }}>
                                            {workout.exercises?.length || 0} exercises
                                        </p>
                                    </div>
                                    <div style={{
                                        fontSize: '20px',
                                        color: '#3b82f6',
                                        fontWeight: 700
                                    }}>
                                        →
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}