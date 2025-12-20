# 🏢 Anycomp - Company Registration & Management Platform

A full-stack web application for managing company registration services, built with **Next.js**, **Express.js**, **TypeORM**, and **PostgreSQL (Neon)**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4.18-green?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?logo=postgresql)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Authentication & RBAC](#-authentication--rbac)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Deployment](#-deployment)

---

## 🎯 Overview

**Anycomp** is a platform where administrators can create, manage, and publish "Specialist" profiles (service providers for company registration services). The application implements:

- **CRUD Operations** for Specialists with "Intelligent Save" (UPSERT)
- **JWT Authentication** with Role-Based Access Control (RBAC)
- **Platform Fee Calculation** based on tiered pricing
- **Draft/Publish Workflow** for content management
- **Soft Delete** for data preservation

---

## ✨ Features

### Public Features
- 🏠 Landing page with company services overview
- 📋 View published specialists/services
- 🔐 User registration and login

### User Features (Staff)
- ✏️ Create new specialists (saved as Draft)
- 📝 Edit own draft specialists
- 👁️ View all specialists

### Admin Features (Manager)
- ✅ Publish/Unpublish specialists
- 🔍 Verify specialists (approve/reject)
- 🗑️ Delete specialists (soft delete)
- 💰 Manage platform fee tiers
- 👥 Full CRUD access

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeORM | ORM for PostgreSQL |
| PostgreSQL (Neon) | Cloud database |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |

---

## 📁 Project Structure

```
anycomp/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── globals.css               # Global styles
│   ├── signin/                   # Login page
│   ├── signup/                   # Registration page
│   ├── dashboard/                # Protected dashboard
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard home
│   │   └── specialists/          # Specialists management
│   │       ├── page.tsx          # List all specialists
│   │       ├── create/page.tsx   # Create new specialist
│   │       └── [id]/page.tsx     # View/Edit specialist
│   ├── services/                 # Public services page
│   ├── how-it-works/             # How it works page
│   ├── register-company/         # Company registration info
│   └── appoint-secretary/        # Secretary appointment info
│
├── components/                   # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── dashboard/
│       └── EditServiceModal.tsx
│
├── context/                      # React Context
│   └── AuthContext.tsx           # Authentication state management
│
├── backend/                      # Express.js API
│   ├── server.js                 # Entry point
│   ├── data-source.js            # TypeORM configuration
│   ├── entity/                   # Database entities
│   │   ├── User.js
│   │   ├── Specialist.js
│   │   ├── ServiceOffering.js
│   │   ├── PlatformFee.js
│   │   └── Media.js
│   ├── controllers/              # Route handlers
│   │   ├── authController.js
│   │   └── specialistController.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   └── specialists.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT & RBAC
│   │   └── errorHandler.js
│   └── scripts/                  # Utility scripts
│       ├── createAdmin.js
│       └── seedPlatformFees.js
│
├── public/                       # Static assets
├── .env.local                    # Frontend environment
└── package.json                  # Frontend dependencies
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────────┐
│     users       │       │    specialists      │
├─────────────────┤       ├─────────────────────┤
│ id (PK)         │       │ id (PK, UUID)       │
│ name            │       │ title               │
│ email (unique)  │       │ slug (unique)       │
│ password        │       │ description         │
│ phone           │       │ base_price          │
│ role            │       │ platform_fee        │
│ created_at      │       │ final_price         │
│ updated_at      │       │ duration_days       │
└─────────────────┘       │ is_draft            │
                          │ is_verified         │
                          │ verification_status │
                          │ average_rating      │
                          │ total_number_of_... │
                          │ created_at          │
                          │ updated_at          │
                          │ deleted_at          │
                          └──────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐
│ service_offerings   │  │       media         │  │  platform_fee   │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────┤
│ id (PK, UUID)       │  │ id (PK, UUID)       │  │ id (PK, UUID)   │
│ specialists (FK)    │  │ specialists (FK)    │  │ tier_name       │
│ created_at          │  │ file_name           │  │ min_value       │
│ updated_at          │  │ file_size           │  │ max_value       │
└─────────────────────┘  │ display_order       │  │ platform_fee_%  │
                         │ mime_type           │  │ created_at      │
                         │ media_type          │  │ updated_at      │
                         │ uploaded_at         │  └─────────────────┘
                         │ deleted_at          │
                         │ created_at          │
                         │ updated_at          │
                         └─────────────────────┘
```

### Key Fields

| Table | Field | Type | Description |
|-------|-------|------|-------------|
| specialists | is_draft | boolean | `true` = Draft, `false` = Published |
| specialists | verification_status | enum | `pending`, `approved`, `under_review`, `rejected` |
| specialists | is_verified | boolean | Auto-set when approved |
| specialists | deleted_at | timestamp | Soft delete timestamp |
| platform_fee | tier_name | enum | `basic`, `standard`, `premium`, `enterprise` |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/signup` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT token |
| `GET` | `/api/auth/me` | Protected | Get current user info |

### Specialists

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/specialists` | Public | List all specialists (filterable) |
| `GET` | `/api/specialists/:id` | Public | Get single specialist |
| `POST` | `/api/specialists` | Admin/User | Create specialist |
| `PUT` | `/api/specialists/:id` | Admin/User | Update specialist |
| `PATCH` | `/api/specialists/:id/publish` | **Admin** | Publish (is_draft=false) |
| `PATCH` | `/api/specialists/:id/unpublish` | **Admin** | Unpublish (is_draft=true) |
| `PATCH` | `/api/specialists/:id/verify` | **Admin** | Change verification_status |
| `DELETE` | `/api/specialists/:id` | **Admin** | Soft delete |

### Platform Fees

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/specialists/platform-fees/all` | Public | Get all fee tiers |
| `POST` | `/api/specialists/platform-fees` | **Admin** | Create/update fee tier |

### Query Parameters

```
GET /api/specialists?is_draft=false&verification_status=approved&search=company&page=1&limit=10&sortBy=created_at&sortOrder=DESC
```

---

## 🔐 Authentication & RBAC

### Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full access: Create, Read, Update, Delete, Publish, Verify |
| `user` | Limited: Create (draft only), Read, Update own drafts |
| `secretary` | View only (future feature) |

### JWT Token Flow

```
1. User logs in → POST /api/auth/login
2. Server validates credentials
3. Server returns JWT token (expires in 2h)
4. Client stores token in localStorage
5. Client sends token in Authorization header: "Bearer <token>"
6. Server validates token on protected routes
7. Server checks role for RBAC-protected routes
```

### Protected Route Example

```javascript
// Only admins can publish
router.patch('/:id/publish', protect, authorize('admin'), publishSpecialist);
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/anycomp.git
cd anycomp

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Database Setup

1. Create a PostgreSQL database on [Neon](https://neon.tech)
2. Copy the connection string
3. Configure environment variables (see below)

### Run the Application

```bash
# Terminal 1: Start backend
cd backend
node scripts/createAdmin.js      # Create admin user (first time only)
node scripts/seedPlatformFees.js # Seed fee tiers (first time only)
node server.js                   # Start server on port 5000

# Terminal 2: Start frontend
pnpm dev                         # Start on port 3000
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

### Default Admin Credentials

```
Email: admin@anycomp.com
Password: admin123456
```

> ⚠️ **Change the password after first login!**

---

## ⚙️ Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (backend/.env)

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=2h

# Server
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📜 Scripts

### Frontend

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

### Backend

```bash
npm start                          # Start server
npm run dev                        # Start with nodemon (hot reload)
node scripts/createAdmin.js        # Create admin user
node scripts/seedPlatformFees.js   # Seed platform fee tiers
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = Your backend URL

### Backend (Railway/Render)

1. Create a new web service
2. Connect to GitHub repository
3. Set root directory to `backend`
4. Set environment variables
5. Deploy

### Database (Neon)

1. Already hosted - just use the connection string
2. For production: Set `NODE_ENV=production` to disable auto-sync

---

## 📊 Platform Fee Calculation

Platform fees are automatically calculated based on `base_price`:

| Tier | Price Range | Fee % |
|------|-------------|-------|
| Basic | RM 0 - 1,000 | 5% |
| Standard | RM 1,001 - 5,000 | 4% |
| Premium | RM 5,001 - 10,000 | 3% |
| Enterprise | RM 10,001+ | 2% |

**Example:**
- base_price = RM 2,000
- Tier = Standard (4%)
- platform_fee = RM 80
- final_price = RM 2,080

---

## 🔄 Specialist Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                  SPECIALIST WORKFLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. CREATE                                                  │
│     └─► is_draft: true, verification_status: 'pending'     │
│                           │                                 │
│                           ▼                                 │
│  2. VERIFY (Admin)                                          │
│     └─► verification_status: 'approved', is_verified: true │
│                           │                                 │
│                           ▼                                 │
│  3. PUBLISH (Admin)                                         │
│     └─► is_draft: false  ──► NOW VISIBLE TO PUBLIC         │
│                           │                                 │
│                           ▼                                 │
│  4. UNPUBLISH (optional)                                    │
│     └─► is_draft: true   ──► Hidden from public            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@anycomp.com","password":"admin123456"}'

# Create Specialist (with token)
curl -X POST http://localhost:5000/api/specialists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Company Registration","base_price":2000,"duration_days":3}'

# Get All Specialists
curl http://localhost:5000/api/specialists

# Publish Specialist (Admin only)
curl -X PATCH http://localhost:5000/api/specialists/UUID/publish \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📝 License

This project is part of a Full-Stack Developer Assessment.

---

## 👨‍💻 Author

**Keshav Upadhyay**

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [Neon PostgreSQL](https://neon.tech)
- [Tailwind CSS](https://tailwindcss.com)
