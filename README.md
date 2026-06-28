# 📋 Task Tracker

A full-stack task management application with project organization, filtering, sorting, pagination, and JWT authentication via HttpOnly cookies.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Design Notes](#design-notes)
- [AI Assistant Usage](#ai-assistant-usage)

---

## 🎯 Features

- ✅ **JWT Authentication** — Register, Login, Logout via HttpOnly cookies (XSS safe)
- 📁 **Project Management** — Create, Edit, Delete projects with user ownership
- ✅ **Task Management** — Full CRUD for tasks with title, description, status, priority, due date
- 🔍 **Filtering** — Filter tasks by status (TODO / DOING / DONE) and priority (LOW / MEDIUM / HIGH)
- 📊 **Sorting** — Sort tasks by due date or created date, ascending or descending
- 📄 **Pagination** — Server-side pagination on task list
- 🛡️ **Authorization** — Users can only see and manage their own tasks and projects
- 📖 **Swagger UI** — Interactive API documentation at `/swagger-ui/index.html`
- 🐳 **Docker Support** — Fully containerized with Docker Compose
- ✔️ **Automated Tests** — Backend unit and integration tests (10 tests passing)

---

## ⚙️ Tech Stack

### 🖥️ Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Language |
| Spring Boot | 4.1.0 | Framework |
| Spring Security | 7.0.8 | Authentication & Authorization |
| Spring Data JPA | 7.0.8 | ORM / Repository layer |
| Hibernate | 7.4.1 | JPA implementation |
| SQLite | 3.45.3 | Relational database |
| hibernate-community-dialects | 7.x | SQLite dialect for Hibernate |
| jjwt (JJWT) | 0.12.6 | JWT token generation and validation |
| Springdoc OpenAPI | 2.8.9 | Swagger UI / OpenAPI spec |
| Lombok | latest | Boilerplate reduction |
| Maven | 3.x | Build tool |
| JUnit 5 | 6.0.3 | Unit testing |
| Mockito | latest | Mocking in tests |

### 🎨 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.7 | UI framework |
| TypeScript | 6.0.2 | Type safety |
| Vite | 8.1.0 | Build tool and dev server |
| Tailwind CSS | 4.3.1 | Utility-first styling |
| shadcn/ui | 4.12.0 | UI component library |
| Radix UI | 1.6.0 | Headless UI primitives |
| Zustand | 5.0.14 | Global state management |
| Axios | 1.18.1 | HTTP client |
| React Hook Form | 7.80.0 | Form state management |
| Zod | 4.4.3 | Schema validation |
| @hookform/resolvers | 5.4.0 | Connects Zod to React Hook Form |
| React Router DOM | 7.18.0 | Client-side routing |
| Lucide React | 1.21.0 | Icon library |
| Geist Font | 5.2.9 | Typography |

### 🐳 Infrastructure

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |
| Nginx | Frontend static file serving + API proxy |
| GitHub Actions | CI — runs backend tests on every push |

---

## 📁 Project Structure

```
Full-Stack-Mini-App-Task-Tracker/
├── backend/                         # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/neuranx/.../
│   │   │   │   ├── config/          # SecurityConfig, OpenApiConfig
│   │   │   │   ├── controller/      # AuthController, TaskController, ProjectController
│   │   │   │   ├── dto/             # Request and Response DTOs
│   │   │   │   ├── entity/          # User, Project, Task JPA entities
│   │   │   │   ├── exception/       # GlobalExceptionHandler
│   │   │   │   ├── repository/      # JPA repositories
│   │   │   │   ├── security/        # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
│   │   │   │   └── service/         # AuthService, TaskService, ProjectService
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Unit and integration tests
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── schema.sql                   # Reference SQL schema
│   └── pom.xml
│
├── frontend/                        # React SPA
│   ├── src/
│   │   ├── api/                     # Axios instance, auth/tasks/projects API calls
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn components
│   │   │   ├── layout/              # Navbar, Sidebar, PageWrapper
│   │   │   ├── tasks/               # TaskCard, TaskList, TaskForm, TaskFilters
│   │   │   ├── projects/            # ProjectCard, ProjectList, ProjectForm
│   │   │   └── common/              # LoadingSpinner, ErrorMessage, EmptyState
│   │   ├── hooks/                   # useAuth, useTasks, useProjects
│   │   ├── pages/                   # LoginPage, RegisterPage, DashboardPage, TasksPage, ProjectsPage
│   │   ├── store/                   # authStore (Zustand), taskStore (Zustand)
│   │   ├── types/                   # TypeScript interfaces and enums
│   │   └── lib/                     # utils (cn helper), constants
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI
├── .env.example                     # Root env for Docker Compose
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Java 21
- Maven (or use `./mvnw` wrapper — no install needed)
- Node.js 20+ and pnpm
- Docker and Docker Compose (optional)

---

### 1. Clone the repository

```bash
git clone https://github.com/Vishwanathangit/Full-Stack-Mini-App-Task-Tracker-.git
cd Full-Stack-Mini-App-Task-Tracker
```

---

### Option 1 — Run Without Docker

#### 2. Run the backend

> **Note:** The backend requires a `JWT_SECRET` environment variable. Set it before running:

**Windows (PowerShell):**
```powershell
$env:JWT_SECRET="YOUR TOKEN"
./mvnw spring-boot:run
```

**Mac/Linux:**
```bash
JWT_SECRET=YOUR TOKEN ./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

#### 3. Run the frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at: `http://localhost:5173`

---

### Option 2 — Run With Docker Compose

#### 2. Setup environment

```bash
cp .env.example .env
# Edit .env — set a strong JWT_SECRET
```

#### 3. Build and start all services

```bash
docker-compose up --build
```

Frontend: `http://localhost`  
Backend API: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

#### 4. Stop services

```bash
docker-compose down
```

#### 5. Stop and remove data volume

```bash
docker-compose down -v
```

---

### Build Docker Images Individually

#### Backend

```bash
cd backend
docker build -t task-tracker-backend .
docker run -p 8080:8080 \
  -e JWT_SECRET=YOUR TOKEN \
  -e JWT_EXPIRATION=86400000 \
  -e CORS_ALLOWED_ORIGINS=http://localhost:5173 \
  -e COOKIE_SECURE=false \
  task-tracker-backend
```

#### Frontend

```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:8080 -t task-tracker-frontend .
docker run -p 80:80 task-tracker-frontend
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | — | **Required.** Min 32 chars secret key for signing JWT |
| `JWT_EXPIRATION` | `86400000` | Token expiry in milliseconds (default: 24 hours) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Allowed frontend origin for CORS |
| `COOKIE_SECURE` | `false` | Set to `true` in production (HTTPS only) |
| `DB_PATH` | `tasktracker.db` | Path to SQLite database file |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Backend API base URL |

---

## 🧪 Scripts

### Backend

```bash
# Run the application (Windows PowerShell)
$env:JWT_SECRET="YOUR TOKEN"
./mvnw spring-boot:run

# Run the application (Mac/Linux)
JWT_SECRET=YOUR TOKEN ./mvnw spring-boot:run

# Build jar (skip tests)
./mvnw clean package -DskipTests

# Run all tests
./mvnw test

# Build and run jar directly
./mvnw clean package -DskipTests
java -jar target/Full-Stack-Mini-App-Task-Tracker-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint
pnpm lint

# Run backend from frontend folder (Windows)
pnpm backend:run

# Build backend from frontend folder
pnpm backend:build

# Test backend from frontend folder
pnpm backend:test
```

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, sets HttpOnly JWT cookie | No |
| POST | `/api/auth/logout` | Logout, clears cookie | No |

### 📁 Projects

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/projects` | Get all user's projects | Yes |
| POST | `/api/projects` | Create a new project | Yes |
| GET | `/api/projects/{id}` | Get project by ID | Yes |
| PUT | `/api/projects/{id}` | Update project | Yes |
| DELETE | `/api/projects/{id}` | Delete project | Yes |

### ✅ Tasks

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/tasks` | Get tasks (filtered, sorted, paginated) | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| GET | `/api/tasks/{id}` | Get task by ID | Yes |
| PUT | `/api/tasks/{id}` | Update task | Yes |
| DELETE | `/api/tasks/{id}` | Delete task | Yes |

### Task Query Parameters

| Param | Type | Values | Description |
|---|---|---|---|
| `status` | string | `TODO`, `DOING`, `DONE` | Filter by status |
| `priority` | string | `LOW`, `MEDIUM`, `HIGH` | Filter by priority |
| `sortBy` | string | `dueDate`, `createdAt` | Sort field |
| `sortDir` | string | `asc`, `desc` | Sort direction |
| `page` | int | `0, 1, 2...` | Page number (0-based) |
| `size` | int | `1-100` | Page size |

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `204` | Deleted successfully |
| `400` | Validation error |
| `401` | Unauthenticated |
| `403` | Forbidden |
| `404` | Resource not found |

---

## 🏗️ Design Notes

### Architecture Decisions

- **SQLite** chosen for zero-config local setup — no database server to install. Swap the datasource for PostgreSQL or MySQL in production by changing `application.properties`.
- **JWT in HttpOnly cookie** — more secure than localStorage (immune to XSS attacks). The backend sets and clears the cookie; the frontend never touches the token directly.
- **Stateless backend** — no session state. Every request is authenticated by validating the JWT cookie in `JwtAuthFilter`.
- **CSS variables** — all colors defined once in `index.css` as CSS custom properties. No hardcoded color values anywhere in components.
- **Zustand** — lightweight global state for auth and task filters. No Redux overhead needed at this scale.
- **React Hook Form + Zod** — type-safe form validation. Zod schemas are the single source of truth for form shape and validation rules.
- **Separation of concerns** — API calls in `/api`, global state in `/store`, business logic in `/hooks`, UI in `/components`.

### Trade-offs

| Decision | Trade-off |
|---|---|
| SQLite | Simple setup but limited concurrent writes — use PostgreSQL in production |
| HttpOnly cookie | Slightly more complex CORS setup but much safer than localStorage |
| No refresh tokens | Simpler implementation but token expiry requires re-login |
| Zustand over Redux | Less boilerplate but no Redux DevTools time-travel debugging |

### What Would Be Added for Production

- PostgreSQL or MySQL instead of SQLite
- Refresh token rotation
- Rate limiting on auth endpoints (e.g. Spring Security's rate limiter or Bucket4j)
- HTTPS with `COOKIE_SECURE=true`
- Email verification on register
- Pagination on projects endpoint
- Role-based access control (ADMIN / USER)
- Logging with structured JSON (Logback + ELK stack)

---

## 🤖 AI Assistant Usage

This project was built with assistance from **Claude (Anthropic — claude.ai)** for:

- Initial project structure and package setup prompts
- Boilerplate code generation for entities, repositories, and services
- Debugging test failures and dependency issues
- Docker and CI configuration templates
- README structure

All architectural decisions, code review, debugging logic, and understanding of the generated code are my own. I can explain every part of this codebase in detail.

---

## 📄 License

MIT License — free to use, modify, and distribute.
