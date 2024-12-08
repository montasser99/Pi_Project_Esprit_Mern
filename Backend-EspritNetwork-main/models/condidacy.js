const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CondidacySchema = new Schema({
	date_postule: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		default: "en attend",
	},
	affiliation: {
		type: String,
	},
	document: {
		type: String,
	},
	specialite: {
		type: String,
	},
	option: {
		type: String,
	},
	anneediplome: {
		type: String,
	},
	// here we represente forign key user
	user: {
		type: String,
		ref: "User",
	},
	// here reference foreign key of Offre
	offre: {
		type: String,
		ref: "Offre",
	},
});

module.exports = mongoose.model("Condidacy", CondidacySchema);
