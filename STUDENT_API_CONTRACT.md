# Student API Contract (Sprint 2)

Owner: Priyanshi (Backend contract + schema)

Base URL: `http://localhost:4000/api`
Auth: Bearer token required for all routes

## Data Model

Student object:

```json
{
  "studentId": 1001,
  "firstName": "Ava",
  "middleName": "Marie",
  "lastName": "Johnson",
  "altId": "S-1001",
  "commonName": "Avi",
  "email": "ava@example.com",
  "phone": "9876543210",
  "gender": "female",
  "dob": "2010-01-15T00:00:00.000Z",
  "ethnicity": "Asian",
  "language": "English",
  "estimatedGradDate": "2028-05-30T00:00:00.000Z",
  "className": "10-A",
  "status": "Active",
  "createdAt": "2026-04-04T00:00:00.000Z",
  "updatedAt": "2026-04-04T00:00:00.000Z"
}
```

Validation rules:
- `studentId`: integer, required, unique, min 1
- `firstName`: string, required, 2-50 chars
- `middleName`: string, optional, max 50 chars
- `lastName`: string, required, 2-50 chars
- `altId`: string, optional, unique, max 30 chars
- `commonName`: string, optional, max 50 chars
- `email`: string, optional, valid email
- `phone`: string, optional, 10 digits
- `gender`: enum `male | female | other | unspecified`
- `dob`: date, optional
- `ethnicity`: string, optional, max 50 chars
- `language`: string, optional, max 50 chars
- `estimatedGradDate`: date, optional
- `className`: string, required, 2-20 chars
- `status`: enum `Active | Inactive`

## Field Groups

### Core Identity
- `studentId`
- `firstName`
- `middleName`
- `lastName`
- `altId`
- `commonName`

### Contact & Demographic
- `email`
- `phone`
- `gender`
- `dob`
- `ethnicity`
- `language`
- `estimatedGradDate`

### Current Placement
- `className`
- `status`

## Endpoints

### 1) List Students
- Method: `GET`
- Path: `/students`
- Permission: `students:read`
- Status: Implemented

Success response:

```json
{
  "success": true,
  "data": {
    "students": [
      {
        "studentId": 1001,
        "firstName": "Ava",
        "lastName": "Johnson"
      }
    ]
  }
}
```

### 2) Create Student
- Method: `POST`
- Path: `/students`
- Permission: `students:write`
- Status: Planned in Sprint 2

Request body:

```json
{
  "firstName": "Ava",
  "lastName": "Johnson",
  "className": "10-A",
  "status": "Active"
}
```

### 3) Update Student
- Method: `PUT`
- Path: `/students/:studentId`
- Permission: `students:write`
- Status: Planned in Sprint 2

Request body (partial allowed):

```json
{
  "className": "10-B",
  "status": "Inactive"
}
```

## Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "firstName and lastName are required."
  }
}
```

## Notes for Frontend Team

- Use `studentId` as stable key for rows.
- Keep `status` as `Active` or `Inactive` only.
- Form should enforce required fields: `firstName`, `lastName`, `className`.
