const mongoose = require("mongoose");

const sessionModel = new mongoose.Schema({
	companyID: { type: String },
	nom: {
		type: String,
	},
	Offre: { type: Object },
	testes: { type: Array },
	candidats: {
		type: Array,
	},
});

module.exports = mongoose.model("session ", sessionModel);
