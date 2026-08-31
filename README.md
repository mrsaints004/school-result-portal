# School Result Portal

A web-based student result management system built with Next.js, MongoDB, and NextAuth.js. Developed as part of the **3MTT NextGen Programme**.

Admins can create, edit, and manage student academic results. Students can register, log in, and view their results. The public can search results by Student ID.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: NextAuth.js (Credentials provider, JWT strategy)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Features

- Role-based access control (Admin / Student)
- Admin dashboard with student and result statistics
- Add, edit, and delete student results
- Automatic grade calculation (A/B/C/D/F)
- Student registration and login
- Student dashboard to view personal results
- Public result search by Student ID
- Protected routes via middleware

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/school-result-portal.git
cd school-result-portal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/school-result-portal?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

- **MONGODB_URI**: Your MongoDB Atlas connection string
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
- **NEXTAUTH_URL**: Your app URL (`http://localhost:3000` for local dev)

### 4. Seed demo data

```bash
npx tsx scripts/seed-demo.ts
```

This creates 1 admin, 10 students, and 30 result records (3 terms each).

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials

### Admin

| Field    | Value              |
|----------|--------------------|
| Email    | admin@school.com   |
| Password | admin123           |

### Students

All student accounts use the password: **student123**

| Name                | Email                              | Student ID |
|---------------------|------------------------------------|------------|
| Adebayo Olamide     | adebayo.olamide@student.com        | STU001     |
| Chidinma Okafor     | chidinma.okafor@student.com        | STU002     |
| Emeka Nwosu         | emeka.nwosu@student.com            | STU003     |
| Fatima Abdullahi    | fatima.abdullahi@student.com       | STU004     |
| Ibrahim Musa        | ibrahim.musa@student.com           | STU005     |
| Ngozi Eze           | ngozi.eze@student.com              | STU006     |
| Oluwaseun Bakare    | oluwaseun.bakare@student.com       | STU007     |
| Aisha Mohammed      | aisha.mohammed@student.com         | STU008     |
| Chukwuemeka Ani     | chukwuemeka.ani@student.com        | STU009     |
| Blessing Okonkwo    | blessing.okonkwo@student.com       | STU010     |

## Project Structure

```
school-result-portal/
├── app/
│   ├── api/
│   │   ├── auth/            # NextAuth + registration endpoints
│   │   ├── results/         # CRUD operations for results
│   │   ├── students/        # List students (admin)
│   │   └── stats/           # Dashboard statistics (admin)
│   ├── admin/               # Admin pages (dashboard, results, students)
│   ├── auth/                # Login and registration pages
│   ├── student/             # Student dashboard
│   ├── results/             # Public result search
│   └── components/          # Shared UI components
├── lib/                     # Database connection, auth config, utilities
├── models/                  # Mongoose schemas (User, Result)
├── scripts/                 # Database seed scripts
├── middleware.ts             # Route protection
└── types/                   # TypeScript type definitions
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel deployment URL)
4. Deploy

## License

This project was built for the 3MTT NextGen Programme.
