import express from "express";
import UserController from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const userRoutes= express.Router();


userRoutes.post("/register",UserController.signup); 
userRoutes.post("/login",UserController.login);
userRoutes.post("/shorten",authenticateToken,UserController.shorten)
userRoutes.get("/r/:shortCode",UserController.redirect);
userRoutes.get("/urls",authenticateToken,UserController.getUrls);
userRoutes.delete("/url/:id",authenticateToken,UserController.deleteUrl);
userRoutes.post(
  "/logout",authenticateToken,
  UserController.logout)


export default userRoutes;