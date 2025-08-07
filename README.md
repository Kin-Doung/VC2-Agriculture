# Full Stack App: React + Laravel

## Structure
- `/frontend` - React JS (Vite)
- `/backend` - Laravel API

## Setup

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
php artisan storage:link
```
### Frontend (React)
```bash
Copy
Edit
cd frontend
npm install
npm run dev