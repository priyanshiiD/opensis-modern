# Classes Feature (Sprint 3)

**Owner:** Manju (Frontend)

## Overview

The Classes feature provides a complete UI for managing classes, mapping teachers to classes, and tracking class details. This is built as part of Sprint 3 for the OpenSIS system.

## Features

### 1. Class Management UI
- **List View**: Display all classes in a table
- **Add Class**: Create new classes with required fields
- **Edit Class**: Modify existing class details
- **Delete Class**: Soft-delete (deactivate) classes

### 2. Data Model

Class object structure:
```json
{
  "classId": 1001,
  "name": "10-A Science",
  "gradeLevel": 10,
  "section": "A",
  "teacherId": 2001,
  "academicYear": "2025-26",
  "capacity": 50,
  "status": "Active",
  "createdAt": "2026-04-20T00:00:00.000Z",
  "updatedAt": "2026-04-20T00:00:00.000Z"
}
```

### 3. Validation Rules

- `classId`: Required for creation, unique, positive integer
- `name`: Required, 2-50 characters
- `gradeLevel`: Required, integer (1-12)
- `section`: Required, 1-5 characters (e.g., "A", "B")
- `teacherId`: Required, must be valid teacher ID
- `academicYear`: Required, format `YYYY-YY` (e.g., "2025-26")
- `capacity`: Optional, positive integer (e.g., 50 students)
- `status`: Enum - `Active` or `Inactive`

## File Structure

```
src/features/classes/
├── api/
│   └── classesApi.js          # API integration functions
├── components/
│   ├── ClassTable.jsx         # Class list table with edit/delete actions
│   └── ClassForm.jsx          # Add/Edit class form
└── pages/
    └── ClassesPage.jsx        # Main page managing views
```

## Components

### ClassesPage
Main page component that manages the view state (list/add/edit) and handles teacher data fetching.

**Props:** None (uses context)

**States:**
- `view`: "list" | "add" | "edit"
- `selectedClass`: Currently selected class for editing
- `refreshKey`: Trigger table refresh after operations
- `teachers`: Available teachers for dropdown

### ClassTable
Displays classes in a table format with edit/delete controls.

**Props:**
- `onEdit(cls)`: Callback when user clicks Edit
- `refreshKey`: Triggers re-fetch when changes
- `teachers`: Array of teachers for display

**Features:**
- Status badges (Active/Inactive)
- Teacher name resolution
- Action buttons (Edit, Delete)

### ClassForm
Form for creating and editing classes.

**Props:**
- `cls`: Class object (null for add mode)
- `onSuccess()`: Callback after successful save
- `onCancel()`: Callback when user cancels
- `teachers`: Array of teachers for dropdown

**Validation:**
- All required fields must be filled
- ClassId is immutable in edit mode
- Grade level defaults to valid options (1-12)

## API Integration

### Available Functions

#### `fetchClasses(token, options)`
Fetch all classes with optional filters.

```javascript
const data = await fetchClasses(token, {
  page: 1,
  limit: 25,
  status: 'Active',
  gradeLevel: 10,
  teacherId: 2001,
  academicYear: '2025-26'
});
```

#### `fetchClassById(token, classId)`
Fetch a single class.

```javascript
const cls = await fetchClassById(token, 1001);
```

#### `createClass(token, classData)`
Create a new class.

```javascript
const newClass = await createClass(token, {
  classId: 1001,
  name: "10-A Science",
  gradeLevel: 10,
  section: "A",
  teacherId: 2001,
  academicYear: "2025-26",
  capacity: 50,
  status: "Active"
});
```

#### `updateClass(token, classId, classData)`
Update an existing class.

```javascript
const updatedClass = await updateClass(token, 1001, {
  name: "10-B Science",
  teacherId: 2002,
  status: "Inactive"
});
```

#### `deleteClass(token, classId)`
Deactivate a class.

```javascript
await deleteClass(token, 1001);
```

## Navigation

The Classes feature is accessible via:
- **Sidebar Menu:** Click "Classes" (📚 icon)
- **Route:** `/classes`
- **Permission:** Requires authentication

## Dependencies

- React Hooks: `useState`, `useEffect`
- React Router: `useAuth()` from AuthContext
- Tailwind CSS for styling

## Usage Example

```jsx
import ClassesPage from '../features/classes/pages/ClassesPage';

// In App.jsx routes
<Route
  path="/classes"
  element={
    <ProtectedRoute>
      <ClassesPage />
    </ProtectedRoute>
  }
/>
```

## Error Handling

- Network errors are caught and displayed
- Validation errors shown on form submission
- Delete confirmations prevent accidental removal
- API errors display user-friendly messages

## Future Enhancements

- [ ] Bulk class operations
- [ ] Schedule/timetable view
- [ ] Student enrollment tracking
- [ ] Class capacity warnings
- [ ] Export classes to CSV
- [ ] Advanced filtering and search
- [ ] Attendance summary per class
