import fs from 'fs';
import path from 'path';
import { verifyToken, verifyResourceOwnership } from '../../lib/auth';

const filePath = path.join(process.cwd(), 'data', 'workouts.json');

export default function handler(req, res) {
    // Verify token for all requests
    const token = req.headers.authorization?.split(' ')[1];
    const tokenVerification = verifyToken(token);
    if (!tokenVerification.valid) {
        return res.status(401).json({ error: tokenVerification.error });
    }

    const tokenUserId = tokenVerification.userId;

    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const allWorkouts = JSON.parse(data);

            // Filter workouts by authenticated user only
            const userWorkouts = allWorkouts.filter(w => w.userId === tokenUserId);
            res.status(200).json(userWorkouts);
        } catch {
            res.status(200).json([]);
        }
    } else if (req.method === 'POST') {
        const { name, exercises, userId } = req.body;

        // SECURITY: Verify user can only create workouts for themselves
        if (!verifyResourceOwnership(tokenUserId, userId)) {
            return res.status(403).json({ error: 'Forbidden: You can only create workouts for yourself' });
        }

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