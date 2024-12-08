const express = require("express");
const router = express.Router();
const PlanifierEntretien = require("../controllers/meetController");

router.post("/planifier", PlanifierEntretien.PlanifierEntretien);

module.exports = router;
