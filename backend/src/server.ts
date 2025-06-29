import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/db";
import redirectRouter from "./routes/redirectRouter";
dotenv.config();

const app= express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['https://short-url-fawn-nu.vercel.app',
'https://short-url-amrithas-projects-57839655.vercel.app',
'https://short-2eusxd586-amrithas-projects-57839655.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, origin);
  },
  credentials: true,
}));

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );


app.use("/user", userRoutes);
app.use('/r', redirectRouter);




const PORT=process.env.PORT;
app.listen(PORT,async()=>{

console.log(`server is running on PORT ${PORT}`);
 await connectDB();
})