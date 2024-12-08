const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AntiTricherie = new Schema({
	
	idCandidat: {
		type: String,
	},
	idTest: {
		type: String,
	},
	typeApapreil: {
		type: String,
	},
	emplacement: {
		type: String,
	},
	isFullScreen: {
		type: Boolean,
	},
	isMouseInsideWindow: {
		type: Boolean,
	},
	cameraActivated: {
		type: Boolean,
	},
	vedioNavigateur: {
		type: String,
	},
});

module.exports = mongoose.model("AntiTricherie", AntiTricherie);
