# Deployment & Setup Guide: Pro Cafe

This guide outlines the instructions to install, configure, seed, and run the complete full-stack **Pro Cafe** ordering platform.

---

## 1. Prerequisites

Make sure you have the following installed on your machine:
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` OR a MongoDB Atlas Cluster)

---

## 2. Backend Installation & Setup

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install all required dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables. A `.env` file has been created for you with default configurations:
   * `PORT`: Port the server runs on (default: `5000`)
   * `MONGO_URI`: MongoDB connection string (default: `mongodb://127.0.0.1:27017/procafe` for local instances)
   * `JWT_SECRET`: Hashing token key for Access Token signatures
   * `JWT_REFRESH_SECRET`: Refresh token hashing secret key
4. Seed the database with categories, food items, and default users:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will now be available at `http://localhost:5000`.

---

## 3. Frontend Installation & Setup

1. Open a new terminal tab/window and navigate to the project root:
   ```bash
   # From backend directory:
   cd ..
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will run locally and can be accessed at `http://localhost:5173` (or the port specified by Vite in the console).

---

## 4. Test Accounts

The database seed script automatically creates two default accounts for testing purposes:

### A. Customer User (Standard Ordering flow)
* **Email**: `john@example.com`
* **Password**: `password123`

### B. Administrator User (Restricted access control)
* **Email**: `admin@procafe.com`
* **Password**: `password123`

---

## 5. Directory Structure & Key Files

### Backend
* `backend/src/server.js`: Express configuration and entry point.
* `backend/src/config/db.js`: Database connection.
* `backend/src/models/`: MongoDB Schemas (User, Food, Category, Cart, Order).
* `backend/src/controllers/`: Core routing logic and request controllers.
* `backend/src/middlewares/`: JWT authentication, Admin check, and Error handler.
* `backend/src/routes/`: Router directories.
* `backend/src/utils/seedData.js`: Seeding script.

### Frontend Integration
* `src/context/AuthContext.jsx`: Session manager provider.
* `src/context/CartContext.jsx`: Synchronizes shopping cart items with the database.
* `src/pages/LoginPage.jsx` / `SignupPage.jsx`: Dynamic dark-theme authorization portals.
* `src/pages/ProfilePage.jsx`: Personal detail updates.
* `src/pages/CheckoutPage.jsx`: Full order checkout specifications.
* `src/pages/MyOrdersPage.jsx`: Order tracker timeline & cancellation portal.
