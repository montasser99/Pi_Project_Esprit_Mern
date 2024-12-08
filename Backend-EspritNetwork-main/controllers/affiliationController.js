    const Affiliation = require("../models/affiliation");

    async function addAffiliation(req, res) {
    try {
        const { name } = req.body;
        const affiliation = new Affiliation({ name });
        await affiliation.save();
        res.status(201).json({ message: "Affiliation added successfully", affiliation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
    }

    async function getAllAffiliations(req, res) {
    try {
        const affiliations = await Affiliation.find();
        res.status(200).json(affiliations);
    } catch (err) {
        res.status(400).json({ error: err });
    }
    }

    async function getAffiliationById(req, res) {
    try {
        const affiliation = await Affiliation.findById(req.params.id);
        res.status(200).json(affiliation);
    } catch (err) {
        res.status(400).json({ error: err });
    }
    }

    async function deleteAffiliation(req, res) {
    try {
        const deletedAffiliation = await Affiliation.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Affiliation deleted successfully", affiliation: deletedAffiliation });
    } catch (err) {
        res.status(400).json({ error: err });
    }
    }

    async function updateAffiliation(req, res) {
    try {
        const updatedAffiliation = await Affiliation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Affiliation updated successfully", affiliation: updatedAffiliation });
    } catch (err) {
        res.status(400).json({ error: err });
    }
    }

    module.exports = {
    addAffiliation,
    getAllAffiliations,
    getAffiliationById,
    deleteAffiliation,
    updateAffiliation,
    };
