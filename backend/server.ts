import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes";
import connectDB from "./src/config/db";
import redirectRouter from "./src/routes/redirectRouter";
dotenv.config();

const app= express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


app.use("/user", userRoutes);
app.use('/r', redirectRouter);




const PORT=process.env.PORT;
app.listen(PORT,async()=>{

console.log(`server is running on PORT ${PORT}`);
 await connectDB();
})