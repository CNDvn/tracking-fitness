import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    try {
        let users = [];
        try {
            users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch { }

        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword,
            token: Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
        });
    } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
}
