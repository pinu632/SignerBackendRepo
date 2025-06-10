import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {User} from "../models/user.model.js";





import dotenv from 'dotenv'
dotenv.config()





passport.use(new GoogleStrategy({
    clientID: "499881039856-n36ddcfsgshohngu1f08k8pfg1fr1f95.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    scope: ['profile', 'email'] 
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value } // Check if email matches
        ]
      });

      

      // console.log(user)
      if (!user) {
     
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
          googleId: profile.id,
          
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

