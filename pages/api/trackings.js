import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'trackings.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { workoutId, userId } = req.query;
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            let trackings = JSON.parse(data);
            if (workoutId) {
                trackings = trackings.filter(t => t.workoutId === workoutId);
            }
            if (userId) {
                trackings = trackings.filter(t => t.userId === userId);
            }
            res.status(200).json(trackings);
        } catch {
            res.status(200).json([]);
        }
    } else if (req.method === 'POST') {
        const { workoutId, date, exercises, isSingleSet, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        let trackings = [];
        try {
            trackings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }

        // If it's a single set save, merge with today's tracking or create new
        if (isSingleSet) {
            const today = new Date().toISOString().split('T')[0];
            const todayTracking = trackings.find(t => {
                const tDate = new Date(t.date).toISOString().split('T')[0];
                return tDate === today && t.workoutId === workoutId && t.userId === userId;
            });

            if (todayTracking) {
                // Update existing today's tracking
                exercises.forEach(newEx => {
                    const existingEx = todayTracking.exercises.find(e => e.name === newEx.name);
                    if (existingEx) {
                        if (!existingEx.sets) existingEx.sets = [];
                        existingEx.sets.push(newEx.sets[0]);
                    } else {
                        todayTracking.exercises.push(newEx);
                    }
                });
            } else {
                // Create new today's tracking
                const newTracking = { id: Date.now().toString(), userId, workoutId, date: new Date().toISOString(), exercises };
                trackings.push(newTracking);
            }
        } else {
            // Save entire session
            const newTracking = { id: Date.now().toString(), userId, workoutId, date, exercises };
            trackings.push(newTracking);
        }

        fs.writeFileSync(filePath, JSON.stringify(trackings, null, 2));
        res.status(201).json({ success: true });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}