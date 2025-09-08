# UNT Rate My Professor - Backend Setup

## Installation Instructions

### 1. Install Python Dependencies

Navigate to the backend directory and install required packages:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

Run the FastAPI server:

```bash
python main.py
```

The backend will start on: `http://127.0.0.1:8000`

### 3. Start the Frontend Server

In a new terminal, navigate to the main project directory and start the frontend:

```bash
cd ..
python3 -m http.server 8001
```

The frontend will be available at: `http://127.0.0.1:8001`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Health Check
- `GET /health` - Check API health status

## Features

✅ **UNT Email Validation** - Only @my.unt.edu emails accepted  
✅ **Password Security** - BCrypt hashing with strength requirements  
✅ **JWT Authentication** - Secure token-based auth  
✅ **SQLite Database** - User data persistence  
✅ **CORS Support** - Frontend-backend communication  
✅ **Real-time Validation** - Instant feedback on forms  
✅ **Toast Notifications** - User-friendly success/error messages  
✅ **Auto-redirect** - Seamless navigation after auth  

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique UNT email (@my.unt.edu)
- `first_name` - Student's first name
- `last_name` - Student's last name
- `student_id` - UNT student ID
- `graduation_year` - Expected graduation year
- `major` - Student's major
- `hashed_password` - Securely hashed password
- `is_active` - Account status
- `created_at` - Account creation timestamp

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Email Validation
- Must end with @my.unt.edu
- Real-time validation in frontend
- Server-side verification

### Token Security
- JWT tokens with expiration
- Secure token storage in localStorage
- Automatic token validation

## Testing the API

### 1. Health Check
```bash
curl http://127.0.0.1:8000/health
```

### 2. Create Account
```bash
curl -X POST "http://127.0.0.1:8000/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@my.unt.edu",
       "first_name": "John",
       "last_name": "Doe",
       "student_id": "11000000",
       "graduation_year": "2025",
       "major": "Computer Science",
       "password": "SecurePass123!"
     }'
```

### 3. Login
```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@my.unt.edu",
       "password": "SecurePass123!"
     }'
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change port in main.py: `uvicorn.run(app, host="127.0.0.1", port=8002)`

2. **CORS errors**
   - Ensure frontend runs on port 8001
   - Backend automatically allows this origin

3. **Database errors**
   - Database file created automatically
   - Located at `./unt_rate_professor.db`

4. **Import errors**
   - Ensure all dependencies installed: `pip install -r requirements.txt`

## Next Steps

The authentication system is now fully functional! You can:

1. Test user registration and login
2. Add professor rating functionality
3. Implement user profile management
4. Add password reset features
5. Deploy to production server

## Production Notes

For production deployment:
- Change `SECRET_KEY` in main.py
- Use PostgreSQL instead of SQLite
- Add rate limiting
- Implement email verification
- Use HTTPS
- Add proper logging