const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CvSchema = new Schema({
    contact: {
        nom: {
          type: String
        },
        prenom: {
          type: String
        },
        email: {
          type: String
        },
        telephone: {
          type: String
        },
        adresse: {
          type: String
        },
        lienGit: String,
        lienLinkedIn: String,
        imageResume: String,
        titreProfil: String
      },
      biographie: String,
      parcoursProfessionnels: [{
        poste: String,
        dateDebut: Date,
        dateFin: Date,
        entreprise: String,
        description: String
      }],
      parcoursAcademiques: [{
        diplome: String,
        etablissement: String,
        dateDebut: Date,
        dateFin: Date
      }],
      competences: [String],
      langues: [String],
      pourcentage: {
        type: Number,
        default: 0
      },
      
    // here we represente forign key user 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model("Cv", CvSchema);



