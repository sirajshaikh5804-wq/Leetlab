import express from 'express'
import { register,login,logout,checkMe } from "../controllers/auth.controller.js";
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRoutes= express.Router()

authRoutes.post('/register',register)
authRoutes.post('/login',login)
authRoutes.post('/logout',authMiddleware, logout)
authRoutes.get('/checkme',authMiddleware, checkMe)

export default authRoutes;