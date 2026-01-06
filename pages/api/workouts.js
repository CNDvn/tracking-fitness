import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'workouts.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            res.status(200).json(JSON.parse(data));
        } catch {
            res.status(200).json([]);
        }
    } else if (req.method === 'POST') {
        const { name, exercises } = req.body;
        let workouts = [];
        try {
            workouts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }
        const newWorkout = { id: Date.now().toString(), name, exercises };
        workouts.push(newWorkout);
        fs.writeFileSync(filePath, JSON.stringify(workouts, null, 2));
        res.status(201).json(newWorkout);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}