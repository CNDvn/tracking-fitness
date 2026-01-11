import fs from 'fs';
import path from 'path';
import { verifyToken, verifyResourceOwnership } from '../../lib/auth';

const filePath = path.join(process.cwd(), 'data', 'trackings.json');

export default function handler(req, res) {
    // Verify token for all requests
    const tokenVerification = verifyToken(req);
    if (!tokenVerification.valid) {
        return res.status(401).json({ error: tokenVerification.error });
    }

    const tokenUserId = tokenVerification.userId;

    if (req.method === 'GET') {
        const { workoutId } = req.query;
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            let trackings = JSON.parse(data);

            // SECURITY: Always filter by authenticated user
            trackings = trackings.filter(t => t.userId === tokenUserId);

            if (workoutId) {
                trackings = trackings.filter(t => t.workoutId === workoutId);
            }
            res.status(200).json(trackings);
        } catch {
            res.status(200).json([]);
        }
    } else if (req.method === 'POST') {
        const { workoutId, date, exercises, isSingleSet, userId, note, exerciseName } = req.body;

        // SECURITY: Verify user can only save trackings for themselves
        if (!verifyResourceOwnership(tokenUserId, userId)) {
            return res.status(403).json({ error: 'Forbidden: You can only save trackings for yourself' });
        }

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
                        // Merge note if provided
                        if (typeof note === 'string' && note.trim()) {
                            existingEx.note = note;
                        }
                    } else {
                        // Add note to the exercise being added
                        if (typeof note === 'string' && note.trim()) {
                            newEx.note = note;
                        }
                        todayTracking.exercises.push(newEx);
                    }
                });
            } else {
                // Create new today's tracking
                // Add note to exercises if provided
                const exercisesWithNote = exercises.map(ex => ({
                    ...ex,
                    ...(typeof note === 'string' && note.trim() ? { note } : {})
                }));
                const newTracking = { id: Date.now().toString(), userId, workoutId, date: new Date().toISOString(), exercises: exercisesWithNote };
                trackings.push(newTracking);
            }
        } else {
            // Save entire session - add note to exercises
            const exercisesWithNote = exercises.map(ex => ({
                ...ex,
                ...(typeof note === 'string' && note.trim() ? { note } : {})
            }));
            const newTracking = { id: Date.now().toString(), userId, workoutId, date, exercises: exercisesWithNote };
            trackings.push(newTracking);
        }

        fs.writeFileSync(filePath, JSON.stringify(trackings, null, 2));
        res.status(201).json({ success: true });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}