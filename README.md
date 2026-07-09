# TrackWise 🚀

> A production-ready SaaS Job Application & Interview Tracker built for serious job seekers.

![TrackWise Dashboard](https://via.placeholder.com/1200x600?text=TrackWise+Dashboard)

---

## Problem Statement

Job seekers lose track of applications across spreadsheets, sticky notes, and memory. TrackWise centralizes every application, interview, follow-up, and offer into one clean, intelligent dashboard — so you can focus on landing the job, not managing the chaos.

---

## Features

### Authentication
- Register / Login / Logout
- JWT via HTTP-only cookies
- Protected routes with auto-redirect

### Dashboard
- Total, Active, Interview, Offer, Rejected, Follow-up stats
- Animated stat counters
- Upcoming interviews list
- Follow-ups due with overdue indicators
- Recent applications
- Pipeline overview with progress bars
- Quick actions

### Application Management
- Full CRUD (Create, Read, Update, Delete)
- Archive & Restore (soft delete)
- 15 fields: company, role, location, salary, job URL, platform, recruiter, dates, status, priority, resume version, notes
- Inline status update from table
- Prefetch on hover for instant detail page loads

### Search, Filter & Sort
- Full-text search (company, role, recruiter) with debounce
- Filter by status, priority, platform
- Sort by newest, oldest, alphabetical, upcoming interview
- Pagination with result count

### Analytics
- Applications per month (bar chart)
- Status distribution (donut chart)
- Platform distribution (horizontal bar chart)
- Offer rate & interview rate metrics

### Settings
- Profile update
- Light / Dark / System theme
- CSV export of all applications

---

## Architecture

```
trackwise/
├── backend/          → Node.js + Express + MongoDB
└── frontend/         → Next.js 14 App Router + TypeScript
```

### Backend Architecture
```
Request → Route → Validation → Controller → Service → Repository → Model
                                                ↓
                                         Global Error Handler
```

### Frontend Architecture
```
Page → Custom Hook (TanStack Query) → Service → API Client (axios)
                                          ↓
                                    Zustand Auth Store
```

---

## Folder Structure

### Backend
```
backend/src/
├── config/           → env, database, express app
├── constants/        → status enums, HTTP codes
├── features/
│   ├── auth/         → controller, service, repository, validation, routes
│   ├── applications/ → controller, service, repository, validation, routes
│   ├── dashboard/    → controller, service, routes
│   └── analytics/    → controller, service, routes
├── middleware/       → auth, validate, errorHandler, notFound
├── models/           → User, Application (Mongoose)
├── types/            → TypeScript interfaces
└── utils/            → AppError, catchAsync, sendResponse, jwt, cookie, pagination
```

### Frontend
```
frontend/src/
├── app/
│   ├── (auth)/       → login, register
│   └── (dashboard)/  → dashboard, applications/[id], analytics, settings
├── components/
│   ├── ui/           → button, input, card, dialog, select, badge, toast...
│   ├── shared/       → StatusBadge, EmptyState, ErrorState, Pagination, Skeletons...
│   ├── layout/       → DashboardSidebar, DashboardHeader
│   ├── dashboard/    → StatCard, UpcomingInterviews, RecentApplications...
│   └── applications/ → ApplicationForm, ApplicationsTable, FiltersBar...
├── hooks/            → useApplications, useDashboard, useAnalytics, useDebounce...
├── services/         → auth, applications, dashboard API wrappers
├── store/            → Zustand auth store
├── types/            → TypeScript interfaces
├── constants/        → status enums, routes, query keys
└── utils/            → date, error helpers
```

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/trackwise.git
cd trackwise
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Fill in your .env values
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
cp .env.local.example .env.local
# Fill in your .env.local values
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:5000`

---

## Environment Variables

### Backend `.env`
| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your_secret_here` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `JWT_COOKIE_EXPIRES_IN` | Cookie expiry in days | `7` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend `.env.local`
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## API Documentation

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | ❌ | Register new user |
| POST | `/api/v1/auth/login` | ❌ | Login |
| POST | `/api/v1/auth/logout` | ✅ | Logout |
| GET | `/api/v1/auth/me` | ✅ | Get current user |
| PATCH | `/api/v1/auth/me` | ✅ | Update profile |

### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/applications` | ✅ | List with filters/search/sort/pagination |
| POST | `/api/v1/applications` | ✅ | Create application |
| GET | `/api/v1/applications/:id` | ✅ | Get single application |
| PATCH | `/api/v1/applications/:id` | ✅ | Update application |
| DELETE | `/api/v1/applications/:id` | ✅ | Delete application |
| PATCH | `/api/v1/applications/:id/archive` | ✅ | Archive |
| PATCH | `/api/v1/applications/:id/restore` | ✅ | Restore |

### Dashboard & Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/dashboard` | ✅ | Dashboard stats + recent data |
| GET | `/api/v1/analytics` | ✅ | Charts data |

### Query Parameters (GET /applications)
| Param | Type | Description |
|---|---|---|
| `search` | string | Full-text search |
| `status` | string | Filter by status |
| `priority` | string | Filter by priority |
| `platform` | string | Filter by platform |
| `isArchived` | boolean | Show archived |
| `page` | number | Page number |
| `limit` | number | Results per page (max 100) |
| `sortBy` | string | Field to sort by |
| `sortOrder` | asc/desc | Sort direction |

---

## Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1`
5. Deploy

### Backend → Render

1. Push code to GitHub
2. Create new **Web Service** in [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables from `.env.production.example`
7. Deploy

### MongoDB Atlas
1. Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist `0.0.0.0/0` for Render (or use Render's static IPs)
4. Copy connection string to `MONGO_URI`

---

## Testing Checklist

### Authentication
- [ ] Register with valid data creates account and redirects to dashboard
- [ ] Register with existing email shows conflict error
- [ ] Register with weak password shows validation error
- [ ] Login with correct credentials works
- [ ] Login with wrong password shows error
- [ ] Logout clears session and redirects to login
- [ ] Accessing `/dashboard` without auth redirects to `/login`
- [ ] Accessing `/login` while authenticated redirects to `/dashboard`

### Applications
- [ ] Create application with required fields only
- [ ] Create application with all fields
- [ ] Validation errors shown for invalid URLs and emails
- [ ] Edit application updates all fields correctly
- [ ] Delete application removes it from list
- [ ] Archive hides from active list
- [ ] Restore brings back from archived list
- [ ] Inline status change updates without opening form
- [ ] Pagination works correctly
- [ ] Search filters results in real time (debounced)
- [ ] Status filter works
- [ ] Priority filter works
- [ ] Platform filter works
- [ ] Sort by newest/oldest/alphabetical/interview works
- [ ] Clear filters resets all filters

### Dashboard
- [ ] Stats reflect correct counts
- [ ] Upcoming interviews show future interviews sorted by date
- [ ] Follow-ups due show overdue items
- [ ] Recent applications show 5 most recent
- [ ] Pipeline overview percentages add up correctly
- [ ] Quick actions navigate to correct pages

### Analytics
- [ ] Monthly chart shows correct data
- [ ] Status distribution pie chart renders
- [ ] Platform chart renders
- [ ] Offer rate and interview rate calculated correctly
- [ ] Empty state shown when no data

### Settings
- [ ] Profile name and email update correctly
- [ ] Theme toggle switches light/dark/system
- [ ] CSV export downloads file with correct data

### UI/UX
- [ ] Dark mode works across all pages
- [ ] Mobile sidebar opens and closes
- [ ] All loading skeletons shown during data fetch
- [ ] Empty states shown when no data
- [ ] Error states shown with retry button on API failure
- [ ] Toast notifications appear for all actions
- [ ] Animated counters play on dashboard load
- [ ] Hover on table row prefetches detail page

---

## Future Improvements

### Short Term
- [ ] Email notifications for follow-up reminders
- [ ] Kanban board view for applications
- [ ] Bulk actions (bulk delete, bulk status change)
- [ ] Application tags/labels
- [ ] Interview notes with rich text editor

### Medium Term
- [ ] OAuth (Google, GitHub login)
- [ ] File attachments for resumes and cover letters
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Browser extension to save jobs from LinkedIn/Indeed
- [ ] AI-powered application insights

### Long Term
- [ ] Team/recruiter collaboration mode
- [ ] Job market analytics (salary benchmarks, demand trends)
- [ ] Resume builder integration
- [ ] Interview preparation AI coach
- [ ] Mobile app (React Native)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| State | TanStack Query, Zustand |
| Forms | React Hook Form, Zod |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, HTTP-only cookies |
| Deployment | Vercel (frontend), Render (backend) |

---

## License

MIT © TrackWise
