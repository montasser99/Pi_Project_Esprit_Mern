const Departement = require("../models/departement");

async function addDepartement(req, res) {
  try {
    const { specialite, options } = req.body;
    const departement = new Departement({ specialite, options });
    await departement.save();
    res.status(201).json({ message: "Departement added successfully", departement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllDepartements(req, res) {
  try {
    const departements = await Departement.find();
    res.status(200).json(departements);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function getDepartementById(req, res) {
  try {
    const departement = await Departement.findById(req.params.id);
    res.status(200).json(departement);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function deleteDepartement(req, res) {
  try {
    const deletedDepartement = await Departement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Departement deleted successfully", departement: deletedDepartement });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function updateDepartement(req, res) {
  try {
    const updatedDepartement = await Departement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Departement updated successfully", departement: updatedDepartement });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

module.exports = {
  addDepartement,
  getAllDepartements,
  getDepartementById,
  deleteDepartement,
  updateDepartement,
};
