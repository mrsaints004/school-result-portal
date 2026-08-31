# School Result Portal - Technical Documentation

## Overview

The School Result Portal is a full-stack web application that enables schools to manage and publish student academic results online. It provides three access levels: **Admin**, **Student**, and **Public**.

This project was developed as part of the **3MTT NextGen Programme** to demonstrate proficiency in modern web development using Next.js, MongoDB, and authentication best practices.

---

## System Architecture

```
Client (Browser)
    │
    ▼
Next.js App Router (Frontend + API Routes)
    │
    ├── NextAuth.js (Authentication & Session Management)
    │
    ├── Middleware (Route Protection by Role)
    │
    └── Mongoose ODM
            │
            ▼
       MongoDB Atlas (Cloud Database)
```

---

## Data Models

### User

| Field     | Type   | Description                          |
|-----------|--------|--------------------------------------|
| name      | String | Full name of the user                |
| email     | String | Unique email address                 |
| password  | String | Bcrypt-hashed password (12 rounds)   |
| role      | Enum   | `admin` or `student`                 |
| studentId | String | Unique student identifier (students) |
| createdAt | Date   | Auto-generated timestamp             |

### Result

| Field       | Type     | Description                        |
|-------------|----------|------------------------------------|
| studentId   | String   | Links result to a student          |
| studentName | String   | Student's full name                |
| session     | String   | Academic session (e.g. 2024/2025)  |
| term        | Enum     | `1st`, `2nd`, or `3rd`             |
| className   | String   | Class name (e.g. JSS 1A, SSS 1A)  |
| subjects    | Array    | List of subject scores and grades  |
| createdBy   | String   | Admin user ID who created this     |
| createdAt   | Date     | Auto-generated timestamp           |

### Subject (embedded in Result)

| Field | Type   | Description                |
|-------|--------|----------------------------|
| name  | String | Subject name               |
| score | Number | Score from 0 to 100        |
| grade | String | Auto-calculated letter grade |

### Grading Scale

| Score Range | Grade |
|-------------|-------|
| 70 - 100    | A     |
| 60 - 69     | B     |
| 50 - 59     | C     |
| 40 - 49     | D     |
| 0 - 39      | F     |

---

## API Endpoints

### Authentication

| Method | Endpoint            | Auth     | Description              |
|--------|---------------------|----------|--------------------------|
| POST   | /api/auth/register  | Public   | Register a new student   |
| POST   | /api/auth/[...nextauth] | Public | Login via NextAuth    |

### Results

| Method | Endpoint              | Auth    | Description                          |
|--------|-----------------------|---------|--------------------------------------|
| GET    | /api/results          | Required | Get results (filtered by role)      |
| POST   | /api/results          | Admin   | Create a new result                  |
| GET    | /api/results/[id]     | Required | Get a specific result               |
| PUT    | /api/results/[id]     | Admin   | Update a result                      |
| DELETE | /api/results/[id]     | Admin   | Delete a result                      |
| GET    | /api/results/search   | Public  | Search results by Student ID         |

### Admin

| Method | Endpoint       | Auth  | Description                    |
|--------|----------------|-------|--------------------------------|
| GET    | /api/students  | Admin | List all registered students   |
| GET    | /api/stats     | Admin | Get dashboard statistics       |

---

## User Roles & Permissions

### Admin
- View dashboard with statistics (total students, total results)
- Add new results for any student
- Edit and delete existing results
- View all registered students

### Student
- Register with name, email, password, and Student ID
- Log in and view personal dashboard
- View all their results across sessions and terms

### Public (No Login Required)
- Search results by Student ID on the home page
- View result details for any valid Student ID

---

## Application Pages

| Route                    | Access  | Description                     |
|--------------------------|---------|---------------------------------|
| /                        | Public  | Home page with result search    |
| /auth/login              | Public  | Login page                      |
| /auth/register           | Public  | Student registration            |
| /results/search          | Public  | Search results display          |
| /student/dashboard       | Student | Student's personal results      |
| /admin/dashboard         | Admin   | Admin overview with statistics  |
| /admin/results           | Admin   | Manage all results              |
| /admin/results/new       | Admin   | Add new result form             |
| /admin/results/[id]/edit | Admin   | Edit an existing result         |
| /admin/students          | Admin   | View all registered students    |

---

## Security

- **Password Hashing**: All passwords are hashed using bcryptjs with 12 salt rounds
- **JWT Sessions**: Authentication uses JSON Web Tokens (no server-side sessions)
- **Route Protection**: Middleware checks JWT tokens and enforces role-based access
- **Environment Variables**: Database credentials and secrets are stored in `.env.local` (gitignored)
- **Input Validation**: All API endpoints validate required fields and data types
- **Score Validation**: Subject scores are validated to be between 0 and 100

---

## Demo Credentials

### Admin Account

```
Email:    admin@school.com
Password: admin123
```

### Student Accounts (all use password: student123)

| Name                | Email                              | Student ID | Class  |
|---------------------|------------------------------------|------------|--------|
| Adebayo Olamide     | adebayo.olamide@student.com        | STU001     | JSS 1A |
| Chidinma Okafor     | chidinma.okafor@student.com        | STU002     | JSS 1A |
| Emeka Nwosu         | emeka.nwosu@student.com            | STU003     | JSS 1B |
| Fatima Abdullahi    | fatima.abdullahi@student.com       | STU004     | JSS 2A |
| Ibrahim Musa        | ibrahim.musa@student.com           | STU005     | JSS 2A |
| Ngozi Eze           | ngozi.eze@student.com              | STU006     | JSS 2B |
| Oluwaseun Bakare    | oluwaseun.bakare@student.com       | STU007     | JSS 3A |
| Aisha Mohammed      | aisha.mohammed@student.com         | STU008     | JSS 3A |
| Chukwuemeka Ani     | chukwuemeka.ani@student.com        | STU009     | SSS 1A |
| Blessing Okonkwo    | blessing.okonkwo@student.com       | STU010     | SSS 1A |

### Quick Test Flow

1. **Public Search**: Go to the home page, enter `STU001`, and click Search
2. **Student Login**: Log in with `adebayo.olamide@student.com` / `student123` to view the student dashboard
3. **Admin Login**: Log in with `admin@school.com` / `admin123` to manage results and view statistics

---

## Seeded Demo Data

The seed script (`scripts/seed-demo.ts`) populates the database with:

- **10 students** across classes JSS 1A through SSS 1A
- **30 results** (3 terms per student for the 2024/2025 session)
- **9 subjects per result**:
  - JSS students: Mathematics, English Language, Basic Science, Basic Technology, Social Studies, Civic Education, Agricultural Science, Business Studies, Computer Studies
  - SSS students: Mathematics, English Language, Physics, Chemistry, Biology, Economics, Government, Literature in English, Computer Science
- Scores are randomly generated between 35 and 98, with grades auto-calculated

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/school-result-portal?retryWrites=true&w=majority
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 3. Seed the database

```bash
npx tsx scripts/seed-demo.ts
```

### 4. Start the application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Technologies & Dependencies

| Package    | Version | Purpose                      |
|------------|---------|------------------------------|
| next       | 14.2.35 | React framework (App Router) |
| react      | 18      | UI library                   |
| mongoose   | 9.8.0   | MongoDB object modeling      |
| next-auth  | 4.24.15 | Authentication               |
| bcryptjs   | 3.0.3   | Password hashing             |
| tailwindcss| 3.4.1   | Utility-first CSS            |
| typescript | 5       | Type safety                  |

---

*Built for the 3MTT NextGen Programme.*
