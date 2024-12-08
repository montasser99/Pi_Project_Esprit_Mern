const express = require("express");
const Router = express.Router();
const passport = require("passport");
Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

Router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    try{
      res.redirect(
         `http://localhost:5173?email=${req.user.email}&name=${req.user.name}&secret=${req.user.secret}`
       )

    }catch(err){
      console.log(err.message);
    }
    
  }
);

module.exports = Router;