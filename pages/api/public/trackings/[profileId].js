import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const trackingsFilePath = path.join(process.cwd(), 'data', 'trackings.json');

function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
}

export default function handler(req, res) {
  const { profileId } = req.query;
  const { startDate, endDate } = req.query;

  if (!profileId) {
    return res.status(400).json({ message: 'Profile ID is required.' });
  }

  const users = readData(usersFilePath);
  const publicUser = users.find(u => u.publicProfileId === profileId && u.isPublic);

  if (!publicUser) {
    return res.status(404).json({ message: 'Public profile not found or is disabled.' });
  }

  const allTrackings = readData(trackingsFilePath);
  let userTrackings = allTrackings.filter(t => t.userId === publicUser.id);
  
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : new Date(0); // Beginning of time if no start date
    const end = endDate ? new Date(endDate) : new Date(); // Now if no end date
    
    // Set time to end of day for endDate to include all trackings on that day
    end.setHours(23, 59, 59, 999);
    
    userTrackings = userTrackings.filter(t => {
      const trackingDate = new Date(t.date);
      return trackingDate >= start && trackingDate <= end;
    });
  }

  res.status(200).json({
    user: {
      name: publicUser.name,
    },
    trackings: userTrackings.sort((a, b) => new Date(b.date) - new Date(a.date)), // Return newest first
  });
}
