const Cv = require("../models/cv");
const { exists } = require("../models/test");

// const defaultUserId = "65e383ad98ae7547e1fb5843";

async function addCv(req, res) {
	try {
		const {
			contact,
			biographie,
			parcoursProfessionnels,
			parcoursAcademiques,
			competences,
			langues,
			user,
		} = req.body;
		const existingCv = await Cv.findOne({ user: user }); // Utilisation de l'ID utilisateur statique
		if (existingCv) {
			// Mise à jour du CV existant
			const updatedCv = await Cv.findByIdAndUpdate(
				existingCv._id,
				{
					contact,
					biographie,
					parcoursProfessionnels,
					parcoursAcademiques,
					competences,
					langues,
				},
				{ new: true }
			);
			return res
				.status(200)
				.json({ message: "CV updated successfully", cv: updatedCv });
		} else {
			// Création d'un nouveau CV
			const cv = new Cv({
				contact,
				biographie,
				parcoursProfessionnels,
				parcoursAcademiques,
				competences,
				langues,
				user: user,
			}); // Utilisation de l'ID utilisateur statique
			await cv.save();
			return res.status(201).json({ message: "CV added successfully", cv });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

async function getAllCvs(req, res) {
	try {
		const cvs = await Cv.find();
		res.status(200).json(cvs);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getCvById(req, res) {
	try {
		const cv = await Cv.findById(req.params.id);
		res.status(200).json(cv);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getCvByUserId(req, res) {
	try {
		const userId = req.params.id; // L'ID de l'utilisateur
		const cv = await Cv.findOne({ user: userId }); // Recherche du CV avec l'ID de l'utilisateur
		if (!cv) {
			return res.status(404).json({ error: "CV not found for this user" });
		}
		res.status(200).json(cv);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function deleteCv(req, res) {
	try {
		const deletedCv = await Cv.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "CV deleted successfully", cv: deletedCv });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function updateCv(req, res) {
	try {
		const updatedCv = await Cv.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.status(200).json({ message: "CV updated successfully", cv: updatedCv });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

//Image
async function uploadImageCv(req, res) {
	try {
		const { imageDataUrl } = req.body;
		const base64Data = imageDataUrl.split(";base64,").pop();
		const imageBuffer = Buffer.from(base64Data, "base64");
		res.status(200).json({ message: "Image uploaded successfully" });
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
async function updatepourcentageById(req, res) {
	try {
		const userId = req.body.id; 
		console.log(userId);
		const datacv = await Cv.findOne({ user: userId }); // Find the CV by user ID
		if (!datacv) {
			return res.status(404).json({ error: "CV not found for this user" });
		}
		datacv.pourcentage = req.body.pourcentage; // Update the percentage
		await datacv.save(); // Save the changes
		return res.status(200).json({ message: "Percentage updated successfully" });
	} catch (error) {
		console.error("Error updating percentage:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}




module.exports = {
	addCv,
	getAllCvs,
	getCvById,
	deleteCv,
	updateCv,
	getCvByUserId,
	uploadImageCv,
	updatepourcentageById
};
