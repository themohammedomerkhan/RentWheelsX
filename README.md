# 🚗 RentWheelsX – Vehicle Rental Platform

RentWheelsX is a full-stack vehicle rental platform that enables users to rent cars and bikes from nearby vehicle owners. The application provides secure authentication, vehicle management, booking, payment simulation, and an admin approval workflow.

The project is built using **Java Spring Boot** for the backend and **React + Vite** for the frontend, following a REST API architecture with JWT-based authentication and PostgreSQL database hosted on Neon.

---

# 📌 Features

## 👤 User Features

* User Registration with Email OTP Verification
* Resend OTP
* Secure Login using JWT Authentication
* Forgot Password
* Password Reset using Email OTP
* View Available Vehicles
* Search & Browse Vehicles
* Add New Vehicles
* Manage Own Vehicles
* Update Vehicle Details
* Delete Vehicles
* Activate / Deactivate Vehicle Listings
* Book Vehicles
* Payment Simulation
* View Booking History
* Owner Contact Details Revealed After Successful Payment

---

## 🛡️ Admin Features

* Secure Admin Login
* View All Registered Users
* View All Vehicles
* Approve Vehicle Listings
* Reject Vehicle Listings
* View All Bookings
* Monitor Complete Platform Activity

---

## 🔒 Security Features

* Spring Security
* JWT Authentication
* Role-Based Authorization
* Password Encryption using BCrypt
* Email OTP Verification
* Password Reset using OTP
* Protected REST APIs
* CORS Configuration

---

# 🛠 Tech Stack

## Backend

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT Authentication
* Maven
* PostgreSQL

---

## Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM

---

## Database

* PostgreSQL
* Neon PostgreSQL

---

## Email

* Gmail SMTP
* HTML Email Templates
* OTP Verification
* Password Reset OTP

---

## Tools

* IntelliJ IDEA
* Visual Studio Code
* Postman
* Git
* GitHub

---

# 📂 Project Structure

```text
RentWheelsX
│
├── rentwheelsx-backend
│   ├── src
│   ├── pom.xml
│   └── application.properties.example
│
├── rentwheelsx-frontend
│   ├── src
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/themohammedomerkhan/RentWheelsX.git
cd RentWheelsX
```

### 🚀 Backend Setup

```bash
cd rentwheelsx-backend
```

Configure your database and email credentials inside:
`src/main/resources/application.properties`

Use `application.properties.example` as a reference.

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs on:
`http://localhost:9000`

---

### 💻 Frontend Setup

```bash
cd rentwheelsx-frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:
`http://localhost:5173`

---

# 🗄 Database Configuration

This project uses PostgreSQL hosted on Neon.

Configure the following properties inside `application.properties`:

```properties
spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver
```

Hibernate automatically creates and updates the required database tables using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

> **Note:** Never commit your real database credentials, Gmail App Password, or JWT secret to GitHub.

---

# 📧 Email Configuration

RentWheelsX uses Gmail SMTP for sending OTP emails.

The application supports:
* Email verification OTP
* Resend OTP
* Forgot password OTP
* Password reset verification

Configure inside `application.properties`:

```properties
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
```

Use a Gmail App Password instead of your regular Gmail password.

---

# 🔑 Default Admin Account

* **Email:** `admin@rentwheelsx.com`
* **Password:** `admin123`

*For production deployment, use a secure admin password and do not expose credentials publicly.*

---

# 📡 REST APIs

The backend exposes REST APIs for:

* **Authentication:** Register, Login, Email OTP Verification, Resend OTP, Forgot Password, Verify Password Reset OTP, Reset Password
* **User:** User Profile, Dashboard, KYC Submission
* **Vehicles:** Add, Update, Delete, Activate, Deactivate, View Vehicles, View Own Vehicles
* **Booking:** Book Vehicle, Payment Simulation, Cancel Booking, Booking History
* **Admin:** Approve/Reject Vehicle, View Users, View Vehicles, View Bookings

---

# 🔄 Application Workflow

```text
User Registration
       │
       ▼
Email OTP Verification
       │
       ▼
User Login
       │
       ▼
JWT Authentication
       │
       ▼
Dashboard
       │
       ▼
Browse Vehicles
       │
       ▼
Add Vehicle
       │
       ▼
Admin Approval
       │
       ▼
Vehicle Available for Booking
       │
       ▼
Booking
       │
       ▼
Payment Simulation
       │
       ▼
Booking Completed
```

---

# 🔐 Password Reset Workflow

```text
Forgot Password
       │
       ▼
Enter Registered Email
       │
       ▼
Password Reset OTP Sent
       │
       ▼
Verify OTP
       │
       ▼
Enter New Password
       │
       ▼
Password Updated
       │
       ▼
Login with New Password
```

---

# 📸 Screenshots

Screenshots will be added after deployment.

Planned screenshots:
* Home Page
* Login Page
* Signup Page
* OTP Verification
* Dashboard
* Vehicle Listing
* Vehicle Booking
* Payment Page
* Admin Dashboard

---

# 🧪 Testing

The application has been tested using Postman, Neon PostgreSQL, React Frontend, and Spring Boot REST APIs.

Major workflows tested:
* User Registration & Email OTP Verification
* User Login & JWT Auth
* Forgot Password & Password Reset
* Vehicle Management & Admin Approval
* Vehicle Booking & Payment Simulation
* Admin Operations

---

# 🚀 Deployment

The application will be deployed using:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Neon PostgreSQL

**Live Demo:** Coming Soon

---

# 🚀 Future Enhancements

* Real Payment Gateway Integration
* Google Maps Integration
* Vehicle Availability Calendar
* Reviews & Ratings
* Wishlist
* Notifications
* Microservices Architecture

---

# 👨‍💻 Author

**Mohammed Omer Khan**
* **GitHub:** [https://github.com/themohammedomerkhan](https://github.com/themohammedomerkhan)
* **LinkedIn:** [https://www.linkedin.com/in/mohammed-omer-khan-workco/](https://www.linkedin.com/in/mohammed-omer-khan-workco/)

---

# 📄 License

This project is licensed under the MIT License.
