const mongoose = require("mongoose");

const userSChema = new mongoose.Schema({
    
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const userModel = mongoose.model("Users", userSChema);

module.exports = userModel