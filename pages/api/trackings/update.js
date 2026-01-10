import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'trackings.json');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { trackingId, exerciseName, setIndex, setData } = req.body;
        let trackings = [];
        try {
            trackings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }

        // Find and update the tracking
        const tracking = trackings.find(t => t.id === trackingId);
        if (tracking) {
            const exercise = tracking.exercises.find(e => e.name === exerciseName);
            if (exercise && exercise.sets) {
                exercise.sets[setIndex] = setData;
                fs.writeFileSync(filePath, JSON.stringify(trackings, null, 2));
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ error: 'Exercise or sets not found' });
            }
        } else {
            res.status(404).json({ error: 'Tracking not found' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}