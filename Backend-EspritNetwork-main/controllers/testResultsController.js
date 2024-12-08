const Test = require("../models/test");
const Offre = require("../models/offre");
const User = require("../models/user");
const AntiCheating = require("../models/antiTricherie");
const PassageTest = require("../models/PassageTest");

const Condidacy = require("../models/condidacy");

async function getResultTestsByOffre(req, res) {
	try {
		const { idOffre } = req.query;
		const resultat = await PassageTest.find({ idOffre: idOffre });
		console.log(resultat);
		res.status(200).json(resultat);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getAllResultsTests(req, res) {
	try {
		/* return  tab contient :
               nom de candidat, nom de test, note de test, id de test, id de candidat , id de l'offre et titele de l'offre		
        */
		const resTests = await PassageTest.aggregate([
			{
				$lookup: {
					from: "tests",
					let: { testId: { $toObjectId: "$idTest" } },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$testId"] } } },
						{ $project: { _id: 0, technologie: 1, questions: 1 } },
					],
					as: "test",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { userId: { $toObjectId: "$idCandidat" } },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
						{ $project: { _id: 0, name: 1, email: 1 } },
					],
					as: "candidat",
				},
			},
			{
				$lookup: {
					from: "offres",
					let: { offreId: { $toObjectId: "$idOffre" } },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$offreId"] } } },
						{
							$project: {
								titre: 1,
								typeoffre: 1,
								created_at: {
									$dateToString: { format: "%Y-%m-%d", date: "$created_at" },
								},
							},
						},
					],
					as: "offre",
				},
			},
			// Convert candidat, test, and offre arrays to objects
			{
				$addFields: {
					candidat: { $arrayElemAt: ["$candidat", 0] },
					test: { $arrayElemAt: ["$test", 0] },
					offre: { $arrayElemAt: ["$offre", 0] },
				},
			},
			// Additional stages or project stage if needed
		]);

		res.status(200).json(resTests);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getResultTestbyCandidatAndOffre(req, res) {
	try {
		console.log("getResultTestbyCandidatAndOffre");
		const { idCandidat, idOffre, idTest } = req.query;
		console.log("idCandidat", idCandidat);
		console.log("idOffre", idOffre);
		// form passagetest get score of the test selelement
		const resultat = await PassageTest.findOne({
			idCandidat: idCandidat,
			idOffre: idOffre,
			idTest: idTest,
		}).select("score idTest idCandidat idOffre");

		console.log(resultat);
		res.status(200).json(resultat);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}
async function rapportCandidat(req, res) {
	try {
		const { idCandidat, idOffre } = req.query;

		const data = await PassageTest.aggregate([
			{
				$match: {
					idCandidat: idCandidat,
					idOffre: idOffre,
				},
			},
			{
				$lookup: {
					from: "tests",
					let: { testId: { $toObjectId: "$idTest" } },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$testId"] } } },
						{
							$project: {
								_id: 1,
								technologie: 1,
								questions: 1,
								description: 1,
							},
						},
					],
					as: "test",
				},
			},
			{
				$lookup: {
					from: "users",
					let: { userId: { $toObjectId: "$idCandidat" } },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
						{ $project: { _id: 0, name: 1, email: 1 } },
					],
					as: "candidat",
				},
			},
			{
				$lookup: {
					from: "offres",
					let: { offreId: { $toObjectId: "$idOffre" } },
					pipeline: [
						{ $match: { $expr: { $eq: ["$_id", "$$offreId"] } } },
						{
							$project: {
								titre: 1,
								description: 1,
								typeoffre: 1,
								salaire: 1,
								typecontrat: 1,
								competence: 1,
								langue: 1,
								created_at: {
									$dateToString: { format: "%Y-%m-%d", date: "$created_at" },
								},
							},
						},
					],
					as: "offre",
				},
			},

			// Convert candidat, test, and offre arrays to objects
			{
				$addFields: {
					candidat: { $arrayElemAt: ["$candidat", 0] },
					test: { $arrayElemAt: ["$test", 0] },
					offre: { $arrayElemAt: ["$offre", 0] },
				},
			},

			// Group by candidat and offre and push tests into an array
			{
				$group: {
					_id: {
						candidat: "$candidat",
						offre: "$offre",
					},
					tests: { $push: "$test" },
					passagetests: { $push: "$$ROOT" },
				},
			},
			// Project to reshape the document
			{
				$project: {
					_id: 0,
					candidat: "$_id.candidat",
					offre: "$_id.offre",
					tests: 1,
					passagetests: 1,
				},
			},
		]);

		const candidatures = await Condidacy.find();
		const candidature = candidatures.filter(
			(c) => c.user.toString() === idCandidat && c.offre.toString() === idOffre
		);
		//if candidature not found  add new candidature to the candidature collection
		if (candidature.length === 0) {
			const newCandidature = new Condidacy({
				user: idCandidat,
				offre: idOffre,
			});
			await newCandidature.save();
		}
		let passageTest = data[0].passagetests;
		// Créez un tableau de promesses pour chaque appel à AntiCheating.find
		const promises = passageTest.map(async (element) => {
			return AntiCheating.find({
				idCandidat: element.idCandidat,
				idTest: element.idTest,
			});
		});

		// Utilisez Promise.all pour attendre que toutes les promesses soient résolues
		const antiCheatingData = await Promise.all(promises);

		// Flattening the array of arrays into a single array of objects
		const antiCheating = antiCheatingData.flat();

		console.log("antiCheating:", antiCheating);

		res.status(200).json({ data, candidature, antiCheating });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
}

module.exports = {
	getAllResultsTests,
	getResultTestsByOffre,
	rapportCandidat,
	getResultTestbyCandidatAndOffre,
};
