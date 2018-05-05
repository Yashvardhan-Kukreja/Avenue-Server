const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    current_disease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disease'
    },
    case_status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Patient', patientSchema, "patients");