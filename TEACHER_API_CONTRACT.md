# Teacher API Contract (Sprint 2)

Owner: Priyanshi (Backend contract ownership)

Base URL: `http://localhost:4000/api`
Auth: Bearer token required for all routes

## Module 1: Data Model

Teacher object:

```json
{
  "teacherId": 2001,
  "firstName": "Priya",
  "lastName": "Sharma",
  "department": "Science",
  "subject": "Physics",
  "status": "Active",
  "createdAt": "2026-04-05T00:00:00.000Z",
  "updatedAt": "2026-04-05T00:00:00.000Z"
}
```

## Module 2: Validation Rules

- `teacherId`: integer, required, unique, min 1
- `firstName`: string, required, 2-50 chars
- `lastName`: string, required, 2-50 chars
- `department`: string, optional, max 50 chars
- `subject`: string, optional, max 50 chars
- `status`: enum `Active | Inactive`

## Module 3: Endpoints

### 1) List Teachers
- Method: `GET`
- Path: `/teachers`
- Permission: `students:read` (or `teachers:read` when introduced)
- Status: Implemented by teammate branch merge

Success response:

```json
{
  "success": true,
  "data": {
    "teachers": [
      {
        "teacherId": 2001,
        "firstName": "Priya",
        "lastName": "Sharma",
        "department": "Science",
        "subject": "Physics",
        "status": "Active"
      }
    ]
  }
}
```

### 2) Create Teacher
- Method: `POST`
- Path: `/teachers`
- Permission: `admin:manage` (or `teachers:write` when introduced)
- Status: Implemented by teammate branch merge

Request body:

```json
{
  "firstName": "Priya",
  "lastName": "Sharma",
  "department": "Science",
  "subject": "Physics",
  "status": "Active"
}
```

### 3) Update Teacher
- Method: `PUT`
- Path: `/teachers/:teacherId`
- Permission: `admin:manage` (or `teachers:write` when introduced)
- Status: Implemented by teammate branch merge

Request body (partial allowed):

```json
{
  "department": "Mathematics",
  "subject": "Algebra",
  "status": "Inactive"
}
```

## Module 4: Error Contract

Error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "firstName and lastName are required."
  }
}
```

## Module 5: Frontend Notes

- Use `teacherId` as stable row key.
- Keep `status` as strict enum: `Active` or `Inactive`.
- Add/Edit form should validate `firstName` and `lastName` before submit.
- Keep `department` and `subject` optional but trimmed.
