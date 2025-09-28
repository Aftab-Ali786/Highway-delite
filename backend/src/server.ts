import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routesl";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("✅ Notes App API is running...");
});


app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI || "", { dbName: "notes_app" })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
