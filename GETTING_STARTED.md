# Getting Started

## Backend Setup (Django)

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration.

5. **Create database migrations:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser:**

   **Option 1 - Automated (Recommended):**
   ```bash
   python create_superuser.py
   ```
   This creates a superuser with:
   - Username: `superadmin`
   - Password: `admin123`
   - Email: `superadmin@bugapp.com`

   **Option 2 - Interactive:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000/api/`
   
   **Django Admin:** `http://localhost:8000/admin/`

## Frontend Setup (React)

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your API URL.

4. **Start the development server:**

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## Using the Application

### First Time Setup

1. Register a new account at `http://localhost:3000/register`
2. Choose your role (Developer, Chef, or Admin)
3. Log in with your credentials

### Creating a Bug Ticket

1. Navigate to "Tickets" from the navigation menu
2. Click "New Ticket" button
3. Fill in the ticket details:
   - Title
   - Description
   - Priority
   - Severity
   - Due date (optional)
   - Assign to user (optional)
4. Click "Create" to submit

### Managing Status

1. Open a ticket
2. Use the status dropdown to change ticket status
3. Available statuses: Open → In Progress → Fixed → Closed/Reopened

### Using Django Admin Interface

The Django Admin interface provides powerful management capabilities:

1. **Access Django Admin:**
   - URL: `http://localhost:8000/admin/`
   - Login with superadmin credentials

2. **Available Admin Panels:**
   - **Authentication and Authorization** - Manage Django users and groups
   - **User Profiles** - Manage user roles (Admin, Chef, Developer), departments, contact info
   - **Tickets** - View, edit, and filter all tickets by status, priority, severity
   - **Comments** - Moderate comments on tickets
   - **Comment Mentions** - Track user mentions in comments

3. **Features:**
   - Advanced filtering and search
   - Bulk actions
   - Direct database editing (use with caution)
   - View related objects
   - Customized list displays with relevant information

4. **Best Practices:**
   - Use the frontend interface for regular operations
   - Use Django Admin for:
     - User management and role assignment
     - System-level troubleshooting
     - Bulk operations
     - Data analysis and reporting

## Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main user interface |
| **Backend API** | http://localhost:8000/api/ | REST API endpoints |
| **Django Admin** | http://localhost:8000/admin/ | Admin interface |

---

## Troubleshooting

### Connection Issues
- Ensure backend is running on port 8000
- Check frontend `.env` file: `REACT_APP_API_URL=http://localhost:8000/api`
- Restart frontend after changing `.env`

### Admin Login Problems
- Run `python create_superuser.py` to ensure superuser exists
- Or reset password: `python manage.py changepassword admin`

### Missing Dependencies
- If you see module errors, install dependencies:
  ```bash
  pip install python-decouple Django==4.2.8 djangorestframework==3.14.0
  ```

---

## API Documentation

See [docs/API.md](docs/API.md) for detailed API endpoints documentation.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system architecture and database schema.
