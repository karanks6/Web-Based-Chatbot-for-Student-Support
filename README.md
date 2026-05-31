# Web-Based Chatbot for Student Support

A comprehensive, full-stack web application designed to provide automated, interactive support for students. It features a conversational interface (chatbot) for students to ask questions, check FAQs, and view chat history. It also includes an administrative portal for managing FAQs, viewing analytics, and monitoring student interactions.

---

## 🏗 Architecture Overview

The system follows a standard three-tier architecture:
1. **Frontend (Client Tier):** Built with **React 18** and **Vite**, providing a fast, responsive, and modern user interface. It communicates with the backend via RESTful APIs using `axios`.
2. **Backend (Application Tier):** Built with **Java 17** and **Spring Boot 3.2.0**. It exposes REST APIs, handles business logic, and manages secure authentication using Spring Security and JSON Web Tokens (JWT).
3. **Database (Data Tier):** Uses **MySQL** for relational data storage, managed through **Spring Data JPA** and Hibernate for ORM.

---

## 🛠 Technical Stack

### Frontend
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Routing:** React Router v6
*   **HTTP Client:** Axios
*   **Styling:** Custom CSS (vanilla)
*   **Icons:** Lucide React

### Backend
*   **Language:** Java 17
*   **Framework:** Spring Boot 3.2.0
*   **Security:** Spring Security + JJWT (0.11.5)
*   **Data Access:** Spring Data JPA (Hibernate)
*   **Boilerplate Reduction:** Lombok

### Database
*   **DBMS:** MySQL 8.x
*   **Connector:** MySQL Connector/J

---

## ✨ Features

### Student Portal
*   **Secure Authentication:** Registration and JWT-based login.
*   **Interactive Chatbot:** Ask questions and receive automated responses based on a knowledge base (FAQs) or default fallbacks.
*   **Chat History:** View past chat sessions and their detailed logs.
*   **Quick Actions:** Pre-defined buttons for common queries.
*   **Profile Management:** Update personal information.

### Admin Dashboard
*   **Knowledge Base Management:** Add, edit, or delete Frequently Asked Questions (FAQs) which power the chatbot's responses.
*   **System Analytics:** Monitor system usage, user count, active sessions, etc.
*   **Session Monitoring:** View chat histories and interactions of different users.

---

## 🗄 Database Schema Overview

The underlying database `student_chatbot` consists of several key entities mapping to database tables:
*   **User:** Stores user credentials, email, and roles (ADMIN vs. STUDENT).
*   **Role:** Enum defining access levels.
*   **FAQ:** Stores the knowledge base (questions and answers) used by the chatbot.
*   **ChatSession:** Represents a continuous conversation instance between a user and the chatbot.
*   **ChatLog:** Records individual messages (prompts and responses) within a specific `ChatSession`. Includes status tracking (`ChatLogStatus`).

---

## ⚙️ Prerequisites

Ensure you have the following installed on your machine:
*   **Node.js** (v18+ recommended)
*   **npm** or **yarn**
*   **Java JDK 17**
*   **Maven** (3.8+)
*   **MySQL Server** (8.x)

---

## 🚀 Installation & Setup Guide

### 1. Database Setup

1. Start your local MySQL Server.
2. Create a new database named `student_chatbot`.
   ```sql
   CREATE DATABASE student_chatbot;
   ```
3. Ensure your MySQL root user credentials match the backend configuration. If your password is not `2125`, update the `application.properties` file in the backend.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Verify database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_chatbot?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=2125
   ```
   *(Update `username` and `password` to match your local MySQL setup).*
3. Clean and install dependencies using Maven:
   ```bash
   mvn clean install
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`. The database tables will be auto-generated due to `spring.jpa.hibernate.ddl-auto=update`.

### 3. Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The application will be accessible at `http://localhost:5173`.

---

## 📂 Project Structure

```text
Web-Based-Chatbot-for-Student-Support/
├── backend/                             # Spring Boot Java Backend
│   ├── src/main/java/.../chatbot/       # Base package
│   │   ├── config/                      # Web and Security Configurations
│   │   ├── controller/                  # REST API Endpoints (Admin, Auth, Chat, FAQ, User)
│   │   ├── dto/                         # Data Transfer Objects
│   │   ├── entity/                      # JPA Entities (User, FAQ, ChatSession, etc.)
│   │   ├── repository/                  # Spring Data Repositories
│   │   ├── security/                    # JWT Filters and Providers
│   │   └── service/                     # Business Logic
│   └── src/main/resources/              # App properties and static resources
├── frontend/                            # React + Vite Frontend
│   ├── src/                             # React Source Code
│   │   ├── api/                         # Axios interceptors and API calls
│   │   ├── components/                  # Reusable UI components (Navbar, Chatbot, etc.)
│   │   ├── context/                     # React Contexts (AuthContext)
│   │   └── pages/                       # Page components (Dashboard, Login, Home, etc.)
│   ├── package.json                     # Frontend dependencies
│   └── vite.config.js                   # Vite configuration
└── fix_profile.js                       # Helper script for profile updates
```

---

## 🔐 Security Details

*   **Passwords:** Securely hashed before database insertion.
*   **Endpoints:** Protected routes require a valid `Authorization: Bearer <token>` header.
*   **CORS:** Configured in the backend to allow requests from the React frontend (`http://localhost:5173`).
