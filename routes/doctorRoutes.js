const express = require('express');
const DoctorControllers = require('../controllers/doctorControllers');

const router = express.Router();

router.post("/closeCase/:patId/:docId", (req, res) => {
    let patId = req.params.patId;
    let docId = req.params.docId;

    DoctorControllers.closeCase(docId, patId).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });

});

router.post("/fetchAllPatients/:id", (req, res) => {
    let id = req.params.id;
    DoctorControllers.fetchAllPatients(id).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});


router.get("/fetchAllCoordinates", (req, res) => {
    DoctorControllers.fetchAllCoordinates().then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});


router.post("/openCase/:docId", (req, res) => {
    let name = req.body.name;
    let address = req.body.address;
    let geoaddress = req.body.geoaddress;
    let email = req.body.email;
    let contact = req.body.contact;
    let disease_name = req.body.disease_name;
    let disease_desc = req.body.disease_desc;
    let docId = req.params.docId;
    let img_url = req.body.img_url;

    DoctorControllers.openCase(name, address, geoaddress, email, contact, disease_name, disease_desc, img_url, docId).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

router.post("/nearbyCases", (req, res) => {
    let current_lat = req.body.current_lat;
    let current_long = req.body.current_long;

    DoctorControllers.fetchThresholdCasesLocation(current_lat, current_long).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;