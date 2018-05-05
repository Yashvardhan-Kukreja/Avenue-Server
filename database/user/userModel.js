const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    geoaddress: {
        type: String, //"12.122334 23.1223"
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    current_disease: {
        type: String,
        default: "No disease"
    },
    case_status: {
        type: boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema, "users");