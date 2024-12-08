const express = require("express");
const router = express.Router();
const PlanifierEntretien = require("../controllers/interviewController");

router.post("/planifier", PlanifierEntretien.PlanifierEntretienEnLigne);
router.post(
	"/planifierAubureau",
	PlanifierEntretien.PlanifierEntretienAubureau
);
router.post(
	"/EnovyerMaildAcceptation",
	PlanifierEntretien.EnovyerMaildAcceptation
);
router.post("/EnovyerMaildeRefus", PlanifierEntretien.EnovyerMailRefuse);

module.exports = router;
