const express = require("express");
const router = express.Router();
const departementController = require("../controllers/departementController");

router.post('/add', departementController.addDepartement);
router.get('/getall', departementController.getAllDepartements);
router.get('/getbyid/:id', departementController.getDepartementById);
router.delete('/delete/:id', departementController.deleteDepartement);
router.put('/update/:id', departementController.updateDepartement);

module.exports = router;
