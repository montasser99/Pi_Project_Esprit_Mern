const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TestSchema = new Schema({
	domaine: { type: String },
	categorie: { type: String },
	technologie: { type: String },
	description: { type: String },
	duree: {
		type: Number,
		required: true,
	},
	questions: { type: Array },
});

module.exports = mongoose.model("Test", TestSchema);
