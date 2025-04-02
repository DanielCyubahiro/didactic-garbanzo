# Employee Management API

## 📌 Project Overview
The **Employee Management API** is a RESTful API built using **Node.js** and **Express.js**, providing authentication and employee management functionalities. The API includes JWT-based authentication, role-based access control, and data validation using **Joi**. MongoDB is used as the database to store user and employee information.

## 🚀 Features
- **Authentication & Authorization**
    - User registration and login using JWT authentication
    - Role-based access control (Admin, User, Editor)
    - Secure password hashing using bcrypt
    - Refresh token mechanism for session management
- **Employee Management**
    - CRUD operations for employees
    - Data validation with Joi
    - Protected routes requiring authentication and role-based access
- **Error Handling & Logging**
    - Centralized error handling with custom error classes
    - API response standardization
    - Logging with Morgan

## 🏗️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **Validation:** Joi
- **Middleware:** Morgan (logging), Express middleware

## 📂 Project Structure
```
📁 project-root
 ┣ 📂 config          # Configuration files (database, roles, logger)
 ┣ 📂 controllers     # Business logic for authentication & employee operations
 ┣ 📂 middlewares     # Middleware functions (JWT, roles, error handling)
 ┣ 📂 models          # Mongoose schemas for Users & Employees
 ┣ 📂 routes          # API route definitions (auth & employee routes)
 ┣ 📂 services        # Utility functions (auth services)
 ┣ 📂 utils           # Custom error and response handlers
 ┣ 📂 validations     # Joi validation schemas
 ┣ 📜 .env            # Environment variables
 ┣ 📜 app.js          # Express app setup
 ┣ 📜 package.json    # Project dependencies & scripts
 ┗ 📜 README.md       # Project documentation
```

## 📌 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo.git
cd your-repo
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
PORT=5000
DB_URI=mongodb+srv://yourMongoDBURI
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
JWT_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d
ENVIRONMENT=development  # Change to 'production' in production
```
### 4️⃣ Start the Server
```bash
npm start
```
The API will be available at `http://localhost:5000`

## 📌 API Endpoints

### 🔑 Authentication
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Login and receive JWT |
| GET    | `/auth/logout`   | Logout user and clear tokens |
| GET    | `/auth/refresh-token` | Refresh access token |

### 👨‍💼 Employee Management (Requires Authentication)
| Method | Endpoint        | Description |
|--------|----------------|-------------|
| GET    | `/employees`    | Get all employees |
| POST   | `/employees`    | Create a new employee (Admin, Editor) |
| GET    | `/employees/:id` | Get a single employee (User, Admin) |
| PUT    | `/employees/:id` | Update employee details (Admin, Editor) |
| DELETE | `/employees/:id` | Delete an employee (Admin) |

## 🛠️ Middleware Overview
- `verifyJWT.js`: Protects routes by verifying JWT tokens.
- `role.middleware.js`: Ensures users have the necessary roles to access routes.
- `error.middleware.js`: Handles errors globally and provides structured responses.

## 📝 Notes
- Passwords are securely hashed using **bcrypt**.
- Tokens are stored in cookies with `httpOnly` for security.
- The project follows **MVC architecture** for scalability and maintainability.

## 📌 Future Improvements
- Implement pagination for employee records.
- Add unit and integration tests.
- Improve logging and monitoring.

## 📜 License
This project is licensed under the **MIT License**.

