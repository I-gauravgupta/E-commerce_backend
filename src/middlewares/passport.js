const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/userModel");
const { validatePassword } = require("../utils/password");

passport.use(new LocalStrategy(async (username, password, done) => {            
      try {
        const findUser = await User.findOne({ emailId:username });
        if (findUser) {
          const isValid = await validatePassword(password, findUser.password);
          if (isValid) {
            return done(null, findUser);
          } else {
            return done(null, false, { msg: "Incorrect password" });
          }
        } else {
          return done(null, false, { msg: "Incorrect emailId" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);
module.exports=passport;
