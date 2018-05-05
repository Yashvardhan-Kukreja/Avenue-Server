const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
        default: "Its a fatal disease"
    }
});

module.exports = mongoose.model('Disease', diseaseSchema, "diseases");