# School Vaccination Portal

A full-stack web application for managing school vaccination drives and student records.

## Features

- Authentication & Access Control
- Dashboard Overview
- Student Management (Individual and Bulk Import)
- Vaccination Drive Management
- Reports with Filtering and Export
- Responsive UI with Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd school-vaccination-portal
```

2. Backend Setup:
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with:
```
MONGODB_URI=mongodb://localhost:27017/vaccination-portal
JWT_SECRET=your-secret-key
PORT=5000
```

3. Frontend Setup:
```bash
cd frontend
npm install
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the Backend:
```bash
cd backend
npm start
```

3. Start the Frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Default Login Credentials

- Username: admin
- Password: admin123

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login

### Students
- GET `/api/students` - Get all students
- POST `/api/students` - Add new student
- PUT `/api/students/:id` - Update student
- POST `/api/students/bulk-import` - Import students via CSV

### Vaccination Drives
- GET `/api/drives` - Get all drives
- POST `/api/drives` - Create new drive
- PUT `/api/drives/:id` - Update drive
- GET `/api/drives/dashboard` - Get dashboard metrics

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Multer for File Uploads

### Frontend
- React.js
- Material-UI
- React Router
- Axios
- XLSX for Excel Export

## Security Features

- JWT-based Authentication
- Protected Routes
- Input Validation
- Error Handling
- Secure Password Handling

## Data Validation

- Student ID Uniqueness
- Date Validation for Vaccination Drives
- Class Validation
- Required Field Validation