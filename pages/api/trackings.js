import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'trackings.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { workoutId } = req.query;
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            let trackings = JSON.parse(data);
            if (workoutId) {
                trackings = trackings.filter(t => t.workoutId === workoutId);
            }
            res.status(200).json(trackings);
        } catch {
            res.status(200).json([]);
        }
    } else if (req.method === 'POST') {
        const { workoutId, date, exercises } = req.body;
        let trackings = [];
        try {
            trackings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }
        const newTracking = { id: Date.now().toString(), workoutId, date, exercises };
        trackings.push(newTracking);
        fs.writeFileSync(filePath, JSON.stringify(trackings, null, 2));
        res.status(201).json(newTracking);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}