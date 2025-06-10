
// import passport, { use } from "passport";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { sendSuccess } from "../helpers/APIhelpers.js";


const JWT_SECRET = process.env.JWT_SECRET

export const GoogleCallback = async (req, res) => {
  try {
    const user = req.user;


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {

        _id:user._id,
        name: user.fullname,
        email: user.email,
        picture: user.profileImg,
        googleId: user.googleId,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token as cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true, // set to false if testing locally without HTTPS
      sameSite: "None", // use "Lax" or "Strict" for better security in production
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    // Optional JSON response before redirection (for debugging)
    // return res.status(200).json({ success: true, message: "Authenticated", token });

    // Redirect to frontend
    return res.redirect('https://signer-frontend.vercel.app/');
  } catch (error) {
    console.error("Google OAuth Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getMe = async (req, res) => {

  const user = req.user;



  try {
    const data = await User.findById(user._id);
    console.log(data)
  
    if (data) return sendSuccess(res, data, 200)
    else throw new Error("Internal server error")

  } catch (error) {
    console.error("error at somewhere " + error)
  }

}


export const logout = async (req,res) =>{
  
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true, // set to false if testing locally without HTTPS
      sameSite: "None", // use "Lax" or "Strict" for better security in production
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    res.status(200).json({ message: "Logged out successfully" });

}