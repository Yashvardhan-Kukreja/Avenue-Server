const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const Doctor = require('../database/doctor/doctorModel');
const Patient = require('../database/patient/patientModel');
const Disease = require('../database/disease/diseaseModel');

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

module.exports.registerPatient = (name, address, geoaddress, email, contact, disease_name, disease_desc, img_url, docId) => {
    return new Promise((resolve, reject) => {
        Patient.findOne({$or: [{email: email}, {contact: contact}]}).exec((err, outputPatient) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {

                Disease.findOne({name: disease_name}).exec((err, outputDisease) => {
                    if (err) {
                        console.log(err);
                        reject({success: false, message: "An error occurred"});
                    } else {
                        if (!outputDisease) {
                            var newDisease = new Disease({
                                name: disease_name,
                                description: disease_desc
                            });
                        } else {
                            var newDisease = outputDisease;
                        }

                        newDisease.save((err, savedDisease) => {
                            if (err) {
                                console.log(err);
                                reject({success: false, message: "An error occurred"});
                            } else {
                                if (!outputPatient) {
                                    var newPatient = new Patient({
                                        name: name,
                                        address: address,
                                        geoaddress: geoaddress,
                                        lat: parseFloat(geoaddress.split(" ")[0]),
                                        long: parseFloat(geoaddress.split(" ")[1]),
                                        email: email,
                                        contact: contact,
                                        current_disease: savedDisease._id,
                                        img_url: img_url,
                                        case_status: true
                                    });
                                    newPatient.save((err, out1) => {
                                        if (err) {
                                            console.log(err);
                                            reject({success: false, message: "An error occurred"});
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
                                    outputPatient.lat = parseFloat(geoaddress.split(" ")[0]);
                                    outputPatient.long = parseFloat(geoaddress.split(" ")[1]);
                                    outputPatient.img_url = img_url;
                                    outputPatient.case_status = true;
                                    outputPatient.save((err, out2) => {
                                        if (err) {
                                            console.log(err);
                                            reject({success: false, message: "An error occurred"});
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
                reject({success: false, message: "An error occurred"});
            } else {
                resolve({success: true, message: "Disease registered successfully"});
            }
        });
    });
};


// lat, long, dis_name, dis_description
module.exports.fetchCoordinates = () => {
    return new Promise((resolve, reject) => {
        Patient.find({case_status: true}, {_id: 0, name: 0, email: 0, contact: 0, address: 0, geoaddress: 0}).populate({
            path: 'current_disease',
            model: 'Disease'
        }).exec((err, outputPatients) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputPatients)
                    reject({success: false, message: "Not a single open case as of now"});
                else {

                    resolve({success: true, message: "Coordinates fetched successfully", coordinates: outputPatients});
                }
            }
        });
    });
};
///