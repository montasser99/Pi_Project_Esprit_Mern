const express = require("express");
const Session = require("../models/session");
const router = express.Router();
router.post("/add", async (req, res) => {
	try {
		const session = new Session(req.body);
		console.log(session);
		await session.save();
		res.status(201).json({ message: "Session added successfully", session });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/getall", async (req, res) => {
	try {
		const sessions = await Session.find();
		res.status(200).json(sessions);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/getbycompanyid", async (req, res) => {
	try {
		const companyID = req.query.companyID; // Retrieve companyID from query string
		console.log(companyID);
		const sessions = await Session.find({ companyID: companyID });
		res.status(200).json(sessions);
		console.log(sessions);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
router.get("/getbyCompanyIdAndSessionId", async (req, res) => {
	try {
		console.log(" Session : getbyCompanyIdAndSessionId");
		const sessions = await Session.findOne({
			companyID: req.query.companyID,
			_id: req.query.sessionID,
		});
		console.log(sessions);
		res.status(200).json(sessions);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
