# 🚀 Fire Alert & Management System - Angular Frontend 🔥

This project is a **web-based Fire Alert & Management System** built with **Angular**. It includes **authentication (JWT), fire alert tracking, user management, and analytics**. The frontend communicates with a **Node.js/Express backend**.

## 🔑 Key Features
- **JWT Authentication** for secure login and protected routes.
- **Fire Alert Management** for tracking real-time incidents.
- **User Role Management** with role-based access control.
- **Reports & Analytics** for analyzing alert data.
- **AuthGuard & HTTP Interceptor** for security.
- **API Integration** with a Node.js backend.

## 📌 Project Structure
- **`components/`** → UI components like **Dashboard, Alert List, Sidebar**.
- **`services/`** → Handles API requests (**AuthService**).
- **`guards/`** → Protects routes (**AuthGuard**).
- **`interceptors/`** → Attaches JWTs to API requests (**AuthInterceptor**).
- **`app.routes.ts`** → Defines **navigation routes**.
- **`app.config.ts`** → Stores global settings.
- **`environments/`** → Configuration files for different environments.

## 🚀 Quick Start
1️⃣ **Install dependencies**:
```bash
npm install


2️⃣ Run the frontend:
```bash
ng serve


3️⃣ Open http://localhost:4200/ in your browser.
For backend setup, ensure Node.js API is running at http://localhost:5001/.
please ensure that u done instructions : "node services/authentification/server.js", "node api-gatwey/server.js"
