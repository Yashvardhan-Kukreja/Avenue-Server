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


router.post("/disease/register", (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    AuthControllers.registerDisease(name, description).then(data=> {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

router.post("/user/register", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let geoaddress = req.body.geoaddress;
    let contact = req.body.contact;
    let password = req.body.password;

    AuthControllers.registerUser(name, address, geoaddress, email, contact, password).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

router.post("/user/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    AuthControllers.loginUser(email, password).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});


module.exports = router;