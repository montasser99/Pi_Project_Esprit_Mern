const express = require("express");
const router = express.Router();
const domaineController = require("../controllers/domaineController");

router.post("/add", domaineController.addDomaine);
router.get("/getall", domaineController.getAllDomaines);
router.get("/getbyid/:id", domaineController.getDomaineById);
router.delete("/deleteAll", domaineController.deleteAllDomaine);

module.exports = router;
