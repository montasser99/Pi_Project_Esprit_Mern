const Question = require("../models/question");
const Technologie = require("../models/competence");
const Domaine = require("../models/domaine");
const { addCompetence } = require("./competenceController");
const { addDomaine } = require("./domaineController");
const xlsx = require("xlsx");
const multer = require("multer");

async function addQuestion(req, res) {
	try {
		const question = new Question(req.body);
		const tech = req.body.technologie;
		const dom = req.body.domaine;
		const technologie = Technologie.find({ name: tech });
		console.log(technologie);

		const domaine = Domaine.find({ name: dom });

		if (!technologie) {
			console.log(domaine);
			await addCompetence({ name: tech });
		}
		if (!domaine) {
			await addDomaine({ name: dom });
		}
		await question.save();
		res.status(201).json({ message: "Question added successfully", question });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

async function getAllQuestions(req, res) {
	try {
		const questions = await Question.find();
		res.status(200).json(questions);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}
async function deleteAllQuestions(req, res) {
	try {
		await Question.find().deleteMany();
		res.status(200).json({ message: "All questions deleted successfully" });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getQuestionById(req, res) {
	try {
		const question = await Question.findById(req.params.id);
		res.status(200).json(question);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getQuestionByDomaine(req, res) {
	try {
		const domaine = req.body.domaine;
		const questions = await Question.find({
			domaine: domaine,
		});
		res.status(200).json(questions);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
}

async function deleteQuestion(req, res) {
	try {
		const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
		res.status(200).json({
			message: "Question deleted successfully",
			question: deletedQuestion,
		});
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function updateQuestion(req, res) {
	try {
		const updatedQuestion = await Question.findByIdAndUpdate(
			req.params.id,
			req.body.updatedQuestion,
			{ new: true }
		);
		res.status(200).json({
			message: "Question updated successfully",
			question: updatedQuestion,
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
}
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/");
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(" ").join("-");
		cb(null, file.fieldname + "-" + fileName);
	},
});

const upload = multer({ storage: storage }).single("file");

async function importQuestion(req, res) {
	try {
		upload(req, res, async (err) => {
			if (err) {
				return res
					.status(400)
					.json({ success: false, message: "Error uploading file" });
			}

			if (!req.file) {
				return res
					.status(400)
					.json({ success: false, message: "No file uploaded" });
			}

			const filePath = req.file.path;
			const file = xlsx.readFile(filePath);
			const sheets = file.SheetNames;
			const data = [];

			for (let i = 0; i < sheets.length; i++) {
				const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
				temp.forEach((row) => {
					data.push(row);
				});
			}

			const questionsToAdd = [];

			for (let i = 0; i < data.length; i++) {
				const options = [];

				for (let j = 1; j <= 4; j++) {
					const optionKey = `Option ${String.fromCharCode(64 + j)}`;

					if (data[i][optionKey]) {
						const isCorrect =
							data[i]["Réponse correcte"] === data[i][optionKey];

						options.push({
							option: data[i][optionKey],
							isCorrect: isCorrect,
						});
					}
				}

				const question = {
					domaine: req.body.domaine,
					categorie: req.body.categorie,
					technologie: req.body.technologie,
					niveau: data[i]["Niveau de difficulté"],
					titre: data[i]["Question"],
					options: options,
				};
				questionsToAdd.push(question);
			}
			// console.log(questionsToAdd);
			const addedQuestions = await Question.insertMany(questionsToAdd);

			res.status(201).json({ success: true, questions: addedQuestions });
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}
module.exports = {
	addQuestion,
	getAllQuestions,
	getQuestionById,
	deleteQuestion,
	updateQuestion,
	deleteAllQuestions,
	importQuestion,
	getQuestionByDomaine,
};
