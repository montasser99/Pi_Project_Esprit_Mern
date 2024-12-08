const Condidacy = require("../models/condidacy");
const Cv = require("../models/cv");

const path = require('path');
const fs = require('fs');

async function addCondidacy(req, res) {
  try {
    const { date_postule, status, affiliation, document, specialite, anneediplome, user, offre } = req.body;
    const condidacy = new Condidacy({ date_postule, status, affiliation, document, specialite, anneediplome, user, offre });
    await condidacy.save();
    res.status(201).json({ message: "Condidacy added successfully", condidacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function getCondidacyByIdOffre(req, res) {
  try {
    const offreId = req.params.id;
    const condidacies = await Condidacy.find({ offre: offreId }).populate('user').populate({
      path: 'offre',
      populate: {
        path: 'user'
      }
    });
    res.status(200).json(condidacies);
  } catch (error) {
    console.error('Error fetching condidacies by offer ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getpdfcondiacy(req, res) {
  try {
    const pdfname = req.params.pdfname;
    const documentPath = path.join(process.cwd(), 'DocumentsPdf', pdfname);

    // Check if the file exists
    if (fs.existsSync(documentPath)) {
      res.status(200).sendFile(documentPath);
    } else {
      res.status(404).json({ error: 'PDF not found' });
    }
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function getcondidacyVerified(req, res) {
  try {
    const idOffre = req.query.offreId; // Access offreId from the query parameters
    console.log("idOffre",idOffre);
    const condidacies = await Condidacy.find({ offre: idOffre }).populate('user').populate({
      path: 'offre',
      populate: {
        path: 'user'
      }
    });
    const cvs = await Cv.find({ pourcentage: 100 });
    const candidats = condidacies.filter((c) => cvs.find((cv) => cv.user.toString() === c.user._id.toString()));
    console.log("vvv :",candidats);
    res.status(200).json(candidats);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}



async function getAllCondidacies(req, res) {
  try {
    const condidacies = await Condidacy.find().populate('user'); // Use populate to include user details
    res.status(200).json(condidacies);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function getCondidacyById(req, res) {
  try {
    const condidacy = await Condidacy.findById(req.params.id).populate('user').populate({
      path: 'offre',
      populate: {
        path: 'user'
      }
    });
    res.status(200).json(condidacy);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}


const getCondidcayByIdUser = async (req, res) => {
  try {
    const condidacy = await Condidacy.find({ user: req.params.id }).populate('user').populate({
      path: 'offre',
      populate: {
        path: 'user'
      }
    }).sort({ date_postule: -1 });    
    res.status(200).json(condidacy);
  } catch (error) {
    console.error('Error fetching condidacy by user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


async function deleteCondidacy(req, res) {
  try {
    const deletedCondidacy = await Condidacy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Condidacy deleted successfully", condidacy: deletedCondidacy });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

async function updateCondidacy(req, res) {
  try {
    const updatedCondidacy = await Condidacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Condidacy updated successfully", condidacy: updatedCondidacy });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

module.exports = {
  addCondidacy,
  getpdfcondiacy,
  getAllCondidacies,
  getCondidacyById,
  deleteCondidacy,
  updateCondidacy,
  getCondidcayByIdUser,
  getCondidacyByIdOffre,
  getcondidacyVerified
};
