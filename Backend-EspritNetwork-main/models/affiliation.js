const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AffiliationSchema = new Schema({
    name: {
        type: String,
    }
});

module.exports = mongoose.model("Affiliation", AffiliationSchema);
