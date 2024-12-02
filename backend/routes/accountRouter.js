// handle all login / register requests
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// import user model
const userModel = require("../models/userModel.js");

// routes to handle:
// sign up
// sign in

router.post("/login", (req, res) => {
    // check if user exists
    // use User model findOne to get account
    userModel.findOne({
        $or: [
            {username: req.body.username},
            {email: req.body.username}
        ]
    }).then(user => {
        if(user){  // user exists
            // compare password with hashing
            bcrypt.compare(req.body.password, user.password).then(result => {
                console.log('result be: ', result)
                if(result){ // password is correct
                    const userData = {
                        userId: user._id,
                        dailyScore: user.dailyScore
                    }
                    res.status(200).json(userData);
                } else { // password is incorrect
                    res.status(201).json({error: "Incorrect username, email, or password"});
                }
            }).catch(err => {
                res.status(500).json({error: "Internal server error: " + err});
            })
        } else { // user does not exist
            res.status(201).json({error: "Incorrect username, email, or password"});
        }
    }).catch(err => {
        res.status(500).json({error: "Internal server error: " + err});
    });    
});

router.post("/logout", (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ error: "Logout failed" });
    }
});

router.post("/signup", (req, res) => {
    // check if username or email is taken
    userModel.findOne({
        $or: [
            {username: req.body.username},
            {email: req.body.email}
        ]
    }).then(user => {
        if(user){ // username or email is taken
            if(user.username === req.body.username && user.email === req.body.email){
                res.status(202).send("Username and email taken");
            } else if(user.username === req.body.username){
                res.status(200).send("Username taken");
            } else {
                res.status(201).send("Email taken");
            }
        } else {
            // username and email are available
            // create new user
            const newUser = new userModel({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            newUser.save().then(() => {
                res.status(203).send("User created");
            }).catch(err => {
                res.status(500).send("Internal server error: " + err);
            });
        }
    }).catch(err => {
        res.status(500).send("Internal server error: " + err);
    });
});

module.exports = router;