const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/userModel");
const { validatePassword } = require("../utils/password");

passport.use(new LocalStrategy({
  usernameField: 'emailId', // Field name for email
  passwordField: 'password' // Field name for password
},async (emailId, password, done) => {
  try {
    const findUser = await User.findOne({ emailId });
    if (findUser) {
      const isValid = await validatePassword(password, findUser.password);
      if (isValid) {
        return done(null, findUser);
      } else {
        console.log("Invalid password");
        return done(null, false, { msg: "Incorrect password" });
      }
    } else {
      console.log("User not found");
      return done(null, false, { msg: "Incorrect emailId" });
    }
  } catch (error) {
    console.log("Error in strategy", error);
    return done(error);
  }
}
));

module.exports=passport;



