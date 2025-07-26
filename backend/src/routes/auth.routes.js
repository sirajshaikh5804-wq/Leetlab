import express from 'express'
import { register,login,logout,checkMe } from "../controllers/auth.controller.js";

const authRoutes= express.Router()

authRoutes.post('/register',register)
authRoutes.post('/login',login)
authRoutes.post('/logout',logout)
authRoutes.get('/checkme',checkMe)

export default authRoutes;