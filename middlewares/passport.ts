import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStratagy } from "passport-local";
import { Strategy as GoogleStratagy } from "passport-google-oauth20";
import User from "../models/User";

// https://lavalite.org/blog/passport-serialize-and-deserialize-in-nodejs#:~:text=and%20passport.deserialize.-,Passport,user%20info%20in%20a%20callback
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
// https://www.youtube.com/watch?v=-RCnNyD0L-s&t=2s

// http://www.passportjs.org/docs/downloads/html/

// HOW PASSPORT WORKS : http://toon.io/understanding-passportjs-authentication-flow/

const findUserByUsername = async (username: string) => {
  return await User.findOne({ username }).select("+password");
};
const findUserById = async (id: string) => {
  return await User.findOne({ _id: id }).select("+password");
};

// Local stratagy
passport.use(
  new LocalStratagy(
    {
      usernameField: "username", // password field is by default password
      //   passReqToCallback: true, // if set, retq becomes the first user, useful for additional data from the request
    },
    async (username, password, done) => {
      // check if the user exist
      const user: any = await findUserByUsername(username);

      // if(user === null) // no user exists

      if (user && (await bcrypt.compare(password, user.password))) {
        // matched, call done and pass the user
        done(null, user);
      } else {
        // uhh!!! invalid credentials
        done(null, false, { message: "Email or password is incorrect" });
      }
    }
  )
);

// Passport google stratagy
passport.use(
  new GoogleStratagy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/redirect",
    },
    async (acccessToken, refreshToken, profile, done) => {
      console.log("access token", acccessToken);
      const currentUser = await User.findOne({
        googleId: profile.id,
      });
      if (currentUser) done(null, currentUser);
      else {
        const user = new User({
          googleId: profile.id,
        });
        console.log(profile);

        const newUser = await user.save();
        done(null, newUser);
      }
    }
  )
);

// TODO set type of the user

// done is the next middleware

// put the data(user id) into the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// get the serialized data(user id) from the session and retrive the user
passport.deserializeUser(async (req, id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    // something went wrong :(
    done(error);
  }
});

export default passport;
