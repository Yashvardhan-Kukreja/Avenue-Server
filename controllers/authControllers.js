const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const Doctor = require('../database/doctor/doctorModel');
const Patient = require('../database/patient/patientModel');
const Disease = require('../database/disease/diseaseModel');
const haversine = require('../middlewares/haversine');

module.exports.registerDoctor = (name, email, contact, password) => {
    console.log("Helllo");
    return new Promise((resolve, reject) => {

        var newDoc = new Doctor({
            name: name,
            email: email,
            contact: contact,
            password: password
        });
        console.log("Doc: ", newDoc);

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {
                bcrypt.hash(password, salt, null, (err, hash) => {
                    if (err) {
                        console.log(err);
                        reject({success: false, message: "An error occurred"});
                    } else {
                        newDoc.password = hash;
                        newDoc.save((err) => {
                            if (err) {
                                console.log(err);
                                if (err.code == 11000)
                                    reject({success: false, message: "A doctor already exists with the same email"});
                                else
                                    reject({success: false, message: "An error occurred"});
                            } else {
                                resolve({success: true, message: "Doctor successfully registered"});
                            }
                        });
                    }
                });
            }
        });
    });
};

module.exports.loginDoctor = (email, password) => {
    return new Promise((resolve, reject) => {
        Doctor.findOne({email: email}).populate({
            path: 'patients',
            model: 'Patient',
            populate: {
                path: 'current_disease',
                model: 'Disease'
            }
        }).exec((err, outputDoc) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputDoc)
                    reject({success: false, message: "Doctor not found!"});
                else {
                    bcrypt.compare(password, outputDoc.password, (err, valid) => {
                        if (err) {
                            console.log(err);
                            reject({success: false, message: "An error occurred"});
                        } else {
                            if (!valid)
                                reject({success: false, message: "Wrong password entered"});
                            else
                                resolve({success: true, message: "Doctor logged in successfully", doctor: outputDoc});
                        }
                    });
                }
            }
        });
    });
};

module.exports.registerDisease = (name, description) => {
    return new Promise((resolve, reject) => {
        var newDisease = new Disease({
            name: name,
            description: description
        });
        newDisease.save((err) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {
                resolve({success: true, message: "Disease registered successfully"});
            }
        });
    });
};

