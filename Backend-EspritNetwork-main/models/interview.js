const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Interview = new Schema({
	link: {
		type: String,
	},
	date: {
		type: String,
		required: true,
	},
	idCandidat: {
		type: String,
	},
	idOffre: {
		type: String,
	},
});

module.exports = mongoose.model("interview", Interview);
