# Gym Flow 🏋️‍♂️

A sleek, mobile-first workout session builder designed for lifters training with foundational equipment—specifically **dumbbells, barbells, and bodyweight**. 

Gym Flow allows you to browse a rich pool of exercises, filter by target muscle groups, build custom daily workout sessions on the fly, and stay disciplined with an integrated self-destructing workout timer.

---

## ✨ Key Features

*   **📱 Mobile-First Native Experience:** Designed specifically for one-handed thumb navigation during intense workouts. Features sticky top navigation and a seamless tab switcher (`Exercise Pool` vs. `My Session`).
*   **💪 Curated Exercise Pool (38+ Exercises):** A lightweight JSON-backed database focused on high-yield movements without relying on excessive gym machines.
*   **🔍 Instant Search & Muscle Chips:** Filter instantly by muscle group (**Chest, Back, Shoulders, Legs, Core, etc.**) using horizontal swipeable chips, or search by exercise name and equipment type.
*   **📋 Session Builder & Duplicate Protection:** Add exercises to your daily workout list with clear visual feedback (`✓ Added to Session`). Prevent accidental duplicates and wipe your list in one tap with **Clear All**.
*   **⏰ Self-Destructing Workout Timer:** Set your target workout duration in minutes and launch the timer. Monitor remaining time via a live glowing badge in the header—when the clock hits `00:00`, your session automatically self-destructs and resets!
*   **🎥 Unclipped Motion Guides:** Form-check GIFs are rendered with full visibility (`object-contain`), ensuring demonstration visuals are never cropped.

---

## 🛠️ Tech Stack

*   **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Backend / API:** Node.js, Express (Serving structured REST endpoints from `exercises.json`)

---

## 📂 Project Structure

```text
GYMMY/
├── client/
│   ├── public/
│   │   └── gifs/             # Exercise demonstration GIF files
│   ├── src/
│   │   ├── App.jsx           # Main mobile-first application & timer logic
│   │   ├── store.js          # Zustand store for active session state
│   │   ├── index.html
│   │   └── tailwind.config.js
│   └── package.json
└── server/
    ├── seed/
    │   └── exercises.json    # Exercise database (Dumbbell, Barbell, Bodyweight)
    ├── server.js             # Express API server
    └── package.json
```









🚀 Getting Started
1. Prerequisites

Make sure you have Node.js (v18+) and npm installed on your machine.
2. Start the Backend API Server

Navigate to the server directory, install dependencies, and launch the API:
Bash

cd server
npm install
npm run dev # or node server.js

The server will run on http://localhost:5000 and serve /api/exercises.
3. Start the Vite React Frontend

Open a new terminal window, navigate to the client directory, install dependencies, and start the frontend:
Bash

cd client
npm install
npm run dev

Open your browser to the local Vite URL (typically http://localhost:5173) and turn on Mobile Responsive Inspection in your browser DevTools!
🖼️ Adding Custom GIFs

To include visual form guides for each exercise:

    Place your .gif files inside the client/public/gifs/ directory.

    Ensure the filename matches the mediaUrl path defined in server/seed/exercises.json (e.g., /gifs/push-ups.gif).

    If no GIF is found, the app automatically falls back to a clean styled placeholder image.

📄 License

This project is open-source and available under the MIT License.
