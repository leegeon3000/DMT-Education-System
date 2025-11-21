# DMT Education System - Backend API

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Environment Setup
Create `.env` file in Backend directory:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Start Development Server
```bash
npm run dev
```

Server will be available at `http://localhost:3001`

## 📋 Available API Endpoints

### 🔐 Authentication
- `POST /auth/login` - User login with email/password
- `GET /auth/me` - Get current authenticated user info

### 👥 User Management (Admin only)
- `GET /users` - List all users with pagination & search
- `GET /users/:id` - Get specific user details
- `POST /users` - Create new user account
- `PUT /users/:id` - Update user information
- `DELETE /users/:id` - Delete user account

### 🎭 Role Management (Admin only)
- `GET /roles` - List all available roles
- `GET /roles/:id` - Get role details
- `POST /roles` - Create new role
- `PUT /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role

### 🎓 Student Management
- `GET /students` - List students (filterable by school level, status)
- `GET /students/:id` - Get student details with user info
- `POST /students` - Create new student account
- `PUT /students/:id` - Update student information
- `DELETE /students/:id` - Delete student account
- `GET /students/:id/enrollments` - Get student's course enrollments

### 👨‍🏫 Teacher Management
- `GET /teachers` - List teachers (filterable by subject, status)
- `GET /teachers/:id` - Get teacher details with subject info
- `POST /teachers` - Create new teacher account
- `PUT /teachers/:id` - Update teacher information
- `DELETE /teachers/:id` - Delete teacher account
- `GET /teachers/:id/classes` - Get teacher's assigned classes
- `GET /teachers/:id/performance` - Get teacher performance metrics

### 📚 Subject Management
- `GET /subjects` - List all subjects
- `GET /subjects/:id` - Get subject details
- `POST /subjects` - Create new subject
- `PUT /subjects/:id` - Update subject
- `DELETE /subjects/:id` - Delete subject

### 📖 Course Management
- `GET /courses` - List courses (filterable by subject, level)
- `GET /courses/:id` - Get course details with subject info
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `GET /courses/:id/classes` - Get classes for specific course

## 🔒 Authentication & Authorization

### JWT Token Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access Control
- **Admin (role_id: 1)**: Full system access
- **Teacher (role_id: 2)**: Access to teaching-related data
- **Student (role_id: 3)**: Access to own academic data
- **Staff (role_id: 4)**: Administrative operations

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Test Authentication
```bash
# Login request
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dmt.edu.vn","password":"your-password"}'

# Use returned token for protected endpoints
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Project Architecture

```
Backend/
├── src/
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication middleware
│   │   └── validation.ts    # Request validation with Zod
│   ├── routes/
│   │   ├── auth.ts          # Authentication endpoints
│   │   ├── users.ts         # User CRUD operations
│   │   ├── roles.ts         # Role management
│   │   ├── students.ts      # Student management
│   │   ├── teachers.ts      # Teacher management
│   │   ├── subjects.ts      # Subject management
│   │   └── courses.ts       # Course management
│   ├── plugins/
│   │   ├── auth.ts          # Fastify auth plugin
│   │   └── routes.ts        # Route registration
│   ├── utils/
│   │   ├── response.ts      # Standardized API responses
│   │   └── errorHandler.ts  # Global error handling
│   └── server.ts            # Main application entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── .env                    # Environment variables
```

## 🔧 Development Features

- **TypeScript**: Full type safety
- **Zod Validation**: Runtime request validation
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging with Fastify
- **CORS**: Configurable cross-origin resource sharing
- **JWT**: Secure authentication with role-based access

## 🚀 Next Steps

1. **Configure Supabase**: Set up your database credentials
2. **Test Endpoints**: Use the provided curl commands
3. **Frontend Integration**: Connect with React frontend
4. **Deploy**: Follow production deployment guidelines

## 📝 Notes

- Default port: 3001
- Development mode includes detailed error messages
- Production mode should use secure JWT secrets
- All endpoints follow RESTful conventions
- Database relationships are properly enforced