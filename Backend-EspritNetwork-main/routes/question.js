const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.post("/add", questionController.addQuestion);
router.post("/import", questionController.importQuestion);
router.get("/getall", questionController.getAllQuestions);
router.delete("/delall", questionController.deleteAllQuestions);
router.get("/getbyid/:id", questionController.getQuestionById);
router.get("/getQByDomaine", questionController.getQuestionByDomaine);
router.delete("/delete/:id", questionController.deleteQuestion);
router.put("/update/:id", questionController.updateQuestion);

module.exports = router;
