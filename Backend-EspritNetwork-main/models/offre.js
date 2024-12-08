const mongoose = require("mongoose");
const Condidacy = require('../models/condidacy');

const Schema = mongoose.Schema;

const OffreSchema = new Schema({
    titre: {
        type: String,
        required: true,
    },
    typeoffre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    competence: {
        type: String,
        required: true, 
    },
    typecontrat: {
        type: String,
        required: true,
    },
    salaire: {
        type: Number,
    },
    langue: {
        type: String,
    },
    experience: {
        type: String,
    },
    statusOffre: {
        type: Boolean,
        default:true
    },
    dateExpiration:{
        type: Date
    },
    // here we represente forign key test
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    // here we represente forign key user 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

//on delete cascade pour le condidature
OffreSchema.pre('findOneAndDelete', async function (next) {
    try {
      const offreId = this.getQuery()._id;
      await Condidacy.deleteMany({ offre: offreId });
      console.log(`Deleted Condicacy documents associated with Offre: ${offreId}`);
      next();
    } catch (err) {
      console.error('Error deleting associated Condicacy documents:', err);
      next(err); // Pass error to the next middleware
    }
  });
  

module.exports = mongoose.model("Offre", OffreSchema);
