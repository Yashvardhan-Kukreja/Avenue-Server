const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const Doctor = require('../database/doctor/doctorModel');
const Patient = require('../database/patient/patientModel');
const Disease = require('../database/disease/diseaseModel');


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