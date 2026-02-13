# API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication Endpoints

### Register User

```
POST /auth/register/
```

### Login

```
POST /auth/login/
```

### Logout

```
POST /auth/logout/
```

## User Endpoints

### List Users

```
GET /users/
```

### Get User Detail

```
GET /users/{id}/
```

### Update User

```
PUT /users/{id}/
```

### Delete User

```
DELETE /users/{id}/
```

## Ticket Endpoints

### List Tickets

```
GET /tickets/
```

Query Parameters:

- `status`: Filter by status (open, in_progress, fixed, closed, reopened)
- `priority`: Filter by priority (low, medium, high, critical)
- `severity`: Filter by severity
- `assigned_to`: Filter by assigned user

### Create Ticket

```
POST /tickets/
```

Body:

```json
{
  "title": "string",
  "description": "string",
  "severity": "low|medium|high|critical",
  "priority": "low|medium|high|critical",
  "due_date": "YYYY-MM-DD"
}
```

### Get Ticket Detail

```
GET /tickets/{id}/
```

### Update Ticket

```
PUT /tickets/{id}/
```

### Delete Ticket

```
DELETE /tickets/{id}/
```

### Change Ticket Status

```
PATCH /tickets/{id}/status/
```

Body:

```json
{
  "status": "open|in_progress|fixed|closed|reopened"
}
```

## Comment Endpoints

### Add Comment

```
POST /tickets/{ticket_id}/comments/
```

Body:

```json
{
  "text": "string",
  "mentions": [user_id1, user_id2]
}
```

### List Comments

```
GET /tickets/{ticket_id}/comments/
```

### Delete Comment

```
DELETE /tickets/{ticket_id}/comments/{comment_id}/
```

## Response Format

All responses follow this format:

Success:

```json
{
  "status": "success",
  "data": {...}
}
```

Error:

```json
{
  "status": "error",
  "message": "error description",
  "errors": {...}
}
```
