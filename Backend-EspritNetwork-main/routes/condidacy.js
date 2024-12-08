const express = require("express");
const router = express.Router();
const condidacyController = require("../controllers/condidacyController");

router.post('/add', condidacyController.addCondidacy);
router.get('/getall', condidacyController.getAllCondidacies);
router.get('/getbyid/:id', condidacyController.getCondidacyById);
router.delete('/delete/:id', condidacyController.deleteCondidacy);
router.put('/update/:id', condidacyController.updateCondidacy);
router.get('/getbyiduser/:id', condidacyController.getCondidcayByIdUser);
router.get('/getpdf/:pdfname', condidacyController.getpdfcondiacy);
router.get('/getbyidoffre/:id', condidacyController.getCondidacyByIdOffre);
router.get('/getverifiedCondidacy', condidacyController.getcondidacyVerified);

module.exports = router;
