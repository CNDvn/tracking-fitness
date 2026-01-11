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
            {/* Header */}
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>💪</div>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>Fitness Tracker</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '16px', fontWeight: 500 }}>
                    {isLogin ? 'Welcome back' : 'Get started today'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {!isLogin && (
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {message && (
                    <div className={message.includes('✓') ? 'success-message' : 'error-message'} style={{ marginBottom: '16px', textAlign: 'center' }}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        fontSize: '16px',
                        fontWeight: 700,
                        background: loading ? 'var(--text-tertiary)' : 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: loading ? 'none' : '0 6px 16px rgba(0, 122, 255, 0.3)',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? '⏳ Loading...' : (isLogin ? '🔓 Login' : '✍️ Register')}
                </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>OR</p>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            </div>

            {/* Toggle Form */}
            <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setMessage('');
                        setUsername('');
                        setPassword('');
                        setName('');
                    }}
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--primary-color)',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '14px',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: 'var(--card-shadow)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(0.98)';
                        e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                    }}
                >
                    {isLogin ? 'Create Account' : 'Back to Login'}
                </button>
            </div>
        </div>
    );
}
