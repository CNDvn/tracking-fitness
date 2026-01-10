import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter();
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

            setMessage('✓ ' + data.message);
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (error) {
            setMessage('Connection error');
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Header */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 style={{ margin: '20px 0 8px 0' }}>💪 Fitness Tracker</h1>
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px', fontWeight: 500 }}>
                    {isLogin ? 'Welcome back' : 'Join our community'}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
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
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
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

                <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
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
                    <div style={{
                        padding: '12px 16px',
                        backgroundColor: message.includes('✓') ? '#ecfdf5' : '#fef2f2',
                        color: message.includes('✓') ? '#059669' : '#dc2626',
                        fontWeight: 600,
                        marginBottom: '16px',
                        borderRadius: '10px',
                        border: `2px solid ${message.includes('✓') ? '#d1fae5' : '#fecaca'}`,
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: 700,
                        background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: loading ? 'none' : '0 4px 16px rgba(59, 130, 246, 0.4)'
                    }}
                >
                    {loading ? '⏳ Loading...' : (isLogin ? '🔓 Login' : '✍️ Register')}
                </button>
            </form>

            {/* Toggle Form */}
            <div style={{ textAlign: 'center', padding: '20px', borderTop: '2px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '14px' }}>
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
                        backgroundColor: '#f1f5f9',
                        color: '#1e40af',
                        border: '2px solid #bfdbfe',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dbeafe';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    {isLogin ? 'Create Account' : 'Back to Login'}
                </button>
            </div>
        </div>
    );
}
