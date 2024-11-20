// handle all login / register requests
const express = require("express");
const router = express.Router();

// routes to handle:
// sign up
// sign in
// sign out

router.post("/login", (req, res) => {
    // check if user exists
    // check if password is correct
    // send status code
    console.log("login request received");
    console.log(req.body);
    res.status(200).send("test_login");
});

module.exports = router;