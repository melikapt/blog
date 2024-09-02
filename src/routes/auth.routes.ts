import express from 'express';
import { AuthController } from '../controllers/AuthController/auth.controller'
const Router = express.Router();

Router.post('/signup', AuthController.signUpUser)
Router.post('/login', AuthController.login)


export { Router as authRouter };