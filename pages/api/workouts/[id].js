import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'workouts.json');

export default function handler(req, res) {
    const { id } = req.query;
    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const workouts = JSON.parse(data);
            const workout = workouts.find(w => w.id === id);
            if (workout) {
                res.status(200).json(workout);
            } else {
                res.status(404).json({ message: 'Workout not found' });
            }
        } catch {
            res.status(404).json({ message: 'Workout not found' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}