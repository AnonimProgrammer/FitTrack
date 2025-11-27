# FitTrack 
**Fitness & Habits Tracker Web Application**

A modern web app to track daily habits, workouts, and progress. Monitor streaks, personal records, and achievements while building healthy routines.

## Team Members

- Omar Ismayilov – Backend Developer  
- Hafiz Jafarov – BA  
- Deniz Aliyev – UI/UX Designer  
- Nemat Shirinzade – Backend Developer  

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
  - Works on desktop

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **UI Components:** Lucide icons, Radix UI inspired components
- **Backend:** Node.js + Express + PostgreSQL
- **State Management:** React `useState` + `useEffect`

## Project Structure

### Frontend

```
src/
 ├─ api/            # API calls to backend (habits, workouts, user, auth)
 ├─ components/     # UI components (cards, inputs, checkboxes, buttons)
 ├─ App.tsx         # Main app component with routes
 └─ main.jsx        # Entry point
```

### Backend

```
server/
 ├─ controller/    # Controller layer 
 ├─ middleware/    # Auth middleware 
 ├─ migration/     # Migration files
 ├─ route/         # API routes
 ├─ repo/          # Repositories of data models 
 ├─ service/       # Business logic for habits, workouts, users and authentication
 ├─ server.js      # Server entry point
 └─ config/        # DB Configuration 
```

