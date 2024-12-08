const express = require("express");
const router = express.Router();
const affiliationController = require("../controllers/affiliationController");

router.post('/add', affiliationController.addAffiliation);
router.get('/getall', affiliationController.getAllAffiliations);
router.get('/getbyid/:id', affiliationController.getAffiliationById);
router.delete('/delete/:id', affiliationController.deleteAffiliation);
router.put('/update/:id', affiliationController.updateAffiliation);

module.exports = router;
