const Domaine = require("../models/domaine");

async function addDomaine(req, res) {
	try {
		const { name } = req.body;
		const domaine = new Domaine({ name });
		await domaine.save();
		res.status(201).json({ message: "Domaine added successfully", domaine });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

async function getAllDomaines(req, res) {
	try {
		const domaine = await Domaine.find();
		res.status(200).json(domaine);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getDomaineById(req, res) {
	try {
		const domaine = await Domaine.findById(req.params.id);
		res.status(200).json(domaine);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function deleteAllDomaine(req, res) {
	try {
		await Domaine.find().deleteMany();
		res.status(200).json({ message: "All Domaines deleted successfully" });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

module.exports = {
	addDomaine,
	getAllDomaines,
	getDomaineById,
	deleteAllDomaine,
};
