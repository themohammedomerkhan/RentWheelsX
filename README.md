# 🚗 RentWheelsX – Vehicle Rental Platform

RentWheelsX is a full-stack vehicle rental platform that enables users to rent cars and bikes from nearby vehicle owners. The application provides secure authentication, vehicle management, booking, payment simulation, and an admin approval workflow.

The project is built using **Java Spring Boot** for the backend and **React + Vite** for the frontend, following a REST API architecture with JWT-based authentication and Oracle Database.

---

# 📌 Features

## 👤 User Features

- User Registration with OTP Verification
- Secure Login using JWT Authentication
- View Available Vehicles
- Search & Browse Vehicles
- Add New Vehicles
- Manage Own Vehicles
- Update Vehicle Details
- Delete Vehicles
- Activate / Deactivate Vehicle Listings
- Book Vehicles
- Payment Simulation
- View Booking History
- Owner Contact Details Revealed After Successful Payment

---

## 🛡️ Admin Features

- Secure Admin Login
- View All Registered Users
- View All Vehicles
- Approve Vehicle Listings
- Reject Vehicle Listings
- View All Bookings
- Monitor Complete Platform Activity

---

## 🔒 Security Features

- Spring Security
- JWT Authentication
- Role-Based Authorization
- Password Encryption using BCrypt
- OTP Verification
- Protected REST APIs
- CORS Configuration

---

# 🛠 Tech Stack

## Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven
- Oracle Database

---

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM

---

## Database

- Oracle Database (Oracle AI Database Free for Local Development)
- Oracle Cloud Autonomous Database (Deployment)

---

## Tools

- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git
- GitHub

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

## Clone Repository

```bash
git clone https://github.com/themohammedomerkhan/RentWheelsX.git
cd RentWheelsX
```

---

# 🚀 Backend Setup

```bash
cd rentwheelsx-backend
```

Configure your database inside:

```text
src/main/resources/application.properties
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:9000
```

---

# 💻 Frontend Setup

```bash
cd rentwheelsx-frontend
```

Install dependencies

```bash
npm install
```

Start the frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🗄 Database Configuration

This project uses **Oracle Database**.

Configure the following properties inside:

```
application.properties
```

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
```

---

# 🔑 Default Admin Account

```
Email:
admin@rentwheelsx.com

Password:
admin123
```

---

# 📡 REST APIs

The backend exposes REST APIs for:

## Authentication

- Register
- Login
- OTP Verification

## User

- User Profile
- Dashboard

## Vehicles

- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Activate Vehicle
- Deactivate Vehicle
- View Vehicles

## Booking

- Book Vehicle
- Payment
- Booking History

## Admin

- Approve Vehicle
- Reject Vehicle
- View Users
- View Vehicles
- View Bookings

---

# 🔄 Application Workflow

```text
User Registration
        │
        ▼
OTP Verification
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
Payment
        │
        ▼
Booking Completed
```

---

# 📸 Screenshots

Screenshots will be added after deployment.

- Home Page
- Login Page
- Dashboard
- Vehicle Listing
- Booking Page
- Payment Page
- Admin Dashboard

---

# 🚀 Future Enhancements

- Real Payment Gateway Integration
- Email OTP using Gmail SMTP
- Cloud Image Upload
- Google Maps Integration
- Vehicle Availability Calendar
- Reviews & Ratings
- Wishlist
- Notifications
- Mobile Responsive Improvements
- Docker Deployment
- Microservices Architecture

---

# 🧪 Testing

The application has been tested using:

- Postman
- Oracle Database
- React Frontend
- Spring Boot REST APIs

---

# 🌐 Deployment

Deployment will be added soon.

Frontend:
- Vercel

Backend:
- Render

Database:
- Oracle Cloud Always Free

---

# 👨‍💻 Author

**Mohammed Omer Khan**

- GitHub: https://github.com/themohammedomerkhan
- LinkedIn: https://www.linkedin.com/in/mohammed-omer-khan-workco/

---

# 📄 License

This project is licensed under the MIT License.