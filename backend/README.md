# 🔥 Fire Alert & Management System - Setup Guide

## 📦 Package Installation & Configuration

This section describes the steps required to install packages and configure the system.

---

## 🛠 Backend Configuration

To set up the backend, follow these steps:

# Navigate to the backend directory
cd backend 

# Install all dependencies
npm install

This will install all required modules as specified in package.json. The package-lock.json file ensures consistent dependency versions.

Once the installation is complete, a node_modules folder will be available in the backend directory.
## 🔑 Testing Authentication (Without Frontend)

To test authentication independently from the frontend, follow these steps:

# 1️⃣ Start the API Gateway server

node api-gatwey/server.js

# 2️⃣ Start the authentication service

node services/authentification/server.js

# 3️⃣ Authenticate using an HTTP request
Send login credentials via curl:

curl -X POST http://localhost:5001/login -H "Content-Type: application/json" -d '{"username":"admin", "password":"admin123"}'

If authentication is successful, a JWT token will be returned. Copy it for accessing protected routes.

# 4️⃣ Access a protected route (Example: Profile Page)

curl -X GET http://localhost:5001/profile -H "Authorization: Bearer YOUR_OBTAINED_TOKEN"

