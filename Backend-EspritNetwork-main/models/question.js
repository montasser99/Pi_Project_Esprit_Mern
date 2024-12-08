const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
	domaine: { type: String },
	categorie: { type: String },
	technologie: { type: String },
	niveau: { type: String },
	titre: { type: String },
	options: {
		type: Array,
		required: true,
	},
});

module.exports = mongoose.model("Question", QuestionSchema);
