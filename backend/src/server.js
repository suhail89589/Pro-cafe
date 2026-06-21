import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();

app.set("trust proxy", 1);
// Security HTTP headers
app.use(helmet());

app.use(cors({
  origin: [
    'https://pro-cafe-frontend.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({
    status: "Pro Cafe API is running...",
    hasMongoUri: !!process.env.MONGO_URI,
    mongoUriPrefix: process.env.MONGO_URI
      ? process.env.MONGO_URI.substring(0, 15)
      : null,
    nodeEnv: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
  });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
  });
}

export default app;
