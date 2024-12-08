const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VueSchema = new Schema({

    nbclicks: {
		type: Number,
	},
    offre: {
        type: Schema.Types.ObjectId,
        ref: 'Offre',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    
});

module.exports = mongoose.model("Vue", VueSchema);
