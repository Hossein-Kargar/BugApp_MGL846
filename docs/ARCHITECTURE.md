# Architecture Documentation

## System Architecture

### Backend (Django)

- **Framework**: Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Token-based authentication
- **API Style**: RESTful

### Frontend (React)

- **Framework**: React 18
- **UI Library**: Ant Design
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API / Redux (to be decided)

## Project Structure

### Backend Structure

```
backend/
├── bugapp/                 # Main Django project
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── users/                  # User management app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── tests/
│   └── migrations/
├── tickets/                # Ticket management app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── tests/
│   └── migrations/
├── comments/               # Comments app
│   ├── models.py
│   ├── views.py
│   └── ...
├── manage.py
└── requirements.txt
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header/
│   │   ├── Navigation/
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   ├── Dashboard/
│   │   ├── TicketList/
│   │   ├── TicketDetail/
│   │   └── ...
│   ├── services/           # API calls
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── ticketService.js
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── context/            # Context API
│   ├── styles/             # Global styles
│   ├── App.js
│   └── index.js
├── public/
└── package.json
```

## Database Schema (Draft)

### Users Table

- id (PK)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- role (admin, chef, developer)
- created_at
- updated_at

### Tickets Table

- id (PK)
- title
- description
- status (open, in_progress, fixed, closed, reopened)
- priority (low, medium, high, critical)
- severity (low, medium, high, critical)
- creator_id (FK to Users)
- assigned_to_id (FK to Users, nullable)
- due_date
- created_at
- updated_at

### Comments Table

- id (PK)
- ticket_id (FK to Tickets)
- user_id (FK to Users)
- text
- created_at
- updated_at

### Mentions Table (for tagging users in tickets/comments)

- id (PK)
- ticket_id (FK to Tickets, nullable)
- comment_id (FK to Comments, nullable)
- mentioned_user_id (FK to Users)
- created_at

## Authentication Flow

1. User registers or logs in
2. Backend returns authentication token
3. Frontend stores token in localStorage
4. Frontend includes token in Authorization header for subsequent requests
5. Backend validates token and processes request
6. On logout, token is invalidated

## Data Flow

### Creating a Ticket

1. User fills ticket form (frontend)
2. Form data sent to backend (POST /api/tickets/)
3. Backend validates data
4. Backend creates ticket in database
5. Backend returns created ticket with ID
6. Frontend updates ticket list
7. User redirected to ticket detail page

### Adding Comment

1. User submits comment (frontend)
2. Comment sent to backend (POST /api/tickets/{id}/comments/)
3. Backend validates mentions
4. Backend creates comment in database
5. Backend sends notifications to mentioned users
6. Frontend updates comment list

## Security Considerations

- CSRF protection enabled
- SQL injection prevention (Django ORM)
- XSS prevention (React escaping)
- Authentication token expiration
- Role-based access control
- Rate limiting (to be implemented)
- Input validation on both frontend and backend
