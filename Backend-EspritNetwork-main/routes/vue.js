const express = require("express");
const router = express.Router();
const vueController = require("../controllers/vueController");

router.post('/add', vueController.addOrUpdateVue);
router.get('/getall', vueController.getAllVue);
router.get('/getvueByoffreId', vueController.getCountVuebyOffreId);
router.get('/getStatistiquesCompetences', vueController.getStatistiquesCompetences);


module.exports = router;
