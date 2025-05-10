import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import userRouter from "./router/user.router.js";
import categoryRouter from "./router/category.router.js";
import subCategoryRouter from "./router/subcategory.router.js";
import productRouter from "./router/product.router.js";
import uploadRouter from "./router/upload.router.js";
import inStockRouter from "./router/instock.router.js";
import orderRouter from "./router/order.router.js";
import outStockRouter from "./router/outstock.router.js";
import profileRouter from "./router/profile.router.js";
import dashboardRouter from "./router/dashboard.router.js";

dotenv.config();
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = 3000 || process.env.PORT;

app.get("/", (request, response) => {
  response.json({
    message: "Server is running",
  });
});

app.use("/api/user", userRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/file", uploadRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/stock", inStockRouter);
app.use("/api/order", orderRouter);
app.use("/api/outstock", outStockRouter);
app.use("/api/profile", profileRouter);
app.use("/api/dashboard", dashboardRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is Running", PORT);
  });
});
