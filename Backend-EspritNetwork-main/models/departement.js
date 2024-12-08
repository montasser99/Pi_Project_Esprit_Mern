const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DepartementSchema = new Schema({
	specialite: {
		type: String,
	},
	options: {
		type: [String],
	},
});

module.exports = mongoose.model("Departement", DepartementSchema);
