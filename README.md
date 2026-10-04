# 🧪 ReZone Patholab

### Smart Digital Pathology & Laboratory Management Platform

ReZone Patholab is a modern digital pathology laboratory management platform designed to simplify the complete diagnostic workflow — from **patient registration and test booking to sample collection and doctor-approved laboratory reports**.

The platform provides dedicated workflows for **Patients, Sample Collectors, and Doctors**, allowing each role to access only the operations relevant to them.

Built with a modern React-based frontend and Supabase backend, ReZone Patholab focuses on creating a reliable, responsive, and role-aware digital experience for pathology laboratories.

---

## 🌐 Project Overview

Traditional pathology workflows often involve manual registration, physical records, phone-based communication, and disconnected sample-tracking processes.

ReZone Patholab brings these activities into a centralized digital platform.

### Core Workflow

```text
                    ┌─────────────────┐
                    │     PATIENT     │
                    └────────┬────────┘
                             │
                             │ Book Test
                             ▼
                    ┌─────────────────┐
                    │     BOOKING     │
                    └────────┬────────┘
                             │
                             │ Sample Ready
                             ▼
                    ┌─────────────────┐
                    │    COLLECTOR    │
                    └────────┬────────┘
                             │
                             │ Collect Sample
                             ▼
                    ┌─────────────────┐
                    │    COLLECTED    │
                    └────────┬────────┘
                             │
                             │ Medical Review
                             ▼
                    ┌─────────────────┐
                    │     DOCTOR      │
                    └────────┬────────┘
                             │
                             │ Approve Report
                             ▼
                    ┌─────────────────┐
                    │     REPORT      │
                    │    APPROVED     │
                    └─────────────────┘
```

---

# ✨ Key Features

## 👤 Patient Portal

Patients can use the platform to manage their diagnostic bookings and track their laboratory workflow.

### Patient capabilities

- Create an account using email, phone number, and password
- Secure authentication through Supabase Auth
- Patient profile management
- Browse available diagnostic packages
- Book pathology tests
- View booking information
- Track sample status
- View approved laboratory results
- View doctor remarks associated with reports
- Access previous bookings and diagnostic information

---

## 🧑‍🔬 Sample Collector Workflow

The collector interface is designed to manage the sample collection stage of the laboratory workflow.

### Collector capabilities

- View laboratory bookings requiring collection
- Access patient and booking information
- Identify samples using specimen IDs
- Mark booked samples as **Collected**
- Record the collection timestamp
- Track samples that are awaiting collection
- Work with the same centralized booking database used by the laboratory

### Sample lifecycle

```text
BOOKED
   │
   ▼
COLLECTED
   │
   ▼
APPROVED
```

This creates a clear state transition between patient booking, physical sample collection, and medical approval.

---

## 👨‍⚕️ Doctor Dashboard

Doctors have elevated privileges for reviewing and approving diagnostic reports.

### Doctor capabilities

- View laboratory bookings
- Access patient profiles
- Review collected samples
- Enter diagnostic result values
- Add medical remarks
- Approve laboratory reports
- Manage eligible staff roles
- Review the status of laboratory workflows

Only authorized doctor accounts can approve reports.

---

# 🔐 Authentication & Role-Based Access Control

ReZone Patholab uses **Supabase Authentication** together with database-level role management.

The application supports three primary roles:

| Role | Main Responsibility |
|---|---|
| 👤 Patient | Book tests and view personal results |
| 🧑‍🔬 Collector | Manage sample collection |
| 👨‍⚕️ Doctor | Review and approve reports |

New accounts are created as **patients by default**.

Doctor and collector privileges are assigned separately through controlled database operations rather than trusting role information supplied directly by the browser.

This helps prevent users from simply modifying frontend data to gain elevated permissions.

---

# 🛡️ Database Security

The project uses **Supabase Row Level Security (RLS)** to control access to application data.

### Patient access

Patients can:

- Read their own profile
- Create their own bookings
- Read their own bookings

### Collector access

Collectors can:

- Read laboratory bookings
- Update sample status through the authorized database function

### Doctor access

Doctors can:

- Read patient profiles
- Read laboratory bookings
- Approve collected reports
- Manage eligible staff roles

Database operations such as sample collection and report approval are performed through controlled PostgreSQL functions.

This keeps important state transitions on the database side instead of relying only on frontend authorization.

---

# 🗄️ Database Architecture

The core database consists of two primary application tables.

## `profiles`

Stores authenticated user information and application roles.

```text
profiles
├── id
├── name
├── email
├── phone
├── role
└── created_at
```

Supported roles:

```text
patient
collector
doctor
```

---

## `bookings`

Stores pathology test bookings and their lifecycle.

```text
bookings
├── id
├── specimen_id
├── user_id
├── patient_name
├── age
├── gender
├── mobile
├── package_name
├── total_price
├── status
├── created_at
├── collected_at
├── approved_at
├── result_values
└── remarks
```

Booking states:

```text
booked → collected → approved
```

---

# ⚙️ Database Functions

ReZone Patholab uses PostgreSQL functions for sensitive operations.

### `my_role()`

Returns the authenticated user's application role.

### `approve_collection()`

Allows authorized laboratory staff to transition a booking from:

```text
booked → collected
```

### `approve_report()`

Allows doctors to transition a booking from:

```text
collected → approved
```

while storing:

- Result values
- Doctor remarks
- Approval timestamp

### `set_role()`

Allows an authorized doctor to manage eligible staff roles.

### `login_email()`

Converts a registered phone number into the corresponding account email, enabling the application's phone-number login workflow while continuing to use Supabase email/password authentication.

---

# 🔄 Complete Application Workflow

## 1. Patient Registration

```text
Patient
   ↓
Registration
   ↓
Supabase Authentication
   ↓
Profile Created
   ↓
Default Role = Patient
```

---

## 2. Test Booking

```text
Patient
   ↓
Select Package
   ↓
Enter Patient Information
   ↓
Create Booking
   ↓
Booking Status = BOOKED
```

---

## 3. Sample Collection

```text
Collector Dashboard
   ↓
View Booked Samples
   ↓
Identify Specimen
   ↓
Collect Sample
   ↓
Booking Status = COLLECTED
```

---

## 4. Medical Review

```text
Doctor Dashboard
   ↓
View Collected Samples
   ↓
Enter Results
   ↓
Add Remarks
   ↓
Approve Report
   ↓
Booking Status = APPROVED
```

---

## 5. Patient Result Access

```text
Patient
   ↓
View Booking
   ↓
Approved Report
   ↓
View Result Values
   ↓
Read Doctor Remarks
```

---

# 🏗️ Technology Stack

## Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React**
- **Motion**

## Backend & Database

- **Supabase**
- **PostgreSQL**
- **Supabase Authentication**
- **Row Level Security (RLS)**
- **PostgreSQL Functions**
- **Supabase Realtime**

## Additional Technologies

- **Express.js**
- **Google GenAI**
- **dotenv**
- **ESBuild**

The repository's package configuration confirms the core React/Vite/Tailwind/Lucide/Motion stack and the additional Express, dotenv, and Google GenAI dependencies.

---

# 📁 Project Structure

A simplified project structure looks like this:

```text
Rezone-Patholab/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── services/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

> The exact component/page organization may evolve as the application grows.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- A Supabase account
- A Supabase project

---

## 1. Clone the Repository

```bash
git clone https://github.com/abhi940927/Rezone-Patholab.git
```

Navigate into the project:

```bash
cd Rezone-Patholab
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

Add your Supabase project credentials to the environment file.

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Important

Never commit your real credentials, service-role keys, passwords, or private API keys to GitHub.

---

# 🗄️ Supabase Database Setup

Create a Supabase project and open:

```text
Supabase Dashboard
      ↓
SQL Editor
      ↓
New Query
```

Run the project's database schema.

The schema creates the required:

- `profiles` table
- `bookings` table
- Authentication trigger
- Role management functions
- Sample collection function
- Report approval function
- Phone-based login lookup
- Row Level Security policies
- Realtime configuration

---

# 👨‍⚕️ Creating the Doctor Account

New registrations are intentionally created with the default role:

```text
patient
```

To create the initial doctor account:

### Step 1

Register normally using the application with the doctor's:

- Name
- Email
- Phone number
- Password

### Step 2

Open the Supabase SQL Editor.

### Step 3

Update the registered profile:

```sql
UPDATE public.profiles
SET role = 'doctor'
WHERE phone = '9XXXXXXXXX';
```

Replace the phone number with the doctor's registered 10-digit phone number.

Verify:

```sql
SELECT name, email, phone, role
FROM public.profiles
WHERE phone = '9XXXXXXXXX';
```

The role should be:

```text
doctor
```

The doctor can then access:

```text
/doctor
```

---

# 🧑‍🔬 Creating a Collector Account

A collector can first register normally.

The new account will initially have:

```text
role = patient
```

An authorized doctor can then assign the collector role through the application's staff-management workflow.

The database prevents arbitrary role assignment from the public client.

---

# 💻 Run the Application

Start the development server:

```bash
npm run dev
```

The project's Vite configuration runs the development server on port `3000`.

Open:

```text
http://localhost:3000
```

---

# 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript checking |
| `npm run clean` | Remove generated build/server files |

These scripts are defined in the repository's current `package.json`.

---

# 🔒 Security Considerations

ReZone Patholab is designed around several security principles:

### Authentication

User authentication is handled through Supabase Auth rather than custom password storage.

### Authorization

Application roles are stored in the database and checked server-side through PostgreSQL functions and RLS policies.

### Row Level Security

Database access is restricted based on the authenticated user's identity and role.

### Controlled State Transitions

Important workflow transitions are not exposed as unrestricted client-side updates.

For example:

```text
BOOKED
   ↓
approve_collection()
   ↓
COLLECTED
   ↓
approve_report()
   ↓
APPROVED
```

### Credential Protection

Environment variables are used for project configuration and secrets rather than hard-coding credentials into source code.

---

# 🎨 UI & User Experience

The application is designed with a modern healthcare-oriented interface focusing on:

- Clean dashboard layouts
- Responsive design
- Clear status indicators
- Role-specific navigation
- Accessible form interactions
- Reusable React components
- Responsive cards and data views
- Clear booking and sample statuses
- Minimal-friction patient workflows

The project uses Tailwind CSS for utility-based styling and Lucide React for interface icons.

---

# 📊 System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   TypeScript/Vite   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Application Logic   │
                    │ Components / Pages  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Supabase       │
                    │                     │
                    │  Authentication     │
                    │  PostgreSQL         │
                    │  RLS                │
                    │  Functions          │
                    │  Realtime           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   PostgreSQL DB     │
                    │                     │
                    │    profiles         │
                    │    bookings         │
                    └─────────────────────┘
```

---

# 🧠 Design Principles

The project follows several software engineering principles:

### Separation of Responsibilities

Patients, collectors, and doctors have different responsibilities and interfaces.

### Database-Level Authorization

Security-sensitive operations are enforced at the database layer instead of trusting only frontend checks.

### State-Based Workflow

Laboratory bookings move through clearly defined states:

```text
BOOKED → COLLECTED → APPROVED
```

### Reusable Components

The React frontend is organized around reusable UI and application components.

### Environment-Based Configuration

Deployment-specific configuration is kept outside the application source code.

---

# 🚧 Current Limitations

ReZone Patholab is currently a project implementation/prototype and should not be treated as a certified clinical laboratory information system.

Potential production requirements include:

- Comprehensive audit logging
- Stronger healthcare compliance controls
- Formal medical data retention policies
- Automated backups and disaster recovery
- Comprehensive automated testing
- Advanced report generation
- Digital signatures
- Payment gateway integration
- Notification services
- Production monitoring
- Infrastructure hardening
- Formal security audits
- Regulatory compliance appropriate to the deployment environment

---

# 🔮 Future Enhancements

Planned or possible improvements include:

- 📄 Automated PDF laboratory reports
- 📧 Email/SMS report notifications
- 🔔 Real-time patient notifications
- 💳 Online payment integration
- 📱 Dedicated mobile experience
- 🧾 Digital invoices
- 📊 Laboratory analytics dashboard
- 📈 Test and revenue analytics
- 🧪 Expanded test catalog management
- 🏷️ Barcode/QR-based specimen tracking
- 🗂️ Advanced patient medical history
- 🔍 Advanced booking and patient search
- 📝 Audit logs for sensitive operations
- ☁️ Production-grade deployment architecture
- 🛡️ Enhanced security and compliance controls

---

# 🧪 Testing the Main Workflow

For a complete local test, use three test accounts:

### Patient

```text
Register
   ↓
Login
   ↓
Book a test
   ↓
Check booking status
```

### Collector

```text
Login
   ↓
Open collector dashboard
   ↓
Find booked specimen
   ↓
Approve collection
   ↓
Status becomes COLLECTED
```

### Doctor

```text
Login
   ↓
Open doctor dashboard
   ↓
Review collected specimen
   ↓
Enter results
   ↓
Add remarks
   ↓
Approve report
```

### Patient

```text
Login again
   ↓
Open booking
   ↓
View approved report
```

This verifies the complete end-to-end workflow.

---

# 🤝 Contributing

Contributions are welcome.

### Fork the repository

```bash
git fork
```

Or fork it directly from GitHub.

### Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/Rezone-Patholab.git
```

### Create a feature branch

```bash
git checkout -b feature/your-feature
```

### Make your changes

Test the application locally before committing.

### Commit

```bash
git add .
git commit -m "feat: add your feature"
```

### Push

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 🐛 Bug Reports & Feature Requests

If you discover a bug or have an improvement idea, please open a GitHub Issue with:

- Clear issue title
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots where applicable
- Relevant console/database errors

---

# 📌 Project Status

**Status:** 🚧 Active Development

ReZone Patholab is being developed as a modern digital pathology laboratory management platform with an emphasis on:

> **Secure authentication · Role-based workflows · Sample tracking · Digital reporting · Modern healthcare UX**

---

# 📄 License

This project is currently intended for educational, portfolio, and development purposes.

If you plan to deploy ReZone Patholab commercially, add an appropriate open-source or proprietary license before distribution.

---

# 👨‍💻 Author

**Abhinav Singh**

Computer Science & Engineering Student  
Full-Stack Development | React | TypeScript | Supabase

### Project Repository

[ReZone Patholab on GitHub](https://github.com/abhi940927/Rezone-Patholab?utm_source=chatgpt.com)

---

## ⭐ Support the Project

If you find ReZone Patholab useful or interesting:

⭐ Star the repository  
🍴 Fork the project  
🐛 Report bugs  
💡 Suggest improvements  
🤝 Contribute

---

### ReZone Patholab

**A smarter digital workflow for modern pathology laboratories.**
