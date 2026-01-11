import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from './_app';

export default function Login() {
    const router = useRouter();
    const { setUser } = useContext(UserContext);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const body = isLogin
                ? { username, password }
                : { username, password, name };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || 'Error occurred');
                setLoading(false);
                return;
            }

            // Save user info and token to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            // Update app context immediately so redirect shows authenticated UI
            try {
                setUser(data.user);
            } catch (e) {
                // setUser may be undefined if provider wasn't present, ignore
            }

            setMessage('✓ ' + data.message);
            setTimeout(() => {
                router.push('/');
            }, 500);
        } catch (error) {
            setMessage('Connection error');
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', padding: '24px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div className="emoji-avatar" style={{ background: 'linear-gradient(90deg,var(--primary-color),var(--primary-dark))', color: 'white' }}>💪</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 900 }}>Fitness</h1>
                            <div className="muted" style={{ fontWeight: 600, fontSize: '13px' }}>{isLogin ? 'Welcome back' : 'Create your account'}</div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label className="caps">Username</label>
                            <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="caps">Full name</label>
                                <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
                            </div>
                        )}

                        <div>
                            <label className="caps">Password</label>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                        </div>

                        {message && (
                            <div className={message.includes('✓') ? 'success-message' : 'error-message'} style={{ textAlign: 'center' }}>{message}</div>
                        )}

                        <button type="submit" disabled={loading} className="btn-cta">{loading ? '⏳ Loading...' : (isLogin ? '🔓 Login' : '✍️ Register')}</button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '14px', justifyContent: 'center' }}>
                        <div style={{ height: '1px', background: 'var(--border-color)', flex: 1 }} />
                        <div className="muted" style={{ fontSize: '12px', fontWeight: 700 }}>OR</div>
                        <div style={{ height: '1px', background: 'var(--border-color)', flex: 1 }} />
                    </div>

                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <p className="muted" style={{ margin: '0 0 8px 0' }}>{isLogin ? "Don't have an account?" : 'Already have an account?'}</p>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setMessage(''); setUsername(''); setPassword(''); setName(''); }}
                            className="btn-outline"
                            style={{ padding: '10px 18px', borderRadius: '10px', fontWeight: 600 }}
                        >
                            {isLogin ? 'Create Account' : 'Back to Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
