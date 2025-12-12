const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipCode: String,
    radius: String,
    joined: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
