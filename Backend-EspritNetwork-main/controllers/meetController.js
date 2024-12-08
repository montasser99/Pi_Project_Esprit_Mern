
const { authorize, createSpace } = require("../meet");

async function PlanifierEntretien(req, res) {
	try {
		
		// Authorize and create meeting space
		const authClient = await authorize();
		const link = await createSpace(authClient);

		
		res
			.status(201)
			.json({ message: "interview added successfully", link });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
module.exports = {
	PlanifierEntretien,
};
