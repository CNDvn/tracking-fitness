import fs from 'fs';
import path from 'path';
import { verifyToken, verifyResourceOwnership } from '../../../lib/auth';

const filePath = path.join(process.cwd(), 'data', 'trackings.json');

export default function handler(req, res) {
    // Verify token
    const tokenVerification = verifyToken(req);
    if (!tokenVerification.valid) {
        return res.status(401).json({ error: tokenVerification.error });
    }

    if (req.method === 'POST') {
        const { trackingId, exerciseName, sets, userId, note } = req.body;

        // SECURITY: Verify user can only update their own trackings
        if (!verifyResourceOwnership(tokenVerification.userId, userId)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        let trackings = [];
        try {
            trackings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }

        // Find and update the tracking - verify ownership
        const tracking = trackings.find(t => t.id === trackingId && t.userId === userId);
        if (tracking) {
            const exercise = tracking.exercises.find(e => e.name === exerciseName);
            if (exercise) {
                // Merge provided sets with existing ones - only update indices that were provided
                // Keep existing sets and update/add new ones based on what was submitted
                if (sets && sets.length > 0) {
                    // Replace sets with only the ones provided (can be partial)
                    exercise.sets = sets;
                }
                // Update exercise note if provided
                if (typeof note === 'string' && note.trim()) {
                    exercise.note = note;
                }
                fs.writeFileSync(filePath, JSON.stringify(trackings, null, 2));
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ error: 'Exercise not found' });
            }
        } else {
            res.status(404).json({ error: 'Tracking not found' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
