
## 🚀 Features

- Curated destinations & itineraries
- Day-by-day plans with attractions, restaurants, and experiences
- Budget breakdowns
- Trending destinations (tracked via interactions)
- Django Admin panel for management
- React frontend for users

---

## 🛠️ Tech Stack

- **Backend**: Django, Django REST Framework, Gunicorn
- **Frontend**: React, Vite
- **Web Server**: Nginx (serves React + proxies API requests to Django)
- **Database**: SQLite (local dev, can swap with Postgres)
- **Containerization**: Docker & docker-compose

---

## 📂 Project Structure
```
traveller/
├── backend/ # Django + DRF backend
│ ├── travel/ # App with models, views, serializers
│ ├── travelplanner # Django project config
│ ├── requirements.txt
│ ├── manage.py
│ └── ...
├── frontend/ # React + Vite frontend
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
├── nginx/ # Nginx config (if separate)
├── docker-compose.yml
└── README.md
```
---

## 🔧 Development Setup

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/traveller-planner.git
cd traveller-planne

**2. Run with Docker**
docker-compose up -d --build

Frontend → http://localhost/
Backend API → http://localhost/api/
Django Admin → http://localhost/admin/

```
**👨‍💻 For Backend Developers**
Run Django commands inside container

# Run migrations

docker-compose exec backend python manage.py migrate

# Create superuser

docker-compose exec backend python manage.py createsuperuser

# Collect static files

docker-compose exec backend python manage.py collectstatic --noinput

**Where static & media live**

/static/ → collected Django + admin static files

/media/ → uploaded images

Both are mounted as Docker volumes and served via Nginx.

# **🎨 For Frontend Developers**
Run in dev mode (outside Docker)

cd frontend

npm install

npm run dev

**-----------------------------------------**


Runs React dev server at http://localhost:5173/

API requests should be proxied to backend (http://localhost:8000/api/)

Build for production

Handled automatically in Docker:

docker-compose build nginx

# 🧑‍🤝‍🧑 Collaboration Workflow

# **Branching strategy:

main → stable production-ready code

develop → integration branch for testing

feature/... → individual features

Example
# Create feature branch
**git checkout -b feature/add-ratings**

# Work & commit
**git add .
git commit -m "Add ratings API"**

# Push branch
**git push origin feature/add-ratings**
