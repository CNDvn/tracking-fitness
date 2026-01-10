import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { username, password, name } = req.body;

    // Validation
    if (!username || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        let users = [];
        try {
            users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }

        // Check if user already exists
        if (users.some(u => u.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            password, // In production, hash this!
            name,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
}
