const mongoose = require("mongoose");

const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String,
    telephone: Number
});

module.exports = User;