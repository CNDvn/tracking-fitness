import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Helper to format date as YYYY-MM-DD for input fields
const formatDateForInput = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

export default function PublicProfile() {
    const router = useRouter();
    const { profileId } = router.query;

    const [user, setUser] = useState(null);
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Default to last 7 days
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 6); // 7 days including today

    const [dateRange, setDateRange] = useState({
        start: formatDateForInput(defaultStartDate),
        end: formatDateForInput(defaultEndDate),
    });

    useEffect(() => {
        if (profileId) {
            fetchData();
        }
    }, [profileId, dateRange.start, dateRange.end]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        const url = new URL(`/api/public/trackings/${profileId}`, window.location.origin);
        url.searchParams.append('startDate', dateRange.start);
        url.searchParams.append('endDate', dateRange.end);

        try {
            const res = await fetch(url.toString());
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Error: ${res.status}`);
            }
            const data = await res.json();
            setUser(data.user);
            setTrackings(data.trackings);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="container">
            {/* Header */}
            <div style={{ margin: '28px 0', textAlign: 'center' }}>
                {loading && !user && <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Loading Profile...</h1>}
                {error && <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--danger-color)' }}>Profile Not Found</h1>}
                {user && <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{user.name}'s Training Log</h1>}
            </div>

            {/* Date Range Filter */}
            <div className="card" style={{ marginBottom: '28px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="start" className="meta" style={{marginBottom: '4px', display: 'block'}}>From</label>
                    <input type="date" name="start" id="start" value={dateRange.start} onChange={handleDateChange} />
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="end" className="meta" style={{marginBottom: '4px', display: 'block'}}>To</label>
                    <input type="date" name="end" id="end" value={dateRange.end} onChange={handleDateChange} />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading"><p>Loading tracking data...</p></div>
            ) : error ? (
                <div className="error-message" style={{ textAlign: 'center' }}>{error}</div>
            ) : trackings.length === 0 ? (
                 <div className="empty-state">
                    <div className="empty-state-icon">🗓️</div>
                    <p className="empty-state-title">No Workouts Logged</p>
                    <p className="empty-state-description">There is no tracking data available for the selected date range.</p>
                </div>
            ) : (
                <ul style={{ gap: '20px' }}>
                    {trackings.map(tracking => (
                        <li key={tracking.id} className="card">
                            <p className="meta" style={{ marginBottom: '8px' }}>{new Date(tracking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            {tracking.exercises.map((exercise, exIndex) => (
                                <div key={exIndex} style={{ borderTop: exIndex > 0 ? '1px solid var(--border-color)' : 'none', paddingTop: exIndex > 0 ? '12px' : 0, marginTop: '12px' }}>
                                    <p className="workout-card-title">{exercise.name}</p>
                                    <ul style={{ marginTop: '8px', gap: '4px' }}>
                                        {exercise.sets.map((set, setIndex) => (
                                            <li key={setIndex} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Set {setIndex + 1}</span>
                                                <span><strong>{set.weight}</strong> kg x <strong>{set.reps}</strong> reps</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {exercise.note && (
                                        <div className="info-message" style={{ marginTop: '12px', fontSize: '13px' }}>
                                            <strong>Note:</strong> {exercise.note}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
