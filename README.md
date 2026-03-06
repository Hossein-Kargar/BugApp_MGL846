# Bug Management Application (Jira-like)

## Recent Updates ✨

- ✅ **Django Admin Interface** fully configured with custom admin panels
- ✅ **Admin panels created** for Users, Tickets, and Comments
- ✅ **API port corrected** from 5000 to 8000 (Django default)
- ✅ **Superuser script** added for easy admin account creation
- ✅ **Connection issues resolved** between frontend and backend
- ✅ **Complete documentation** updated with troubleshooting guide

---

## Getting Started

1. **Clone the repository from GitHub:**
   ```sh
   git clone https://github.com/Hossein-Kargar/BugApp_MGL846.git
   cd BugApp_MGL846
   ```

---

## Project Overview

A full-stack bug management system inspired by Jira, built with Django (backend) and React (frontend).

### Key Components

**Backend (Django):**
- `backend/users/admin.py` - User profile management in Django Admin
- `backend/tickets/admin.py` - Ticket management with advanced filters
- `backend/comments/admin.py` - Comment and mention moderation
- `backend/create_superuser.py` - Automated superuser creation script
- `backend/bugapp/` - Main Django project configuration
- REST API with Token-based authentication

**Frontend (React):**
- Modern UI with Ant Design components
- Role-based dashboards
- Real-time notifications
- Responsive design

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
5. **Install Python dependencies:**
   ```sh
   pip install python-decouple Django==4.2.8 djangorestframework==3.14.0 django-cors-headers==4.3.1 django-filter==24.1 Pillow==10.1.0
   ```

6. **Create a superuser for admin access:**
   
   **Option 1 - Using automated script:**
   ```sh
   python create_superuser.py
   ```
   This creates a superuser with:
   - Username: `superadmin`
   - Password: `admin123`
   - Email: `superadmin@bugapp.com`
   
   **Option 2 - Manual creation:**
   ```sh
   python manage.py createsuperuser
   ```

7. **Run the backend server:**
   ```sh
   python manage.py runserver
   ```
   The backend API will be available at `http://localhost:8000/api/`
   
   **Django Admin interface:** `http://localhost:8000/admin/`

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
   The frontend will be available at `http://localhost:3000/`

---

## Environment Variables

- **Frontend:**
  - The file `frontend/.env` is configured with: `REACT_APP_API_URL=http://localhost:8000/api`
  - ⚠️ **Important:** The API URL must point to port **8000** (Django default port)
  - If you need to change it, edit `frontend/.env`
  
- **Backend:**
  - Edit `backend/.env` for Django settings (optional)
  - Uses `python-decouple` for environment configuration

---

## Features

### Frontend (React)
- User authentication (register/login)
- Role-based access (Admin, Chef, Developer)
- Ticket creation, assignment, and status management
- Comments on tickets with user mentions
- In-app notifications for assignment and mentions
- Responsive, modern UI with Ant Design

### Backend (Django)
- RESTful API with Django REST Framework
- User authentication with Token-based auth
- Role-based permissions (Admin, Chef, Developer)
- **Django Admin Interface** for complete system management
  - User profile management
  - Ticket management with filters
  - Comment moderation
  - User mention tracking

### Django Admin Features
- **User Profiles:** Manage users, roles, departments, and contact info
- **Tickets:** View/edit all tickets with filters by status, priority, severity
- **Comments:** Moderate comments with search and filtering
- **Comment Mentions:** Track all user mentions in comments

---

## Useful Commands

### Backend (Django)
- **Run development server:**
  ```sh
  python manage.py runserver
  ```
- **Create superuser:**
  ```sh
  python create_superuser.py  # Automated
  # OR
  python manage.py createsuperuser  # Interactive
  ```
- **Change admin password:**
  ```sh
  python manage.py changepassword admin
  ```
- **Apply database migrations:**
  ```sh
  python manage.py migrate
  ```
- **Create new migrations:**
  ```sh
  python manage.py makemigrations
  ```
- **Run tests:**
  ```sh
  python manage.py test
  ```
- **Django shell:**
  ```sh
  python manage.py shell
  ```

### Frontend (React)
- **Start development server:**
  ```sh
  npm start
  ```
- **Run tests:**
  ```sh
  npm test
  ```
- **Build for production:**
  ```sh
  npm run build
  ```

---

## Accessing the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main user interface |
| **Backend API** | http://localhost:8000/api/ | REST API endpoints |
| **Django Admin** | http://localhost:8000/admin/ | Admin interface |

### Admin Credentials
- **Username:** `superadmin`
- **Password:** `admin123`
- **Email:** `superadmin@bugapp.com`

---

## Troubleshooting

### Connection Refused Errors
- ✅ **Fixed:** Frontend now correctly connects to backend on port **8000**
- If you see `ERR_CONNECTION_REFUSED`, ensure:
  - Backend is running: `python manage.py runserver`
  - Frontend `.env` file has: `REACT_APP_API_URL=http://localhost:8000/api`
  - After changing `.env`, restart the frontend server

### Admin Login Issues
- If you can't login to Django Admin, run:
  ```sh
  python create_superuser.py
  ```
  Or change password:
  ```sh
  python manage.py changepassword admin
  ```

### Missing Dependencies
- If you see `ModuleNotFoundError: No module named 'decouple'`:
  ```sh
  pip install python-decouple
  ```

### CORS Issues
- Check allowed origins in `backend/bugapp/settings.py`
- Ensure `django-cors-headers` is installed

### Port Conflicts
- If ports are in use, change them in the start commands or `.env` files

---

## Technology Stack

### Backend
- **Framework:** Django 4.2.8
- **API:** Django REST Framework 3.14.0
- **Authentication:** Token-based auth
- **Database:** SQLite (development) / PostgreSQL (production ready)
- **CORS:** django-cors-headers
- **Image handling:** Pillow

### Frontend
- **Framework:** React 18.2.0
- **UI Library:** Ant Design 5.11.0
- **Routing:** React Router 6.20.0
- **HTTP Client:** Axios 1.6.0
- **Icons:** @ant-design/icons

---

## License

MIT (or specify your license)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Repository

GitHub: [Hossein-Kargar/BugApp_MGL846](https://github.com/Hossein-Kargar/BugApp_MGL846)
