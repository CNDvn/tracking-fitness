import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from './_app';

export default function Home() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Load theme preference and apply - default to light mode
        const saved = localStorage.getItem('theme');
        const prefer = saved || 'light';
        setTheme(prefer);
        applyTheme(prefer);
    }, []);

    const applyTheme = (t) => {
        const root = document.documentElement;
        if (t === 'dark') {
            root.classList.add('dark');
        } else {
            // Always use light mode by default
            root.classList.remove('dark');
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
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="emoji-avatar" style={{ background: 'linear-gradient(90deg,var(--accent-electric-blue),var(--accent-neon-purple))', color: 'white' }}>💪</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 900 }}>Hello, <span style={{ color: 'var(--primary-color)' }}>{user?.name?.split(' ')[0]}</span></h1>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '10px' }}>{theme === 'dark' ? '🌙' : '☀️'}</button>
                        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '10px' }}>🚪</button>
                    </div>
                </div>

                <div>
                    <Link href="/setup" legacyBehavior>
                        <a style={{ textDecoration: 'none' }}>
                            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px' }}>
                                <div>
                                    <div style={{ fontWeight: 800 }}>Create a new workout</div>
                                </div>
                                <div>
                                    <button className="btn-cta">＋ Setup</button>
                                </div>
                            </div>
                        </a>
                    </Link>
                </div>
            </div>

            {/* Section Header */}
            <div style={{ marginBottom: '12px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>Your Workouts</h2>
                <div className="muted" style={{ fontSize: '13px' }}>{workouts.length} workout{workouts.length !== 1 ? 's' : ''}</div>
            </div>

            {/* Workouts List */}
            {loading ? (
                <div className="loading">
                    <p>Loading your workouts...</p>
                </div>
            ) : workouts.length === 0 ? (
                <div className="empty-state" style={{ marginBottom: '32px' }}>
                    <div className="empty-state-icon">💪</div>
                    <p className="empty-state-title" style={{ fontWeight: 800, marginTop: '12px' }}>No workouts yet</p>
                    <p className="empty-state-description muted">Create your first workout to get started</p>
                </div>
            ) : (
                <ul style={{ gap: '12px', marginBottom: '32px' }}>
                    {workouts.map(workout => (
                        <li key={workout.id}>
                            <Link href={`/workout/${workout.id}`} legacyBehavior>
                                <a style={{ textDecoration: 'none' }}>
                                    <div className="neumo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px' }}>
                                        <div>
                                            <p className="workout-card-title" style={{ margin: 0 }}>{workout.name}</p>
                                            <p className="workout-card-subtitle muted" style={{ marginTop: '6px' }}>{workout.exercises?.length || 0} exercises</p>
                                        </div>
                                        <div style={{ fontSize: '20px', color: 'var(--primary-color)', fontWeight: 800 }}>→</div>
                                    </div>
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}