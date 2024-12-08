const Competence = require("../models/competence");

async function addCompetence(req, res) {
  try {
    const { name } = req.body;
    const competence = new Competence({ name });
    await competence.save();
    res.status(201).json({ message: "Competence added successfully", competence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllCompetences(req, res) {
  try {
    const competences = await Competence.find();
    res.status(200).json(competences);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function getCompetenceById(req, res) {
  try {
    const competence = await Competence.findById(req.params.id);
    res.status(200).json(competence);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function deleteCompetence(req, res) {
  try {
    const deletedCompetence = await Competence.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Competence deleted successfully", competence: deletedCompetence });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function updateCompetence(req, res) {
  try {
    const updatedCompetence = await Competence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Competence updated successfully", competence: updatedCompetence });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

module.exports = {
  addCompetence,
  getAllCompetences,
  getCompetenceById,
  deleteCompetence,
  updateCompetence,
};
