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

router.post("/fetchAll/:id", (req, res) => {
    let id = req.params.id;
    DoctorControllers.fetchAllPatients(id).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;