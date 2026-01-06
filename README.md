# Fitness Tracking App

A beautiful, mobile-first fitness tracking application built with Next.js and Tailwind CSS, optimized for iPhone 13 Pro Max.

## Features

- **Setup Workouts**: Create workout sessions with exercises including name, reps, sets, description, rest time, RPE (1-10), and tempo (e.g., 3-1-2-0).
- **Track Workouts**: View a list of all your workouts.
- **Workout Details**: See exercise details with historical data from the last session and the heaviest day.
- **Add Tracking**: Record weight, sets, reps for each exercise in a session, and mark individual exercises as "heavy".

## UI Highlights

- Modern gradient buttons with hover effects
- Card-based layout for exercises
- Smooth transitions and shadows
- Color-coded historical data (green for last session, red for heavy days)
- Responsive design optimized for mobile

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Go to the home page to see your workouts.
- Click "Setup New Workout" to create a new workout.
- Click on a workout to view details and add tracking data.

**Field Explanations:**
- **RPE (Rate of Perceived Exertion)**: Scale from 1-10 indicating how difficult the exercise feels
- **Tempo**: Movement timing pattern (e.g., 3-1-2-0 = 3s eccentric, 1s pause, 2s concentric, 0s pause)

## Docker Deployment

### Prerequisites
- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

### Quick Start with Docker Compose

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Manual Docker Commands

1. **Build the Docker image:**
   ```bash
   docker build -t fitness-tracker .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 -v $(pwd)/data:/app/data fitness-tracker
   ```

### Data Persistence

The `docker-compose.yml` mounts the `./data` directory to persist your workouts and tracking data between container restarts.

### Production Notes

- The app runs on port 3000
- Data is stored in JSON files in the `/app/data` directory
- The container uses a non-root user for security