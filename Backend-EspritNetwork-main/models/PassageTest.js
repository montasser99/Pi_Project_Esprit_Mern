const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PassageTest = new Schema({
	idOffre: {
		type: String,
	},
	idCandidat: {
		type: String,
	},
	idTest: {
		type: String,
	},
	note: {
		type: Number,
	},
	passed_at: {
		type: Date,
	},
	invited_at: {
		type: Date,
	},
	dateFin: {
		type: Date,
	},
	response: {
		type: Array,
	},
	message: {
		type: String,
	},
	etat: {
		type: Boolean,
		default: false,
	},
	score: { type: Number, default: 0 },
	critere: { type: String },
});

module.exports = mongoose.model("PassageTest", PassageTest);
