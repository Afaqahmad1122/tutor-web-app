# Find a Tutor - Web Application Requirements

## 📋 Project Overview

**Project Name:** Find a Tutor  
**Location:** Peshawar, Pakistan  
**Purpose:** Connect parents/students with qualified tutors in Peshawar based on subject, area, experience, budget, and other criteria.

## 🎯 Core Objectives

- Provide a platform for tutors to showcase their profiles and manage bookings
- Enable parents/students to search, filter, and connect with tutors
- Admin panel for platform management and moderation
- Support both online and in-person tutoring sessions

---

## 👥 User Roles

1. **Tutors** - Register, create profiles, manage bookings
2. **Parents/Students (Looking for Tutor)** - Search tutors, book sessions, leave reviews
3. **Admin** - Manage platform, verify tutors, moderate content

### ⚠️ Important: Role Selection During Registration/Login

**During Registration:**

- User MUST explicitly choose their role before completing registration:
  - **"I am a Tutor"** - For tutors registering to offer their services
  - **"I'm Looking for a Tutor"** - For parents/students seeking tutoring services
- Role selection is mandatory and cannot be changed after registration (or requires admin approval)
- This ensures proper account setup and appropriate dashboard access

**During Login:**

- User will log in with their email/phone and password
- System automatically routes them based on their selected role:
  - Tutors → Tutor Dashboard
  - Looking for Tutor → Student/Parent Dashboard

---

## 🔑 Core Features

### 👩‍🏫 For Tutors

#### 1. Registration & Authentication

- **Role Selection First:** User must select "I am a Tutor" before proceeding
- Email/phone registration with OTP verification
- Role-specific registration form (tutor profile setup begins)
- Social login (optional: Google, Facebook) - role must still be selected
- Password reset functionality
- After registration, redirect to tutor profile completion if not completed

#### 2. Tutor Profile Management

- **Personal Information:**
  - Full name, profile photo, contact details
  - Gender, age/DOB (optional)
  - Bio/Introduction (max 500 words)
- **Professional Details:**
  - Educational qualifications (degree, institution, year)
  - Subjects taught (multi-select with levels: Primary, Secondary, O-Level, A-Level, University)
  - Teaching experience (years)
  - Specializations or certifications
  - Teaching method (Online, In-Person, Hybrid)
- **Location & Availability:**
  - Area/Location (University Town, Hayatabad, Saddar, etc.)
  - Full address (optional, for privacy)
  - Availability calendar/time slots
  - Preferred meeting locations (home, student's place, online)
- **Pricing:**
  - Hourly rate (PKR)
  - Monthly package rate (optional)
  - Group session discounts (optional)

#### 3. Tutor Dashboard

- View profile statistics (views, bookings, ratings)
- Manage bookings (accept/reject/reschedule)
- Message center (chat with parents/students)
- Payment history
- Edit profile settings
- Availability calendar management

#### 4. Reviews & Ratings

- View all received reviews and ratings
- Respond to reviews (optional)
- Average rating display on profile

---

### 👨‍👩‍👧 For Parents/Students

#### 1. Registration & Authentication

- **Role Selection First:** User must select "I'm Looking for a Tutor" before proceeding
- Email/phone registration with OTP verification
- Role-specific registration form (student/parent information)
- Social login (optional) - role must still be selected
- Password reset functionality
- After registration, redirect to student dashboard

#### 2. Search & Discovery

- **Search Functionality:**
  - Text search (by tutor name, subject)
  - Advanced filters:
    - Subject(s)
    - Area/Location
    - Price range (hourly/monthly)
    - Qualification level
    - Teaching method (online/in-person/hybrid)
    - Gender preference
    - Rating (minimum 4+ stars, etc.)
    - Experience years
    - Verification status
- **Display Options:**
  - List view with tutor cards
  - Map view (showing tutors near user location)
  - Grid view
- **Sorting:**
  - By rating (highest to lowest)
  - By price (low to high, high to low)
  - By distance (nearest first)
  - By experience

#### 3. Tutor Profile View

- Full tutor profile details
- Gallery (if applicable)
- Reviews and ratings from other users
- Availability calendar
- Contact option (message or book session)

#### 4. Booking System

- Book a trial session
- Book recurring sessions
- Select time slot from tutor's availability
- Add session notes/requirements
- Receive booking confirmation
- Cancel/reschedule bookings

#### 5. Messaging

- In-app messaging system
- Send messages to tutors
- Receive notifications for new messages

#### 6. Reviews & Ratings

- Leave rating (1-5 stars)
- Write detailed review
- Rate multiple aspects (knowledge, communication, punctuality, etc.)

#### 7. Favorites

- Save favorite tutors
- Quick access to saved tutors

#### 8. Payment

- **Phase 1:** Cash payment (marked as completed after session)
- **Phase 2:** Online payment integration (JazzCash, Easypaisa, bank transfer)
- Payment history

#### 9. User Dashboard

- Booking history
- Upcoming sessions
- Saved tutors
- Messages
- Payment history

---

### 👨‍💼 For Admin

#### 1. Dashboard Overview

- Platform statistics:
  - Total tutors, students, active bookings
  - Revenue (if payment integrated)
  - Most searched subjects
  - Popular areas
  - Growth metrics

#### 2. Tutor Management

- View all tutor profiles
- Approve/reject tutor registrations
- Verify tutor profiles (add verification badge)
- Suspend/ban tutors
- Edit tutor information (if needed)

#### 3. User Management

- View all registered users
- Suspend/ban users
- View user activity

#### 4. Content Moderation

- Review and moderate user reviews
- Remove inappropriate content
- Handle reported profiles/users

#### 5. Announcements & Notifications

- Send platform-wide announcements
- Push notifications to users

#### 6. Reports & Analytics

- User engagement metrics
- Popular subjects/areas
- Search trends
- Booking statistics

---

## 🛠 Technical Requirements

### Frontend Stack

#### Framework & Libraries

- **Next.js 14+** (App Router)

  - Server-side rendering for SEO
  - API routes for backend integration
  - Image optimization
  - Built-in routing

- **React 18+**

  - Component-based architecture
  - Hooks for state management

- **TypeScript**

  - Type safety
  - Better code maintainability

- **Tailwind CSS**

  - Utility-first CSS framework
  - Responsive design
  - Custom theme configuration

- **UI Component Library**
  - Shadcn/ui or Headless UI (optional)
  - Custom components as needed

#### State Management

- **React Context API** or **Zustand** for global state
- **React Query (TanStack Query)** for server state and caching

#### Form Handling

- **React Hook Form** with **Zod** validation

#### Maps Integration

- **Google Maps API** or **Mapbox** for location services

#### Authentication

- **NextAuth.js** or **Auth.js** for authentication

#### HTTP Client

- **Axios** or **Fetch API** for API calls

---

### Backend Stack

#### Runtime & Framework

- **Node.js 18+ LTS**
- **Express.js** or **Next.js API Routes**
  - RESTful API endpoints
  - Middleware for authentication, validation, error handling

#### Database

- **PostgreSQL** or **MySQL**

  - User accounts and profiles
  - Tutor listings
  - Bookings and sessions
  - Reviews and ratings
  - Messages

- **Redis** (optional)
  - Session management
  - Caching frequently accessed data
  - Rate limiting

#### ORM/Query Builder

- **Prisma** or **Sequelize**
  - Database schema management
  - Type-safe database queries

#### File Storage

- **Cloudinary** or **AWS S3**
  - Profile pictures
  - Tutor gallery images
  - Documents

#### Email Service

- **Nodemailer** with SMTP or **SendGrid**
  - Registration verification
  - Password reset
  - Booking confirmations
  - Notifications

#### SMS Service (Optional)

- **Twilio** or local Pakistani SMS provider
  - OTP verification via SMS

---

### Security Requirements

1. **Authentication & Authorization**

   - JWT tokens for session management
   - Role-based access control (RBAC)
   - Secure password hashing (bcrypt)

2. **Data Protection**

   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection
   - CSRF protection

3. **API Security**

   - Rate limiting
   - API key management
   - HTTPS only

4. **Privacy**
   - GDPR compliance considerations
   - User data encryption
   - Secure file uploads

---

### Database Schema (Key Entities)

#### Users Table

- id, email, phone, password_hash, **role (tutor/student/admin)** - **MUST be set during registration**
- created_at, updated_at, verified, active
- **Note:** Role is selected during registration and determines user's dashboard access

#### Tutor Profiles Table

- id, user_id, name, photo_url, bio, gender
- qualification, experience_years, subjects[]
- location, address, teaching_method
- hourly_rate, monthly_rate
- verified, rating_avg, total_reviews

#### Subjects Table

- id, name, level (Primary/Secondary/O-Level/A-Level/University)

#### Bookings Table

- id, tutor_id, student_id, session_date, session_time
- duration, location, status (pending/accepted/completed/cancelled)
- notes, payment_status

#### Reviews Table

- id, tutor_id, student_id, booking_id
- rating, comment, aspects (JSON)
- created_at, approved

#### Messages Table

- id, sender_id, receiver_id, booking_id
- message, read_status, created_at

#### Favorites Table

- id, student_id, tutor_id, created_at

---

### API Endpoints Structure

#### Authentication

- `POST /api/auth/register` (requires `role` field: "tutor" or "student")
- `POST /api/auth/login` (returns role-based redirect info)
- `POST /api/auth/logout`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

#### Tutors

- `GET /api/tutors` (search with filters)
- `GET /api/tutors/:id` (single tutor profile)
- `POST /api/tutors` (create/update tutor profile)
- `GET /api/tutors/:id/reviews`

#### Bookings

- `POST /api/bookings` (create booking)
- `GET /api/bookings` (list user bookings)
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id` (update status)
- `DELETE /api/bookings/:id` (cancel)

#### Reviews

- `POST /api/reviews`
- `GET /api/reviews/:tutorId`
- `PATCH /api/reviews/:id`
- `DELETE /api/reviews/:id`

#### Messages

- `GET /api/messages`
- `POST /api/messages`
- `GET /api/messages/:conversationId`

#### Admin

- `GET /api/admin/stats`
- `GET /api/admin/tutors`
- `PATCH /api/admin/tutors/:id/verify`
- `PATCH /api/admin/users/:id/suspend`

---

## 📱 UI/UX Requirements

### Design Principles

- Clean, modern, and user-friendly interface
- Mobile-first responsive design
- Fast loading times
- Accessible (WCAG 2.1 AA compliance)

### Key Pages

1. **Landing Page**

   - Hero section with search bar
   - How it works section
   - Featured tutors
   - Statistics

2. **Registration Page**

   - **Role Selection Step (First):**
     - Two clear buttons/options:
       - "I am a Tutor" (with icon and brief description)
       - "I'm Looking for a Tutor" (with icon and brief description)
     - After selection, proceed to registration form
   - Registration form (email, phone, password, etc.)
   - OTP verification step

3. **Login Page**

   - Standard login form (email/phone, password)
   - Remember that role is determined by account, not login page
   - After login, redirect based on user's role

4. **Search/Listing Page**

   - Filters sidebar
   - Tutor cards grid/list
   - Map view toggle

5. **Tutor Profile Page**

   - Profile header with photo
   - Key information sections
   - Reviews section
   - Book session CTA

6. **Dashboard Pages** (Tutor/Student/Admin)
   - Sidebar navigation
   - Content area with relevant widgets

---

## 🚀 Deployment & Hosting

### Frontend

- **Vercel** (recommended for Next.js)

  - Automatic deployments
  - CDN distribution
  - Edge functions

- Alternatives: Netlify, AWS Amplify

### Backend

- **Railway**, **Render**, or **AWS EC2**
  - API server hosting
  - Database hosting
  - Background jobs

### Database

- **Supabase**, **PlanetScale**, or **AWS RDS**
  - Managed PostgreSQL/MySQL
  - Automated backups

---

## 📦 Development Phases

### Phase 1: MVP (Minimum Viable Product)

- **Role selection during registration (mandatory step)**
- Basic tutor/student registration with role-based flows
- Tutor profile creation (for tutors only)
- Basic search and filters
- Booking system (cash payment)
- Simple reviews system
- Admin panel basics

### Phase 2: Enhancements

- Map integration
- Messaging system
- Advanced filters
- Email notifications
- Mobile responsiveness improvements

### Phase 3: Advanced Features

- Online payment integration
- SMS notifications
- Advanced analytics
- Tutor verification badges
- Recommendation engine

---

## 📊 Success Metrics

- Number of registered tutors
- Number of registered students
- Booking conversion rate
- Average tutor rating
- User retention rate
- Search-to-booking ratio

---

## 🔄 Future Enhancements (Post-Launch)

- Mobile apps (iOS/Android)
- Video call integration for online sessions
- Group session booking
- Tutor scheduling tools
- Referral program
- Subscription plans for tutors
- Live chat support
- Multilingual support (Urdu/English)

---

## 📝 Notes

- Start with web application only
- Focus on Peshawar area initially
- Gather user feedback for iterations
- Consider local payment gateways for Phase 2
- Ensure compliance with local regulations

### 🔐 Registration Flow Clarification

**Critical Requirement:** Users MUST select their role during registration:

- Registration process: **Role Selection → Registration Form → OTP Verification → Role-specific Dashboard**
- Role cannot be changed freely after registration (prevents misuse)
- Clear UI distinction between "I am a Tutor" and "I'm Looking for a Tutor" options
