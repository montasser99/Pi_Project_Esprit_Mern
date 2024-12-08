const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    titre: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    image: {
        type: String,
       
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User', 
    }]
});

module.exports = mongoose.model("Collection", collectionSchema);
