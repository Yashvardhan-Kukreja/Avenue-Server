const Promise = require('bluebird');
const Doctor = require('../database/doctor/doctorModel');
const Patient = require('../database/patient/patientModel');
const Disease = require('../database/disease/diseaseModel');
const haversine = require('../middlewares/haversine');

module.exports.openCase = (name, address, geoaddress, email, contact, disease_name, disease_desc, img_url, docId) => {
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


module.exports.closeCase = (docId, patId) => {
    return new Promise((resolve, reject) => {
        Patient.findOneAndUpdate({_id: patId}, {case_status: false}).exec((err, outputPatient) => {
            if (err) {
                console.log(err);
                reject({success: false, message: "An error occurred"});
            } else {
                if (!outputPatient)
                    reject({success: false, message: "Wrong patient id"});
                else {
                    Doctor.findOne({_id: docId}).exec((err, outputDoc) => {
                        if (err){
                            console.log(err);
                            reject({success: false, message: "An error occurred"});
                        } else {
                            if (!outputDoc)
                                reject({success: false, message: "Wrong doctor id"});
                            else {
                                var i = outputDoc.patients.indexOf(patId);
                                outputDoc.patients.splice(i, 1);
                                outputDoc.save((err) => {
                                    if (err) {
                                        console.log(err);
                                        reject({success: false, message: "An error occurred"});
                                    } else {
                                        resolve({success: true, message: "Case closed successfully"});
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });
};

module.exports.fetchAllPatients = (id) => {
    return new Promise((resolve, reject) => {
        Doctor.findOne({_id: id}).populate({
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
                    reject({success: false, message: "Wrong object id entered"});
                else
                    resolve({success: true, message: "Fetched all the patients", patients: outputDoc.patients});
            }
        });
    });
};


// lat, long, dis_name, dis_description
module.exports.fetchAllCoordinates = () => {
    return new Promise((resolve, reject) => {
        Patient.find({case_status: true}, {_id: 0, name: 0, email: 0, contact: 0, address: 0, geoaddress: 0, case_status: 0, img_url: 0}).populate({
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

module.exports.fetchThresholdCasesLocation = (current_lat, current_long) => {
    return new Promise((resolve, reject) => {
        Patient.find({case_status: true}, {_id: 0, name: 0, email: 0, contact: 0, address: 0, geoaddress: 0, case_status: 0, img_url: 0}).populate({
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
                    var patients_under_4km = [];
                    for (var i=0; i<outputPatients.length; i++) {
                        if (haversine.calcGeoDistance(parseFloat(current_lat), parseFloat(current_long), outputPatients[i].lat, outputPatients[i].long) <= 4)
                            patients_under_4km.push(outputPatients[i]);
                    }
                    setTimeout(function(){
                        resolve({success: true, message: "Fetched the cases under 4km", cases: outputPatients});
                    }, 500);
                }
            }
        });
    });
};

