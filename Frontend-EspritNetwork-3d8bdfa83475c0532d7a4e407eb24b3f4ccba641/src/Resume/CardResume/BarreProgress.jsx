import { useEffect, useState } from "react";
import "./BarreProgress.css";
import PropTypes from "prop-types";
import { useParams } from "react-router";

export function BarreProgress({ onProgressChange }) {
	
	const [cvData, setCvData] = useState(null);
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	let user = userId;
	const { id } = useParams();
	if (userInfo.role === "company") {
		user = id;
	}

	
	useEffect(() => {
		fetch(`http://localhost:3000/cv/getCvByUserId/${user}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setCvData(data);
			})
			.catch((error) =>
				console.error("Erreur lors de la récupération des données CV:", error)
			);
	}, []);

	if (!cvData) {
		return <div>Chargement en cours...</div>;
	}

	let completionPercentage = 0;

	const imageCompleted = cvData.contact.imageResume !== null;
	const contactFieldsCompleted =
		cvData.contact.nom &&
		cvData.contact.prenom &&
		cvData.contact.email &&
		cvData.contact.telephone &&
		cvData.contact.adresse &&
		cvData.contact.lienGit &&
		cvData.contact.lienLinkedIn &&
		cvData.contact.titreProfil;
	const biographieCompleted = cvData.biographie;
	const parcoursAcademiquesCompleted =
		cvData.parcoursAcademiques &&
		cvData.parcoursAcademiques.some(
			(item) => item.diplome !== "" || item.etablissement !== ""
		);
	const parcoursProfessionnelsCompleted =
		cvData.parcoursProfessionnels &&
		cvData.parcoursProfessionnels.some(
			(item) =>
				item.poste !== "" || item.entreprise !== "" || item.description !== ""
		);
	const competencesCompleted =
		cvData.competences && cvData.competences.length > 0;
	const languesCompleted = cvData.langues && cvData.langues.length > 0;

	const missingSections = [];
	if (!imageCompleted) missingSections.push("Image");
	if (!contactFieldsCompleted) missingSections.push("Contact");
	if (!biographieCompleted) missingSections.push("Biographie");
	if (!parcoursAcademiquesCompleted)
		missingSections.push("Parcours Académiques");
	if (!parcoursProfessionnelsCompleted)
		missingSections.push("Parcours Professionnels");
	if (!competencesCompleted) missingSections.push("Compétences");
	if (!languesCompleted) missingSections.push("Langues");

	if (imageCompleted) completionPercentage += 10;
	if (contactFieldsCompleted) completionPercentage += 15;
	if (biographieCompleted) completionPercentage += 15;
	if (parcoursAcademiquesCompleted) completionPercentage += 15;
	if (parcoursProfessionnelsCompleted) completionPercentage += 15;
	if (competencesCompleted) completionPercentage += 15;
	if (languesCompleted) completionPercentage += 15;

	console.log(
		"La valeur de progression de votre CV est",
		completionPercentage,
		"%"
	);

	completionPercentage = Math.min(completionPercentage, 100);

	onProgressChange(completionPercentage);

	

	return (
		<div className="progresss ">
			<div
				className="progress-bar"
				role="progressbar"
				style={{ width: `${completionPercentage}%` }}
			>
				{completionPercentage} % est fini
			</div>
			{missingSections.length > 0 && (
				<div className="missing-sections-message col-lg-12 d-flex flex-wrap mb-md-6">
					Merci de compléter{" "}
					{missingSections.length > 0 &&
						(missingSections.length > 1 ? "les" : "la")}{" "}
					{missingSections.length}{" "}
					{missingSections.length > 1 ? "sections" : "section"}{" "}
					{missingSections.length > 1 ? "suivantes" : "suivante"} pour finaliser
					votre CV : {missingSections.join(", ")}
				</div>
			)}
		</div>
	);
}
BarreProgress.propTypes = {
	onProgressChange: PropTypes.func.isRequired,
};
