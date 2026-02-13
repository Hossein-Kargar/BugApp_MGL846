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

   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000`

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

## API Documentation

See [docs/API.md](docs/API.md) for detailed API endpoints documentation.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system architecture and database schema.
