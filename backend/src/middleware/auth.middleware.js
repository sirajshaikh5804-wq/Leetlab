import jwt from 'jsonwebtoken'
import { db } from '../lib/db.js'

export const authMiddleware = async (req,res,next) => {
    //get token -> req.cookies.jwt
    //verify token-> jwt.verify()
    // get user -> db.user.findUnique({ id: decoded.id })
    //attach user-> Add user to req.user.
    //next 
    try {
        const token= req.cookies.jwt

        if(!token){
            return res.status(401).json({
                message:"Unauthorised- No token provided"
            })
        }

        let decoded;
        try {
            decoded= jwt.verify(token,process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message:"Unauthorised - Invalid tokens"
            })
        }

        const user= await db.user.findUnique({
            where:{
                id:decoded.id
            },
            select:{
                id:true,
                image:true,
                name:true,
                email:true,
                role:true
            }
        })

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        req.user=user;
        next( )
    } catch (error) {
        console.log('Error creating user')
        res.status(500).json({message:"Error authenticating user"})
    }
}