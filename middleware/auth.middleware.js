import { sendError } from "../helpers/APIhelpers.js";
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

import { User } from "../models/user.model.js";



export const authMiddlewar = async (req, res, next) => {


    try {
        const token = req.cookies.jwt;
        if (!token) {
            return sendError(res, "Unautorized user or token not provided", 400)

        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return sendError(res, "Invalid Token", 401)

        }

        console.log(decoded)
      

        const user = await User.findById(decoded._id);
      

        if (!user) {
            return sendError(res, "User Not found", 404)
        }
       
       
        req.user = user;

        
        next();


    } catch (error) {
        console.log("error in protected middleware", error.message);
        return res.status(500).json({ error: "internal server error" });
    }
}