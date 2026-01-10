import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'workouts.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const allWorkouts = JSON.parse(data);
            // Filter workouts by userId from query
            const userId = req.query.userId;
            const userWorkouts = userId
                ? allWorkouts.filter(w => w.userId === userId)
                : allWorkouts;
            res.status(200).json(userWorkouts);
        } catch {
            res.status(200).json([]);
        }
    } else if (req.method === 'POST') {
        const { name, exercises, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        let workouts = [];
        try {
            workouts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }
        const newWorkout = { id: Date.now().toString(), userId, name, exercises };
        workouts.push(newWorkout);
        fs.writeFileSync(filePath, JSON.stringify(workouts, null, 2));
        res.status(201).json(newWorkout);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}