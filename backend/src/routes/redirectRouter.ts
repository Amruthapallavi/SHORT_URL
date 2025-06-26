import express from 'express';
import UserController from '../controllers/userController';
const redirectRouter = express.Router();

redirectRouter.get('/:shortCode', UserController.redirect);

export default redirectRouter;