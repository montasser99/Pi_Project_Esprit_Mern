const Vue = require("../models/vue");
const Offre = require("../models/offre"); 

async function addOrUpdateVue(req, res) {
    try {
        const { nbclicks, offre, user } = req.body;
        
        let vue = await Vue.findOne({ offre, user });
        
        if (vue) {
            // Increment nbclicks by 1 if Vue document exists
            vue.nbclicks += 1;
        } else {
            // Create a new Vue document with nbclicks defaulting to 1
            vue = new Vue({ nbclicks: 1, offre, user }); // Setting nbclicks to 1 by default
        }
        
        await vue.save();
        res.status(200).json({ message: "Vue updated successfully", vue });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}




async function getCountVuebyOffreId(req, res) {
    try {
        const { offreId } = req.query; // Access offreId from query parameters
        
        // Count the number of Vue documents for the given offreId
        const count = await Vue.countDocuments({ offre: offreId });
        
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getAllVue(req, res) {
	try {
		const vue = await Vue.find();
		res.status(200).json(vue);
	} catch (err) {
		res.status(400).json({ error: err });
	}
}

async function getStatistiquesCompetences(req, res) {
    try {
      // Récupérer toutes les offres
      const offres = await Offre.find();
  
      // Initialiser un objet pour stocker le nombre total de vues pour chaque compétence
      const competencesCount = {};
  
      // Parcourir chaque offre
      for (const offre of offres) {
        // Récupérer toutes les vues pour cette offre
        const vues = await Vue.find({ offre: offre._id });
  
        // Récupérer les compétences de l'offre et les séparer
        const competences = offre.competence.split(',');
  
        // Mettre à jour les statistiques pour chaque compétence
        competences.forEach(competence => {
          // Vérifier si cette compétence existe déjà dans les statistiques
          if (competencesCount.hasOwnProperty(competence)) {
            // Si oui, ajouter le nombre de vues à celui existant
            competencesCount[competence] += vues.reduce((total, vue) => total + vue.nbclicks, 0);
          } else {
            // Sinon, initialiser le nombre de vues pour cette compétence
            competencesCount[competence] = vues.reduce((total, vue) => total + vue.nbclicks, 0);
          }
        });
      }
  
      // Calculer le nombre total de vues
      const totalVues = Object.values(competencesCount).reduce((total, count) => total + count, 0);
  
      // Calculer le pourcentage de visibilité de chaque compétence
      const statistiques = Object.entries(competencesCount).map(([competence, count]) => ({
        competence,
        pourcentage: (count / totalVues) * 100
      }));
  
      // Trier les statistiques par pourcentage décroissant
      statistiques.sort((a, b) => b.pourcentage - a.pourcentage);
  
      res.status(200).json(statistiques);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


// async function getVueByIdOffre(req, res) {
// 	try {
//         const vue = await Vue.find();
// 		const vue = await Domaine.findById(req.params.id);
// 		res.status(200).json(domaine);
// 	} catch (err) {
// 		res.status(400).json({ error: err });
// 	}
// }

// async function deleteAllDomaine(req, res) {
// 	try {
// 		await Domaine.find().deleteMany();
// 		res.status(200).json({ message: "All Domaines deleted successfully" });
// 	} catch (err) {
// 		res.status(400).json({ error: err });
// 	}
// }

module.exports = {
	addOrUpdateVue,
	getAllVue,
    getCountVuebyOffreId,
    getStatistiquesCompetences
};
