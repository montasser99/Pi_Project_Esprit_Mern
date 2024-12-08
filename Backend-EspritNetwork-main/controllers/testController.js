const Test = require("../models/test");
const Offre = require("../models/offre");
const Question = require("../models/question");
const PassageTest = require("../models/PassageTest");
const session = require("../models/session");
const { SendMAilPourPassTest } = require("./interviewController");
const User = require("../models/user");
const AntiTricherie = require("../models/antiTricherie");
const condidacy = require("../models/condidacy");
const xlsx = require("xlsx");
const multer = require("multer");

async function addTest(req, res) {
	try {
		const test = new Test(req.body);
		console.log(test);
		await test.save();
		res.status(201).json({ message: "Test added successfully", test });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

async function addAutomaticTest(req, res) {
	try {
		console.log(req.body);
		const domaine = req.body.domaine;
		const categorie = req.body.categorie;
		const technologie = req.body.technologie;
		const description = req.body.description;
		const duree = req.body.duree;
		const nbQN1 = parseInt(req.body.nbQN1);
		const nbQN2 = parseInt(req.body.nbQN2);
		const nbQN3 = parseInt(req.body.nbQN3);
		let questionsN1 = [];
		let questionsN2 = [];
		let questionsN3 = [];
		let ok = false;
		let data = [];
		const nbQuestion = nbQN1 + nbQN2 + nbQN3;
		console.log(req.body.nbQN1);
		console.log("..Nombres des question pour le test : " + nbQuestion);
		console.log("1. generer des question pour le test pour chaque niveau ");
		if (nbQN1) {
			let question = await Question.find({
				technologie: technologie,
				niveau: "Basique",
			});

			data = question;

			for (let i = 0; i < nbQN1; i++) {
				let n = Math.floor(Math.random() * (data.length - 1));
				n = n + 1 > data.length - 1 ? n : n + 1;
				console.log(n, data.length);
				var Q = data[n];
				questionsN1.push(Q);
			}
			console.log("questionsN1 " + questionsN1);
			ok = true;
		}
		if (nbQN2) {
			let question = await Question.find({
				technologie: technologie,
				niveau: "Intermédiaire",
			});
			data = question;
			console.log("questionsN2 ", data);
			for (let i = 0; i < nbQN2; i++) {
				let n = Math.floor(Math.random() * (data.length - 1));
				n = n + 1 > data.length - 1 ? n : n + 1;
				console.log(n, data.length);
				var Q = data[n];
				questionsN2.push(Q);
			}
			ok = true;
		}
		if (nbQN3) {
			let question = await Question.find({
				technologie: technologie,
				niveau: "Avancé",
			});
			data = question;
			for (let i = 0; i < nbQN3; i++) {
				let n = Math.floor(Math.random() * (data.length - 1));
				n = n + 1 > data.length - 1 ? n : n + 1;
				console.log(n, data.length);
				var Q = data[n];
				questionsN3.push(Q);
			}
			console.log("questionsN3:  " + questionsN3);
			ok = true;
		}

		let questions = [].concat(questionsN1, questionsN2, questionsN3);
		console.log("questions" + questions);

		console.log("3. Affecter le test à ");
		console.log("ok = ", ok);
		if (ok === true) {
			const test = await Test.create({
				domaine,
				categorie,
				technologie,
				questions,
				duree,
				description,
			});
			console.log("le tests ont été effectué  avec succès", test);
		} else {
			console.log("Probléme lors de la création du test");
			return res
				.status(500)
				.json({ message: "Probléme lors de la création du test", ok });
		}

		return res.status(200).json({
			message: "Test à été cree  avec succès",
		});
	} catch (errors) {
		console.log(errors.message);
		return res.status(500).json({ message: errors.message });
	}
}
async function deleteAllTest(req, res) {
	try {
		await test.find().deleteMany();
		res.status(200).json({ message: "All tests deleted successfully" });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getAllTests(req, res) {
	try {
		const tests = await Test.find();

		res.status(200).json(tests);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getTestById(req, res) {
	try {
		const test = await Test.findById(req.params.id);
		res.status(200).json(test);
	} catch (err) {
		console.log("err", err.message);
		res.status(400).json({ error: err });
	}
}

async function deleteTest(req, res) {
	try {
		const deletedTest = await Test.findByIdAndDelete(req.params.id);
		res
			.status(200)
			.json({ message: "Test deleted successfully", test: deletedTest });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function updateTest(req, res) {
	try {
		const updatedTest = await Test.findByIdAndUpdate(
			req.params.id,
			req.body.test,
			{ new: true }
		);
		res
			.status(200)
			.json({ message: "Test updated successfully", test: updatedTest });
	} catch (err) {
		res.status(400).json({ error: err });
	}
}
async function getbyCandidat(req, res) {
	try {
		const idCandidat = req.query.idCandidat;
		const tests = await PassageTest.find({ idCandidat: idCandidat });
		resultat = [];
		for (let i = 0; i < tests.length; i++) {
			const test = await Test.findById(tests[i].idTest);
			resultat.push({
				...test,
				date: tests[i].date,
				etat: tests[i].etat,
				test: test,
			});
		}
		res.status(200).json(resultat);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}
/**passage des tests : Section :  */

async function affecterTestAuCandidat(req, res) {
	try {
		console.log("affecterTestAuCandidat");
		const { idTest, idCandidat, idOffre } = req.body;
		let data = req.body;
		console.log(req.body);
		console.log(idTest, idCandidat);
		const exist = await PassageTest.findOne({ idTest, idCandidat, idOffre });
		if (exist) {
			return res
				.status(400)
				.json({ message: "Le test a déjà été envoyé au candidat." });
		}

		if (!idCandidat) {
			return res
				.status(400)
				.json({ message: "Veuillez sélectionner un candidat." });
		}
		// Formater la date (dd-mm-yyyy)

		let invited_at = new Date();
		invited_at = `${invited_at.getFullYear()}-${String(
			invited_at.getMonth() + 1
		).padStart(2, "0")}-${String(invited_at.getDate()).padStart(2, "0")}`;
		console.log("invited_at", invited_at);

		const newPassageTest = new PassageTest({ ...data, invited_at: invited_at });

		// Sauvegarder le nouvel enregistrement dans la base de données
		await newPassageTest.save();
		console.log(newPassageTest);
		/***Envoyer un mail au candidat pour le informer de ce test*/
		const candidat = await User.findById(idCandidat);
		SendMAilPourPassTest(candidat);
		const status = "Invité pour un test technique";
		await condidacy.findOneAndUpdate(
			{ user: idCandidat, offre: idOffre },
			{ $set: { status: status } },
			{ new: true }
		);

		return res.status(201).json({
			message: "Le test a été envoyé avec succès.",
			test: newPassageTest,
		});
	} catch (error) {
		console.error("Erreur lors de l'affectation du test au candidat :", error);
		return res.status(500).json({
			error:
				"Une erreur est survenue lors de l'affectation du test au candidat.",
		});
	}
}

async function PassTest(req, res) {
	try {
		console.log("Appel fonction de passage de test : ", PassTest);
		const { idTest, reponses, idCandidat, antiCheating } = req.body;

		// Chercher si le candidat a déjà passé le test et mettre à jour ou créer le passage de test
		let passage = await PassageTest.findOne({
			idTest: idTest,
			idCandidat: idCandidat,
		});
		if (passage) {
			if (passage.response.length > 0) {
				await PassageTest.findOneAndUpdate(
					{ idTest: idTest, idCandidat: idCandidat },
					{ $set: { response: "", etat: true } },
					{ new: true }
				);
			}
		}
		await PassageTest.findOneAndUpdate(
			{ idTest: idTest, idCandidat: idCandidat },
			{ $set: { response: reponses, etat: true, passed_at: new Date() } },
			{ new: true }
		);

		// Calcul du score en parcourant les réponses et les questions
		let critere = "";
		nbBasique = 0;
		nbIntermediaire = 0;
		nbAvance = 0;
		nbBasiqueCorrect = 0;
		nbIntermediaireCorrect = 0;
		nbAvanceCorrect = 0;

		let score = 0;
		const test = await Test.findById(idTest);
		const questions = test.questions;
		for (let i = 0; i < questions.length; i++) {
			const questionId = questions[i]._id.toString();
			const response = reponses.find((item) => item.idQuestion === questionId);
			if (response) {
				const question = questions[i];
				const option = question.options.find(
					(opt) => opt.option === response.reponse && opt.isCorrect
				);
				//get les nb de question par niveau
				if (question.niveau === "Basique") {
					nbBasique++;
				} else if (question.niveau === "Intermédiaire") {
					nbIntermediaire++;
				} else {
					nbAvance++;
				}
				//get les nb de question correct par niveau et clacule de score
				if (option) {
					if (question.niveau === "Basique") {
						score += 1;
						nbBasiqueCorrect++;
					} else if (question.niveau === "Intermédiaire") {
						score += 2;
						nbIntermediaireCorrect++;
					} else {
						score += 3;
						nbAvanceCorrect++;
					}
				}

				//composer un chaine de caractere critere pas le nb q correct par niveau
				critere =
					"Basique: " +
					nbBasiqueCorrect +
					"/" +
					nbBasique +
					" ,Intermédiaire: " +
					nbIntermediaireCorrect +
					"/" +
					nbIntermediaire +
					" ,Avancé: " +
					nbAvanceCorrect +
					"/" +
					nbAvance;
			}
		}

		// Mettre à jour le score du passage de test et le critère
		const result = await PassageTest.findOneAndUpdate(
			{ idTest: idTest, idCandidat: idCandidat },
			{ $set: { score: score, critere: critere } },
			{ new: true }
		);
		console.log("antiCheating", antiCheating);

		const dataAntiCheanting = {
			idTest: idTest,
			idCandidat: idCandidat,
			autorisationCamera: antiCheating.autorisationCamera,
			autorisationFullScreen: antiCheating.autorisationFullScreen,
			sourisDansFenetre: antiCheating.sourisDansFenetre,
			typeApapreil: antiCheating.typeApapreil,
			cameraActivated: antiCheating.cameraActivated,
			isFullScreen: antiCheating.isFullScreen,
			isMouseInsideWindow: antiCheating.isMouseInsideWindow,
		};
		console.log("dataAntiCheanting", dataAntiCheanting);

		const antiTricherie = new AntiTricherie(dataAntiCheanting);

		await antiTricherie.save();

		res.status(200).json({ message: "Added successfully", test: result });
	} catch (error) {
		console.log("error", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
}

async function getTestPasserbyCandidat(req, res) {
	try {
		console.log("getTestPasserbyCandidat  ");
		const { idCandidat } = req.query;
		const tests = await PassageTest.find({ idCandidat: idCandidat });
		resultat = [];
		for (let i = 0; i < tests.length; i++) {
			const test = await Test.findById(tests[i].idTest);
			const off = await Offre.findById(tests[i].idOffre);
			resultat.push({
				...test,
				passage: tests[i],
				test: test,
				offre: off,
			});
		}
		// console.log(resultat);

		res.status(200).json(resultat);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

/*****SHeeet* */

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/");
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(" ").join("-");
		cb(null, file.fieldname + "-" + fileName);
	},
});

const upload = multer({
	storage: storage,
}).single("file");

async function importAndInviteCandidatsToPassTest(req, res) {
	try {
		console.log(" Function : import And Invite Candidats To PassTest");
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
			const candidats = [];

			for (let i = 0; i < sheets.length; i++) {
				const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
				temp.forEach((row) => {
					candidats.push(row);
				});
			}
			console.log(candidats.length);
			///tester if data  from body is empty
			if (candidats.length == 0) {
				return res.status(400).json({ success: false, message: "No data" });
			}

			// create a array with id of candidats
			const candidatsArray = [];
			candidats.forEach((candidat) => {
				let d = {
					candidatId: candidat.Id,
					candidatNom: candidat.Nom,
					candidatEmail: candidat.Email,
				};
				candidatsArray.push(d);
			});

			console.log("candidatsArray", candidatsArray);

			//find sessionn and update it
			const s = await session.findById(req.body.id);
			if (!s) {
				return res
					.status(404)
					.json({ success: false, message: "Session not found" });
			}
			//update the candidats in the session
			await session.findOneAndUpdate(
				{ _id: req.body.id },
				{ $set: { candidats: candidatsArray } },
				{ new: true }
			);

			// 3andi tableau data fih les les candidats  ismo candidats
			const passage_test_data = [];
			//lazim injib data min session ily ana faha puis n3adiha l passage_test_data ilkol 	candidat fil candidats bil id imta3o
			for (let i = 0; i < candidats.length; i++) {
				// parcpurir les tests sended in the body

				for (let j = 0; j < s.testes.length; j++) {
					let invited_at = new Date();
					invited_at = `${invited_at.getFullYear()}-${String(
						invited_at.getMonth() + 1
					).padStart(2, "0")}-${String(invited_at.getDate()).padStart(2, "0")}`;

					const test = s.testes[j];
					const data = {
						idTest: test._id,
						idCandidat: candidats[i].Id,
						idOffre: s.Offre._id,
						invited_at: invited_at,
					};

					//	send mail
					const candidat = await User.findById(data.idCandidat);
					SendMAilPourPassTest(candidat);

					const status = "Invité pour un test technique";
					await condidacy.findOneAndUpdate(
						{ user: data.idCandidat, offre: data.idOffre },
						{ $set: { status: status } },
						{ new: true }
					);

					passage_test_data.push(data);
				}
			}
			// console.log(questionsToAdd);
			const sendTestsToCandidats = await PassageTest.insertMany(
				passage_test_data
			);

			res.status(201).json({ success: true, data: sendTestsToCandidats });
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

module.exports = {
	addTest,
	addAutomaticTest,
	getAllTests,
	getTestById,
	deleteTest,
	updateTest,
	deleteAllTest,
	getbyCandidat,
	affecterTestAuCandidat,
	PassTest,
	getTestPasserbyCandidat,
	importAndInviteCandidatsToPassTest,
};
