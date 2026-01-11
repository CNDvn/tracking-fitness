import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from './_app';

export default function Home() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    const [theme, setTheme] = useState('system');

    useEffect(() => {
        // Load theme preference and apply
        const saved = localStorage.getItem('theme');
        const prefer = saved || 'system';
        setTheme(prefer);
        applyTheme(prefer);
    }, []);

    const applyTheme = (t) => {
        const root = document.documentElement;
        if (t === 'dark') {
            root.classList.add('dark');
        } else if (t === 'light') {
            root.classList.remove('dark');
        } else {
            // system
            root.classList.remove('dark');
            // let OS handle via prefers-color-scheme media query
        }
    };

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
        applyTheme(next);
    };

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
            {/* Header Section */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800 }}>💪 Fitness</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '16px', fontWeight: 500 }}>
                            Welcome, <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                padding: '8px 10px',
                                fontSize: '14px',
                                borderRadius: '10px',
                                color: 'var(--text-primary)'
                            }}
                        >
                            {theme === 'dark' ? '🌙' : '☀️'}
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'var(--danger-color)',
                                padding: '8px 14px',
                                fontSize: '13px',
                                borderRadius: '10px',
                                boxShadow: '0 2px 8px rgba(255, 59, 48, 0.3)',
                                minWidth: 'auto'
                            }}
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Workout Button */}
            <Link href="/setup">
                <button style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 700,
                    background: 'var(--primary-color)',
                    marginBottom: '32px',
                    boxShadow: '0 6px 16px rgba(0, 122, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    ＋ Setup New Workout
                </button>
            </Link>

            {/* Section Header */}
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    Your Workouts
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                    {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Workouts List */}
            {loading ? (
                <div className="loading">
                    <p>Loading your workouts...</p>
                </div>
            ) : workouts.length === 0 ? (
                <div className="empty-state" style={{ marginBottom: '32px' }}>
                    <div className="empty-state-icon">💪</div>
                    <p className="empty-state-title">No workouts yet</p>
                    <p className="empty-state-description">Create your first workout to get started</p>
                </div>
            ) : (
                <ul style={{ gap: '12px', marginBottom: '32px' }}>
                    {workouts.map(workout => (
                        <li key={workout.id}>
                            <Link href={`/workout/${workout.id}`} style={{ textDecoration: 'none' }}>
                                <div className="workout-card">
                                    <div>
                                        <p className="workout-card-title">{workout.name}</p>
                                        <p className="workout-card-subtitle">{workout.exercises?.length || 0} exercises</p>
                                    </div>
                                    <div style={{
                                        fontSize: '20px',
                                        color: 'var(--primary-color)',
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