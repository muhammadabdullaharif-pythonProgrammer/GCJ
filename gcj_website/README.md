# GCJ Official Website (Government College Jhang)

Welcome to the official monorepo of the **GCJ Official Website**. This is a production-grade, AI-integrated, modern web portal designed for students, faculty, and administrative staff at Government College Jhang.

---

## 🏗️ Project Architecture

This project is organized as a monorepo containing the following components:

- **`/backend`**: Django 5.x + Django REST Framework + JWT Authentication (SimpleJWT). Exposes API endpoints for student portal, news/announcements, and academic admissions.
- **`/frontend`**: React.js (Vite) + Tailwind CSS + Framer Motion. Provides a highly interactive user experience with micro-animations, a modern dashboard, and academic portal.
- **`/ai_engine`**: Standard Google Gemini API Integration layer, functioning as an automated student advisor for admissions, course queries, and college information.
- **`/database`**: SQL schema and migration configurations for MySQL database.
- **`/deployment`**: Docker Compose, Nginx configurations, and multi-stage Dockerfiles.
- **`/docs`**: Comprehensive documentation files detailing API specs and architecture.

---

## 🛠️ Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ (npm or yarn)
- MySQL Server 8.0+
- Google Gemini API Key

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables:
   ```bash
   cp ../.env.example .env
   # Fill in your .env details, particularly DB settings and GEMINI_API_KEY
   ```
5. Apply database migrations:
   ```bash
   cd gcj_backend
   python manage.py migrate
   ```
6. Run the local server:
   ```bash
   python manage.py runserver
   ```
   The backend is now live at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp ../.env.example .env
   # Adjust VITE_API_URL if necessary (defaults to http://localhost:8000)
   ```
4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend is now live at `http://localhost:5173/`.

---

### 3. Database Initialization

We support standard migrations through Django, as well as standalone schemas inside `/database`.
To initialize the MySQL database directly:
```bash
mysql -u root -p -e "CREATE DATABASE gcj_db;"
mysql -u root -p gcj_db < database/schema.sql
mysql -u root -p gcj_db < database/seed_data.sql
```

---

### 4. Running with Docker Compose

For a complete production-grade dockerized environment, run:
```bash
docker-compose -f deployment/docker-compose.yml up --build
```
This spawns:
- **MySQL database** container.
- **Django web server** container running behind Gunicorn.
- **React frontend** container built and served by Nginx.
- **Nginx routing reverse proxy** listening on Port `80` (routing `/api/` to Django and everything else to React).

---

## 📄 Documentation

Detailed specifications can be found under the `/docs` directory:
- [API Specification](docs/api_spec.md)
- [Architecture & Design System](docs/architecture.md)

---

## 🔒 License

Proprietary to Government College Jhang (GCJ). All rights reserved.
