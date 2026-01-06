import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        fetch('/api/workouts')
            .then(res => res.json())
            .then(data => setWorkouts(data));
    }, []);

    return (
        <div className="container">
            <h1>Fitness Tracker</h1>
            <Link href="/setup">
                <button>Setup New Workout</button>
            </Link>
            <h2>Your Workouts</h2>
            <ul>
                {workouts.map(workout => (
                    <li key={workout.id}>
                        <Link href={`/workout/${workout.id}`} className="workout-link">
                            {workout.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}