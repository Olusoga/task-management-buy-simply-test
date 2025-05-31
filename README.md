echo "
# ✅ Task Management System API

A simple and robust RESTful Task Management System built with NestJS, TypeORM, and PostgreSQL. This project follows best practices in modular architecture, testing, and security, and is fully implemented using VSCode, without Docker or caching.

---

## 🚀 Features Implemented

- ✅ Modular Architecture: AuthModule, UserModule, TaskModule
- ✅ RESTful Endpoints for Users, Tasks, and Auth
- ✅ JWT Authentication & Role-based Authorization (ADMIN, USER)
- ✅ Guards and Custom Decorator: @Roles()
- ✅ DTOs & Input Validation with class-validator
- ✅ Secure Password Hashing with bcrypt
- ✅ Swagger API Documentation
- ✅ Database Migrations using TypeORM CLI
- ✅ Unit and Integration Tests with Jest
- ✅ CI/CD with GitHub Actions
- ✅ Code Linting with ESLint
- ✅ Environment-based Configuration
- ✅ PostgreSQL with proper entity relationships
- ✅ CQRS Pattern (No Command/Query separation implemented)
- ✅ Event-driven architecture (No event emitters or listeners)
- ✅ Helmet for Security Headers (Basic security hardening not added)
- ✅ GitHub Actions CI/CD Setup
- ✅ ESLint Configured
- ✅ Pagination, Filtering (Tasks by status/priority)
- ✅ Proper Error Handling and Response Structure

---

## 🛠 Project Setup

# 1. Clone Repository
git clone https://github.com/Olusoga/task-management
cd BUY-SIMPLY-TEST

# 2. Install Dependencies
npm install

# 3. Configure Environment Variables
cp .env.example .env

# 4. Run Database Migrations
npm run typeorm migration:run

# 5. Start the Development Server
npm run start:dev

---

# 📦 Available Scripts

# ▶ Run Tests
npm run ci:test

# ▶ Run Test Coverage
npm run test:cov

# ▶ Run ESLint
npm run ci:lint

# ▶ Format Code with Prettier
npm run format

---

# 🧪 Testing
echo '🧪 Unit and integration tests written using Jest'
echo '🧪 Mocks used to isolate services and modules'
echo '🧪 End-to-end flow tested for core modules'

---

# 🔐 Authentication & Authorization
echo '🔐 JWT-based authentication'
echo '🔐 Role-based access control (ADMIN, USER)'
echo '🔐 Guards and decorators used to enforce route-level permissions'

---

# 📚 API Documentation
echo '📚 Swagger available at:'
echo '🔗 http://localhost:3000/swagger'

---

# 📁 Project Structure
echo '📁 Project Structure:'
echo '
src/
├── auth/
├── user/
├── task/
├── common/
├── config/
└── main.ts
'

---

# 🧱 Architecture Overview

# 📐 Clean Modular Monolith Design using NestJS
The system is organized using feature-based modules and follows SOLID principles. Business logic is encapsulated in services, with guards, decorators, and DTOs enforcing clean structure and validation.

🧠 Layers:
Layer        | Responsibility
------------ | --------------------------------------
Controller   | Route and request handling
Service      | Business logic
Repository   | Data access via TypeORM
DTO          | Validated data transfer objects using class-validator
Entity       | Database schema representation
Guard        | Authorization & access control
Decorator    | Reusable route-level permissions with @Roles()
Common       | Shared logic, guards, decorators, filters


# 🔄 CI/CD Pipeline
echo '🔄 GitHub Actions configured'
echo '🔄 Runs on push to main or on pull requests'
echo '🔄 Steps:'
echo '   • Install dependencies'
echo '   • Run lint'
echo '   • Run tests'

---

# 🛑 What Was Not Covered (To Improve)
echo '🛑 Improvements:'
echo '❌ Redis Caching for performance boost'
echo '❌ Docker/Docker Compose setup for containerization'
echo '❌ Rate Limiting (to prevent abuse)'
echo '❌ Soft Deletes using @DeleteDateColumn'
echo '❌ WebSockets or Notifications for real-time features'

---

# ✅ Summary
echo '✅ All core REST endpoints are working'
echo '✅ Codebase is modular and tested'
echo '❌ Caching, Docker, and advanced patterns are yet to be implemented'

---

# 📄 License
echo '📄 License: MIT'
"
