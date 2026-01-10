import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'trackings.json');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { workoutId, exerciseName, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        let trackings = [];
        try {
            trackings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }

        // Mark today's session as heavy for the exercise
        const today = new Date().toISOString().split('T')[0];
        const todayTracking = trackings.find(t => {
            const tDate = new Date(t.date).toISOString().split('T')[0];
            return tDate === today && t.workoutId === workoutId && t.userId === userId;
        });

        if (todayTracking) {
            const exercise = todayTracking.exercises.find(e => e.name === exerciseName);
            if (exercise) {
                exercise.isHeavy = true;
            }
            fs.writeFileSync(filePath, JSON.stringify(trackings, null, 2));
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ error: 'Today tracking not found' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}