import { register,login,logout,checkme } from "../controllers/auth.controller.js";

const authRoutes= express.Router()

authRoutes.post('/register',register)
authRoutes.post('/login',login)
authRoutes.post('/logout',logout)
authRoutes.get('/checkme',checkme)

export default authRoutes;