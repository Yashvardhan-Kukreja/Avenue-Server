const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const Doctor = require('../database/doctor/doctorModel');
const Patient = require('../database/patient/patientModel');
const Disease = require('../database/disease/diseaseModel');

module.exports.registerDoctor = (name, email, contact, password) => {
    return new Promise((resolve, reject) => {
        var newDoc = new Doctor({
            name: name,
            email: email,
            contact: contact,
            password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred", err: err});
            } else {
                bcrypt.hash(password, salt, null, (err, hash) => {
                    if (err) {
                        console.log(err);
                        reject({success: false, message: "An error occurred", err: err});
                    } else {
                        newDoc.password = hash;
                        newDoc.save((err) => {
                            if (err) {
                                console.log(err);
                                if (err.code == 11000)
                                    reject({success: false, message: "A doctor already exists with the same email"});
                                else
                                    reject({success: false, message: "An error occurred", err: err});
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
                reject({success: false, message: "An error occurred", err: err});
            } else {
                if (!outputDoc)
                    reject({success: false, message: "Doctor not found!"});
                else {
                    bcrypt.compare(password, outputDoc.password, (err, valid) => {
                        if (err) {
                            console.log(err);
                            reject({success: false, message: "An error occurred", err: err});
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

module.exports.registerPatient = (name, address, geoaddress, email, contact, disease_name, disease_description, docId) => {
    return new Promise((resolve, reject) => {
        Patient.findOne({$or: [{email: email}, {contact: contact}]}).exec((err, outputPatient) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {

                Disease.findOne({name: disease_name}).exec((err, outputDisease) => {
                    if (err) {
                        console.log(err);
                        reject({success: false, message: "An error occurred", err: err});
                    } else {
                        if (!outputDisease) {
                            var newDisease = new Disease({
                                name: disease_name,
                                description: disease_description
                            });
                            newDisease.save((err, savedDisease) => {
                                if (err) {
                                    console.log(err);
                                    reject({success: false, message: "An error occurred", err: err});
                                } else {
                                    if (!outputPatient) {
                                        var newPatient = new Patient({
                                            name: name,
                                            address: address,
                                            geoaddress: geoaddress,
                                            email: email,
                                            contact: contact,
                                            current_disease: savedDisease._id,
                                            case_status: true
                                        });
                                        newPatient.save((err, out1) => {
                                            if (err) {
                                                console.log(err);
                                                reject({success: false, message: "An error occurred", err: err});
                                            } else {
                                                Doctor.findOneAndUpdate({_id: docId}, {$push:{patients: out1._id}}).exec((err) => {
                                                    resolve({success: true, message: "Patient registered successfully"});
                                                });
                                            }
                                        });
                                    } else {
                                        outputPatient.name = name;
                                        outputPatient.address = address;
                                        outputPatient.geoaddress = geoaddress;
                                        outputPatient.email = email;
                                        outputPatient.contact = contact;
                                        outputPatient.current_disease = savedDisease._id;
                                        outputPatient.case_status = true;
                                        outputPatient.save((err, out2) => {
                                            if (err) {
                                                console.log(err);
                                                reject({success: false, message: "An error occurred", err: err});
                                            } else {
                                                Doctor.findOneAndUpdate({_id: docId}, {$push:{patients: out2._id}}).exec((err) => {
                                                    resolve({success: true, message: "Patient registered successfully"});
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
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
                reject({success: false, message: "An error occurred", err: err});
            } else {
                resolve({success: true, message: "Disease registered successfully"});
            }
        });
    });
};