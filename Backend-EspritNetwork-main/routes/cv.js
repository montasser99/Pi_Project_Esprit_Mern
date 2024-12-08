const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cvController");

router.post('/add', cvController.addCv);
router.get('/getall', cvController.getAllCvs);
router.get('/getbyid/:id', cvController.getCvById);
router.get('/getCvByUserId/:id', cvController.getCvByUserId);
router.delete('/delete/:id', cvController.deleteCv);
router.put('/update/:id', cvController.updateCv);
router.post('/upload/image', cvController.uploadImageCv);
router.post('/upload/image', cvController.uploadImageCv);
router.post('/updatepourcentage', cvController.updatepourcentageById);

module.exports = router;
