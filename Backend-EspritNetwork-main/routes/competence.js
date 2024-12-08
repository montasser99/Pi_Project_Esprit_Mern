const express = require("express");
const router = express.Router();
const competenceController = require("../controllers/competenceController");

router.post('/add', competenceController.addCompetence);
router.get('/getall', competenceController.getAllCompetences);
router.get('/getbyid/:id', competenceController.getCompetenceById);
router.delete('/delete/:id', competenceController.deleteCompetence);
router.put('/update/:id', competenceController.updateCompetence);

module.exports = router;
