# JobLog — Job Application Tracker

A full-stack web app to track job applications with real-time 
status updates, Redis-powered reminders, and analytics dashboard.

## Live Demo
- Frontend: https://job-log-psi.vercel.app
- Backend: https://joblog-backend.onrender.com

## Tech Stack
- **Frontend:** React.js, TailwindCSS, Recharts
- **Backend:** Node.js, Express.js, REST APIs
- **Database:** MongoDB, Mongoose
- **Cache:** Redis (session caching, TTL reminders)
- **DevOps:** Docker, docker-compose, GitHub Actions CI/CD
- **Deployment:** Vercel (frontend), Render (backend + Redis)

## Features
- JWT authentication with Redis session caching
- Add, update, delete job applications
- Real-time status tracking (Applied/Interview/Offer/Rejected)
- TTL-based follow-up reminders using Redis
- Analytics dashboard with donut chart
- Automated daily reminder check with node-cron
- CI/CD pipeline with GitHub Actions

## Run Locally
```bash
# Clone the repo
git clone https://github.com/mayank10k/JobLog.git

# Run with Docker
docker-compose up --build

# Or run manually
cd backend && npm install && nodemon server.js
cd frontend && npm install && npm run dev
```

## Environment Variables
Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
```
