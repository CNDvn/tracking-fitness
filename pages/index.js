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
    const [profile, setProfile] = useState({ isPublic: false, publicProfileId: null });
    const [profileLoading, setProfileLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState('');

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
                setProfileLoading(false);
                return;
            }

            // Fetch workouts
            fetch(`/api/workouts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setWorkouts(data);
                    } else {
                        console.error('API returned non-array response for workouts:', data);
                        setWorkouts([]);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching workouts:', error);
                    setWorkouts([]);
                    setLoading(false);
                });

            // Fetch profile status
            fetch(`/api/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.publicProfileId) {
                        setProfile(data);
                    }
                    setProfileLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                    setProfileLoading(false);
                });
        }
    }, [user, router.isReady]);

    const togglePublicProfile = async () => {
        const token = localStorage.getItem('token');
        const newIsPublic = !profile.isPublic;
        try {
            const res = await fetch('/api/user/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isPublic: newIsPublic }),
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(prev => ({ ...prev, isPublic: data.isPublic }));
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error toggling public profile:', error);
        }
    };

    const copyToClipboard = () => {
        const url = `${window.location.origin}/public/${profile.publicProfileId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            setCopySuccess('Failed');
            console.error('Failed to copy: ', err);
        });
    };
    
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

            {/* Public Profile Section */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Public Profile</h2>
                {profileLoading ? (
                    <div className="loading"><p>Loading profile settings...</p></div>
                ) : (
                    <div className="neumo" style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ margin: 0, fontWeight: 500 }}>Share your progress</p>
                            <label className="switch">
                                <input type="checkbox" checked={profile.isPublic} onChange={togglePublicProfile} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        {profile.isPublic && (
                            <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                                <p className="muted" style={{ fontSize: '13px', margin: '0 0 8px 0' }}>Your public profile is active. Anyone with the link can see your progress.</p>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/public/${profile.publicProfileId}`}
                                        style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--secondary-bg)', color: 'var(--text-secondary)'}} 
                                    />
                                    <button onClick={copyToClipboard} className="btn" style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
                                        {copySuccess || 'Copy'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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