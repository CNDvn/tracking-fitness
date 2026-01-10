import '../styles/globals.css'
import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export const UserContext = createContext()

export default function App({ Component, pageProps }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.removeItem('user')
            }
        }
        setLoading(false)
    }, [])

    // Redirect to login if not authenticated (except for login page)
    useEffect(() => {
        if (!loading && !user && router.pathname !== '/login') {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white'
            }}>
                <p style={{ fontSize: '18px', fontWeight: 600 }}>Loading...</p>
            </div>
        )
    }

    // Show login page without context if not authenticated
    if (!user && router.pathname === '/login') {
        return <Component {...pageProps} />
    }

    // Show component with user context if authenticated
    if (user) {
        return (
            <UserContext.Provider value={{ user, setUser }}>
                <Component {...pageProps} />
            </UserContext.Provider>
        )
    }

    return null
}