import express from "express";

const router = express.Router();

import { GoogleCallback, logout } from "../controller/auth.controller.js";
import { authMiddlewar } from "../middleware/auth.middleware.js";
import { getMe } from "../controller/auth.controller.js";


// import { GetMe, GoogleCallback, login, logout, signup } from "../Controllers/auth.controller.js";
// import { ProtectedRoute } from "../middleware/ProtectedRoute.js";
import passport from "passport";

// router.post('/signup',signup);
// router.post('/signin',login);
router.get('/me',authMiddlewar,getMe)
router.post('/logout',logout);
router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))
router.get('/google/callback',
    passport.authenticate('google',{failureRedirect:'/login',session:false}),
    GoogleCallback
)
export default router;