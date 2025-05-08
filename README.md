# School Vaccination Portal

A comprehensive web application for managing student vaccinations in schools, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## System Overview

The School Vaccination Portal is designed to streamline the vaccination management process for schools. It provides features for:
- Student registration and profile management
- Vaccination record tracking
- School administration dashboard
- Parent/Guardian access to vaccination records
- Healthcare provider interface for updating vaccination status

## Application Architecture

### Tech Stack
- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

### Directory Structure
```
school-vaccination-portal/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   └── src/                 # Source code
│       ├── components/      # Reusable components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
├── backend/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── middleware/        # Custom middleware
└── docs/                   # Documentation
```

## Frontend-Backend Interaction

The application follows a client-server architecture:
1. Frontend makes HTTP requests to backend API endpoints
2. Backend processes requests, interacts with MongoDB
3. JWT authentication secures API endpoints
4. Real-time updates using WebSocket for notifications

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Student Endpoints
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student information

### Vaccination Endpoints
- `GET /api/vaccinations` - Get all vaccination records
- `POST /api/vaccinations` - Add new vaccination record
- `PUT /api/vaccinations/:id` - Update vaccination status

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String (enum: ['admin', 'parent', 'healthcare']),
  name: String,
  createdAt: Date
}
```

### Student Model
```javascript
{
  _id: ObjectId,
  name: String,
  dateOfBirth: Date,
  grade: String,
  parentId: ObjectId,
  vaccinationRecords: [{
    vaccineName: String,
    date: Date,
    status: String,
    administeredBy: ObjectId
  }]
}
```

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file:
   ```
   MONGODB_URI=mongodb://localhost:27017/vaccination-portal
   JWT_SECRET=your-secret-key
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## API Testing with Postman

1. Import the Postman collection from `docs/postman_collection.json`
2. Set up environment variables:
   - `base_url`: http://localhost:5000
   - `token`: JWT token from login response

## UI/UX Wireframes

The application follows Material Design principles with a responsive layout:
- Dashboard view for administrators
- Student profile pages
- Vaccination record forms
- Parent portal interface

## Assumptions

1. School administrators have the authority to manage student records
2. Healthcare providers can only update vaccination records
3. Parents can view but not modify vaccination records
4. All dates are stored in UTC format
5. Email addresses are unique for user accounts

## Security Considerations

1. Passwords are hashed using bcrypt
2. JWT tokens expire after 24 hours
3. API endpoints are protected with role-based access control
4. Input validation on all forms
5. CORS enabled for frontend domain only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.