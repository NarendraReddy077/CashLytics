# CashLytics 🚀

**CashLytics** is a premium personal finance management application designed to provide a seamless and visually stunning experience for tracking your financial health.

## ✨ Features

- **Secure Authentication**: User sign-in and registration powered by Supabase.
- **Transaction Management**: Easily add, edit, and delete your daily expenses and income.
- **Weekly Insights**: Automated weekly financial reports to track your spending habits.
- **Premium Dashboard**: A modern, glassmorphic UI with real-time updates and interactive components.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

## 🛠 Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Frontend**: [React](https://reactjs.org/) (Vite, TailwindCSS)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Infrastructure**: [Docker](https://www.docker.com/) & Docker Compose

## 📁 Project Structure

- `/backend`: FastAPI application handles the business logic and API endpoints.
- `/frontend`: React application built with Vite and styled with modern TailwindCSS.
- `docker-compose.yml`: Simplified deployment and local development setup.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local frontend dev)
- Python 3.10+ (for local backend dev)

### Setup & Running

1. **Clone the repository**
2. **Configure Environment**: Create a `.env` file in the root directory with your Supabase credentials and other settings.
3. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```
   The application will be available at `http://localhost:5173`.

### Local Development (Manual)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---
© 2026 CashLytics • Designed & Developed by Narendra Reddy M • Powered by FastAPI · React · Supabase
