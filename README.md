# Bug Management Application (Jira-like)

## Getting Started

1. **Clone the repository from GitHub:**
   ```sh
   git clone https://github.com/Hossein-Kargar/BugApp_MGL846.git
   cd BugApp_MGL846
   ```

---

## Project Overview

A full-stack bug management system inspired by Jira, built with Django (backend) and React (frontend).

---

## Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn
- (Recommended) Virtualenv for Python

---

## Backend Setup (Django)

1. **Navigate to backend folder:**
   ```sh
   cd backend
   ```
2. **Create and activate a virtual environment:**
   ```sh
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```
5. **Create a superuser (optional, for admin access):**
   ```sh
   python manage.py createsuperuser
   ```
6. **Run the backend server:**
   ```sh
   python manage.py runserver 5000
   ```
   The backend API will be available at `http://localhost:5000/api/`

---

## Frontend Setup (React)

1. **Navigate to frontend folder:**
   ```sh
   cd frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Start the frontend server:**
   ```sh
   npm start
   # or
   yarn start
   ```
   The frontend will be available at `http://localhost:3001/`

---

## Environment Variables

- **Frontend:**
  - Edit `frontend/.env` if needed. Default API URL: `REACT_APP_API_URL=http://localhost:5000/api`
- **Backend:**
  - Edit `backend/.env` for Django settings (optional).

---

## Features

- User authentication (register/login)
- Ticket creation, assignment, and status management
- Comments on tickets
- In-app notifications for assignment and mentions
- Responsive, modern UI

---

## Useful Commands

- **Backend tests:**
  ```sh
  python manage.py test
  ```
- **Frontend tests:**
  ```sh
  npm test
  ```

---

## Troubleshooting

- If you have CORS issues, check allowed origins in `backend/bugapp/settings.py`.
- If ports are in use, change them in the start commands or `.env` files.

---

## License

MIT (or specify your license)
