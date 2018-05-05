const express = require('express');
const AuthControllers = require('../controllers/authControllers');

const router = express.Router();

router.post("/doctor/register", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let contact = req.body.contact;
    let password = req.body.password;

    AuthControllers.registerDoctor(name, email, contact, password).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });

});

router.post("/doctor/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    AuthControllers.loginDoctor(email, password).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });

});

router.post("/patient/register/:docId", (req, res) => {
    let name = req.body.name;
    let address = req.body.address;
    let geoaddress = req.body.geoaddress;
    let email = req.body.email;
    let contact = req.body.contact;
    let disease_name = req.body.disease_name;
    let disease_desc = req.body.disease_desc;
    let docId = req.params.docId;

    AuthControllers.registerPatient(name, address, geoaddress, email, contact, disease_name, disease_desc, docId).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });

});

router.post("/disease/register", (req, res) => {
    let name = req.body.name;

    AuthControllers.registerDisease(name, "Fatal").then(data=> {
        res.json(data);
    }).catch(err => {
        res.json(err);
    })
});

module.exports = router;