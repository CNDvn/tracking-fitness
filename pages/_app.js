import '../styles/globals.css'
import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export const UserContext = createContext()

export default function App({ Component, pageProps }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Force light mode as default on initial load
        const savedTheme = localStorage.getItem('theme');
        const themeToApply = savedTheme || 'light';
        localStorage.setItem('theme', themeToApply);

        const root = document.documentElement;
        if (themeToApply === 'light') {
            root.classList.remove('dark');
        } else if (themeToApply === 'dark') {
            root.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        // Wait until router is ready to avoid race conditions
        if (!router.isReady) return

        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.removeItem('user')
            }
        }
        setLoading(false)
    }, [router.isReady])

    // Redirect to login if not authenticated (except for login page)
    useEffect(() => {
        if (!loading && !user && router.pathname !== '/login' && router.isReady) {
            router.push('/login')
        }
    }, [user, loading, router.pathname, router.isReady])

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}>
                <p style={{ fontSize: '18px', fontWeight: 600 }}>Loading...</p>
            </div>
        )
    }

    // Always provide the UserContext so pages (including /login) can update it
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Component {...pageProps} />
        </UserContext.Provider>
    )
}