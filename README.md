# Sparky's Scrapbook 🤖

Sparky's Scrapbook is an educational PWA (Progressive Web App) where kids help Sparky the Robot rebuild his scrapbook by earning gears and coins through quizzes.

## 🌟 Features

-   **Interactive Quiz System**: Answer questions to earn rewards.
-   **In-Game Economy**: Earn coins to buy upgrades for Sparky (Rocket Boots, Hats, etc.).
-   **Admin Dashboard**: Manage questions (Edit/Delete/Add) easily.
-   **Self-Hosted**: Runs 100% locally on your home server with Docker.
-   **Offline Capable**: Works as a PWA on iOS/Android.

## 🚀 Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion.
-   **Backend**: Node.js, Express, Better-SQLite3.
-   **Container**: Docker, Nginx.

## 🛠️ Getting Started (Local Development)

1.  **Install Dependencies**
    ```bash
    npm install
    cd server && npm install && cd ..
    ```

2.  **Start the Backend**
    ```bash
    node server/index.js
    ```
    *Runs on http://localhost:3000*

3.  **Start the Frontend**
    ```bash
    npm run dev
    ```
    *Runs on http://localhost:5173* (Proxies API calls to backend)

## 🐳 Deployment (Docker)

To run on your home server (Synology, Raspberry Pi, etc.):

1.  **Run with Docker Compose**
    ```bash
    docker compose up -d --build
    ```

2.  **Access**
    The app will be available at `http://localhost:8080`.

## 🔒 Security

-   All data is stored locally in `./server/data/sparky.db`.
-   No cloud dependencies.
-   **Note**: The Admin interface is currently unprotected (intended for local home network usage).

## 📄 License

MIT
