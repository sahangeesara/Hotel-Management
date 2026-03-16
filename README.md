---

# 🏨 Hotel Management System

This project is a **Full Stack Hotel Management System** developed as a **Final Year Campus Project**.
The system manages hotel operations such as room bookings, event management, employee management, customer management, and package services.

The backend is built with **Laravel REST API**, while the frontend is developed using **Angular**.
Authentication and authorization are secured using **JWT (JSON Web Token)**.

---

## 🚀 Features

### 🔐 Authentication

* JWT Login / Logout
* Role-based access control
* Secure API endpoints

### 🏨 Hotel Management

* Hotel information management
* Room setup and room categories
* Room booking system

### 📅 Event Management

* Event types
* Event bookings
* Hotel events
* Restaurant events

### 👥 User & Employee Management

* User management
* Employee types
* Role management
* Customer management

### ✈️ Travel & Package Services

* Tour packages
* Transport bookings
* Flight bookings
* Guides management

### 🍽️ Restaurant Management

* Food items
* Food status tracking
* Restaurant events

### 🌍 Additional Data Management

* Country codes
* Provinces
* Nationalities
* Languages
* Currencies
* Service types
* Tour types

---

## 🛠️ Technologies Used

### Programming Language

* PHP
* TypeScript

### Backend

* Laravel (REST API)
* JWT Authentication
* MySQL Database

### Frontend

* Angular
* HTML
* CSS
* Bootstrap

### Tools

* IntelliJ IDEA
* PhpStorm
* Git
* GitHub

---

## 📂 Project Structure

```
Hotel-Management
│
├── client_angular        # Angular Frontend
│
├── server                # Laravel Backend
│   ├── app
│   │   ├── Http
│   │   │   ├── Controllers
│   │   │   │   ├── CustomerController.php
│   │   │   │   ├── HotelController.php
│   │   │   │   ├── RoomBookController.php
│   │   │   │   ├── PackageController.php
│   │   │   │   ├── UserController.php
│   │   │   │   └── ...
│   │
│   ├── database
│   │   ├── migrations
│   │
│   └── routes
│       └── api.php
│
└── README.md
```

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Hotel-Management.git
```

---

### 2️⃣ Backend Setup (Laravel)

```bash
cd server

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

---

### 3️⃣ Frontend Setup (Angular)

```bash
cd client_angular

npm install

ng serve
```

---

## 🔑 Authentication

This project uses **JWT (JSON Web Token)** for authentication.

API requests must include the token:

```
Authorization: Bearer <token>
```

---

## 📊 Key Modules

* Customer Management
* Employee Management
* Room Management
* Room Booking
* Event Management
* Package Management
* Transport Booking
* Flight Booking
* Restaurant Services

---

## 📸 System Preview

You can add system screenshots here:

```
![Dashboard](images/dashboard.png)
![Room Booking](images/room-booking.png)
```

---

## 👨‍💻 Developer

**Sahan Geesara**

* Full Stack Developer
* PHP / Laravel Developer
* Angular Developer

📍 Sri Lanka

---

## 📜 License

This project is developed for **educational purposes (Final Year Project)**.

---

💡 **Suggestion:**
Your project has **many controllers (40+)**, which is actually **very good for a final year system**. If you add:

* API documentation
* ER diagram
* System architecture
* Screenshots

your GitHub project will look **very strong for job applications**.

---

