const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DomaineSchema = new Schema({
	name: {
		type: String,
	},
});

module.exports = mongoose.model("Domaine", DomaineSchema);
