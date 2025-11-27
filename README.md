# Fitness & Habits Tracker

A modern web app to track daily habits, workouts, and progress. Monitor streaks, personal records, and achievements while building healthy routines.

## Features

- **Daily Habits**
  - Add, edit, delete habits
  - Mark habits as completed
  - Track current streaks and best streaks
- **Workouts**
  - Log workout sessions with duration and calories
  - View total workouts and active days
- **Stats & Achievements**
  - Overview of total workouts, active days, habits tracked, current streak
  - Personal records: longest workout, most calories burned, best habit streak
  - Achievements with progress tracking
- **Profile Management**
  - Edit profile info (name, email, bio)
  - Reset all data or delete account
- **Responsive UI**
  - Works on desktop and mobile

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **UI Components:** Lucide icons, Radix UI inspired components
- **Backend:** Node.js + Express (or Firebase)
- **State Management:** React `useState` + `useEffect`
- **Data Persistence:** REST API

## Project Structure

### Frontend

```
src/
 ├─ api/            # API calls to backend (habits, workouts, user)
 ├─ components/     # UI components (cards, inputs, checkboxes, buttons)
 ├─ views/          # Pages: HabitsView, ProfileView, StatsView
 ├─ App.tsx         # Main app component with routes
 └─ main.tsx        # Entry point
```

### Backend

```
server/
 ├─ controllers/    # Business logic for habits, workouts, users
 ├─ routes/         # API routes
 ├─ models/         # Database models (PostgreSQL, MongoDB, or Firebase schemas)
 ├─ services/       # Utility services (email, notifications, streak calculations)
 ├─ index.js        # Server entry point
 └─ config/         # Configuration (DB, environment variables)
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fitness-habits-tracker.git
cd fitness-habits-tracker
```

2. Install frontend dependencies:

```bash
npm install
```

3. Configure API endpoints in `src/api/`.

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## License

MIT License © 2025 Your Name

