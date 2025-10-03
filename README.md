# KaoJob - Senior Job Marketplace Website

A complete, functional website for connecting employers with experienced senior workers. KaoJob provides a platform for posting jobs specifically targeted at skilled seniors with **full login authentication system**.

## 🚀 **DEMO LOGIN CREDENTIALS**

### For Testing the Website:

**Employer Account:**
- Email: `employer@kaojob.com`
- Password: `demo123`
- Access: Employer dashboard with job management features

**Job Seeker Account:**
- Email: `jobseeker@kaojob.com`  
- Password: `demo123`
- Access: Job seeker dashboard with application tracking

## Features

### 🔐 **Authentication System** (`login.html`)
- **Demo login functionality** with session management
- Two user types: Employers and Job Seekers
- Persistent login sessions with localStorage
- Automatic redirection to appropriate dashboards
- **One-click demo login** buttons for easy testing

### 👔 **Employer Dashboard** (`dashboard-employer.html`)
- Job posting management and analytics
- Application tracking and candidate reviews
- Quick stats: Active jobs, applications, profile views
- Interview scheduling interface
- Direct access to job posting form

### 👥 **Job Seeker Dashboard** (`dashboard-jobseeker.html`)
- Profile completion tracking (75% complete indicator)
- Application history and status tracking
- Recommended jobs based on profile
- Interview scheduling and notifications
- Saved jobs functionality with favorites

### 🏠 **Home Page** (`index.html`)
- Hero section with compelling messaging
- Features showcase explaining platform benefits
- **Dynamic navigation** - shows Login/Register for guests or Dashboard/Logout for logged-in users
- Call-to-action buttons linking to job posting
- Mobile-responsive navigation menu

### 👥 **Contact Page** (`contact.html`)
- Contact information with phone, email, and LINE details
- **Working contact form** with validation and submission feedback
- QR code for LINE Official Account
- Form submission success notifications

### 📋 **Jobs Page** (`jobs.html`)
- Job listings with **real-time search functionality**
- Job status indicators (Active/Closed)
- **Functional Edit and Delete** buttons for job management
- Responsive job cards with detailed information
- Search filters listings dynamically

### ✍️ **Post Job Page** (`post-job.html`)
- **Complete job posting form** with validation
- Form submission handling with success feedback
- Work type selection (Full-time, Part-time, Freelance, Volunteer)
- Success notifications and form reset

### 🔐 **Register Page** (`register.html`)
- User registration form for employers and job seekers
- **Complete form validation** with required fields
- User type selection (Employer/Job Seeker)
- Terms of service acceptance
- Success notifications

## 🔧 **Technical Implementation**

### ✅ **Authentication Features**
- **Session Management**: Uses localStorage for persistent sessions
- **Role-based Access**: Different dashboards for employers vs job seekers
- **Auto-redirect**: Logged-in users redirected to appropriate dashboard
- **Demo Accounts**: Pre-configured test accounts for immediate testing
- **Logout Functionality**: Clear sessions and redirect to home

### ✅ **Interactive Elements**
- **Real-time Search**: Filter jobs as you type
- **Form Validation**: All forms validate input with visual feedback  
- **Dynamic Navigation**: Shows different options based on login status
- **Mobile Menu**: Responsive hamburger menu
- **Confirmation Dialogs**: For destructive actions like job deletion
- **Success Notifications**: Toast messages for user actions

### ✅ **Dashboard Features**
- **Employer Dashboard**: Job management, applications, analytics
- **Job Seeker Dashboard**: Applications, recommended jobs, profile completion
- **Quick Stats**: Real job numbers and metrics
- **Action Buttons**: Direct links to relevant features
- **Status Tracking**: Application and job status indicators

## 🚀 **How to Run for Demo**

### Quick Start (Recommended):
1. **Download/Extract** the KaoJob files
2. **Navigate** to the `site/` directory
3. **Start local server**:
   ```bash
   cd site/
   python3 -m http.server 8080
   ```
4. **Open browser**: Go to `http://localhost:8080`
5. **Login with demo accounts**:
   - Employer: `employer@kaojob.com` / `demo123`
   - Job Seeker: `jobseeker@kaojob.com` / `demo123`

### Alternative Servers:
```bash
# Python 2
python -m SimpleHTTPServer 8080

# Node.js
npx http-server -p 8080

# PHP
php -S localhost:8080
```

## 📁 **Complete File Structure**

```
site/
├── index.html                 # Home page with dynamic auth nav
├── login.html                 # Login page with demo accounts
├── contact.html               # Contact page with working form
├── jobs.html                  # Job listings with search
├── post-job.html             # Job posting form
├── register.html             # Registration with validation
├── dashboard-employer.html    # Employer dashboard
├── dashboard-jobseeker.html   # Job seeker dashboard
├── styles.css                 # Custom styles (using Tailwind CDN)
├── README.md                  # This documentation
└── assets/                    # Image assets
    ├── contact-screen.png
    ├── home-screen.png
    ├── jobs-screen.png
    ├── postjob-screen.png
    └── register-screen.png
```

## 🧪 **Demo Flow Testing**

### Test as Employer:
1. Go to `http://localhost:8080`
2. Click "Login" → Use demo employer account
3. **Explore Employer Dashboard**: View job stats, applications
4. **Post a Job**: Use "Post New Job" button
5. **Manage Jobs**: Go to Jobs page, edit/delete listings
6. **Logout**: Test logout functionality

### Test as Job Seeker:
1. **Login** with job seeker demo account
2. **Explore Job Seeker Dashboard**: View profile, applications
3. **Browse Jobs**: Use search functionality
4. **Save Jobs**: Test favorites functionality
5. **Contact**: Submit contact form
6. **Logout and Navigate**: Test all navigation

## 🔧 **Key Interactive Features**

1. **🔐 Authentication**: Complete login/logout system with demo accounts
2. **📱 Responsive Design**: Works perfectly on mobile and desktop  
3. **🔍 Real-time Search**: Type in jobs page search box
4. **📝 Working Forms**: All forms validate and show success messages
5. **🚪 Dynamic Navigation**: Changes based on login status
6. **📊 Dashboard Analytics**: Mock job statistics and data
7. **💾 Session Persistence**: Stay logged in between visits
8. **🎯 Role-based Access**: Different experiences for employers vs job seekers

## 🌐 **Production Deployment Ready**

- ✅ **No Backend Required**: Fully functional frontend
- ✅ **Static File Hosting**: Can be deployed to any web server
- ✅ **CDN Assets**: Uses Tailwind CSS and Google Fonts from CDN
- ✅ **Mobile Optimized**: Responsive design for all devices
- ✅ **Demo Data**: Pre-populated with realistic demo content
- ✅ **Cross-browser Compatible**: Works on all modern browsers

## 📋 **Demo Checklist**

- [x] Login system with demo accounts
- [x] Employer and Job Seeker dashboards
- [x] Job posting and management
- [x] Search and filtering
- [x] Form submissions with validation
- [x] Mobile responsive design
- [x] Dynamic navigation based on login status
- [x] Session management and logout
- [x] Contact form functionality
- [x] User registration flow

**Perfect for demos, prototypes, or as a foundation for a full application!**

## 🐳 Run with Docker (production-like)

This repository now includes a minimal Node/Express API and Postgres database to persist users and jobs.

Start the app with Docker Compose (builds server image and starts Postgres):

1. Install Docker and Docker Compose on your machine.
2. From the project root run:

```bash
docker compose up --build
```

The server will be available at http://localhost:3000 and Postgres on 5432.

To apply migrations locally without Docker you can run:

```bash
npm install
node server/migrate.js
```

Notes:
- Default DB credentials in docker-compose: postgres/postgres and database name `kaojob`.
- Use `.env` to override `DATABASE_URL` and `JWT_SECRET` when running in production.


---

**KaoJob** - Connecting experienced professionals with meaningful opportunities through modern web technology.
