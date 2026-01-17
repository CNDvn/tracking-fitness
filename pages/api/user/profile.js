import fs from 'fs';
import path from 'path';
import { verifyToken } from '../../../lib/auth';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

function getUsers() {
  const usersData = fs.readFileSync(usersFilePath);
  return JSON.parse(usersData);
}

function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const tokenResult = verifyToken(token);
    if (!tokenResult.valid) {
      return res.status(401).json({ message: tokenResult.error });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === tokenResult.userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.method === 'GET') {
      const { name, isPublic, publicProfileId } = users[userIndex];
      return res.status(200).json({ name, isPublic, publicProfileId });
    }

    if (req.method === 'POST') {
      const { isPublic } = req.body;
      
      if (typeof isPublic !== 'boolean') {
        return res.status(400).json({ message: 'Invalid "isPublic" value. It must be a boolean.' });
      }

      users[userIndex].isPublic = isPublic;
      saveUsers(users);

      return res.status(200).json({
        message: 'Profile updated successfully',
        isPublic: users[userIndex].isPublic,
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    // The refactored verifyToken doesn't throw JWT errors, but keep this for other potential issues
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
