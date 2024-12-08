import { useEffect, useState } from "react";
import { CardResume } from "./CardResume/CardResume";
import { PrintPdfResume } from "./PrintCv/PrintPdfResume";
import { PrintPdfResumeCana } from "./PrintCv/PrintPdfResumeCana";
import "./Resume.css";
import { useParams } from "react-router";
import axios from "axios";

export function Resume() {
	const [cvData, setCvData] = useState(null);
	const [error, setError] = useState(null);

	/*sidebar responsive */
	const [isOpen, setIsOpen] = useState(false);
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};
	/*affichage cv  */
	const [isPdfResumeVisible, setIsPdfResumeVisible] = useState(true);
	const togglePdfResume = () => {
		setIsPdfResumeVisible(!isPdfResumeVisible);
	};


	///////////////////////////////////////////
	const [fautes, setFautes] = useState([]);
	const [selectedMot, setSelectedMot] = useState(null);

	// Fonction pour afficher ou masquer les suggestions du mot sélectionné
	const handleMotClick = (motFaux) => {
		setSelectedMot((prevSelectedMot) => (prevSelectedMot === motFaux ? null : motFaux));
	};

	///////////////////////////////////////////

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
			.then((response) => {
				if (!response.ok) {
					throw new Error("CV non trouvé pour cet utilisateur");
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);

				if (!data.contact) {
					const confirmationcontact = window.confirm(
						"Nous ne pouvons pas récupérer vos informations de contact.Veuillez remplir les champs de contact nécessaires."
					);
					if (confirmationcontact) {
						window.location.href = "/resume/modifiercv";
					} else {
						window.location.href = "/";
					}
				}
				setCvData(data);
			})
			.catch((error) => {
				console.error("Erreur lors de la récupération des données CV:", error);
				const confirmation = window.confirm(
					"Vous n'avez pas encore de CV ! Pour postuler et maximiser vos opportunités, il est nécessaire de créer votre CV. Êtes-vous prêt à le faire dès maintenant ?"
				);
				if (confirmation) {
					window.location.href = "/resume/modifiercv";
				}
				setError(error.message);
			});
	}, []);
	////////////////////////////////////////////////////////////////////////////
	useEffect(() => {
		if (cvData) {
			const sections = [
				cvData.biographie,
				cvData.contact.nom,
				cvData.contact.prenom,
				cvData.contact.email,
				cvData.contact.telephone,
				cvData.contact.adresse,
				cvData.contact.lienGit,
				cvData.contact.lienLinkedIn,
				...cvData.parcoursProfessionnels.map(parcourspro =>
					[parcourspro.poste, parcourspro.entreprise, parcourspro.dateDebut, parcourspro.dateFin, parcourspro.description]
				),
				...cvData.parcoursAcademiques.map(parcoursaca =>
					[parcoursaca.diplome, parcoursaca.etablissement, parcoursaca.dateDebut, parcoursaca.dateFin]
				),
				...cvData.competences,
				...cvData.langues
			];

			const texteAVerifier = sections.flat().filter(Boolean).join(' ');

			         detecterFautes(texteAVerifier)
				.then(fautes => {
					console.log('Fautes détectées :', fautes);
					setFautes(fautes);
					console.log('api correction',fautes);
				})

				.catch(error => {
					console.error('Erreur lors de la détection des fautes :', error);
				});
		}
	}, [cvData]);

	if (error) {
		return <div>Erreur: {error}</div>;
	}
	if (error) {
		return <div>Erreur: {error}</div>;
	}

	if (!cvData) {
		return <div>Chargement en cours...</div>;
	}
/////////////////////////////////////// Votre fonction pour détecter les fautes
async function detecterFautes(texte) {
	try {
		const response = await axios.post('http://localhost:3000/cv/detecterfautes', { texte });
		return response.data;
	} catch (error) {
		console.error('Erreur lors de la détection des fautes :', error);
		throw error;
	}
}
/////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////

	

	return (
		<>
			<CardResume />
			<div className="container cv col-lg-12">
				<div className="row col-lg-12 col-md-5 col-sm-5 col-10">
					<nav
						className={`nav-menu nav-menu navbar col-lg-3 ${isOpen ? "active" : ""
							}`}
					>
						<button
							className="navbar-toggler"
							type="button"
							onClick={toggleMenu}
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<ul className={`navbar-nav ${isOpen ? "show" : ""}`}>
							<li className="nav-item">
								<a href="#contact" className="nav-link scrollto ">
									<i className="bx bx-envelope" /> <span> CONTACT</span>
								</a>
							</li>
							<li className="nav-item">
								<a href="#biographie" className="nav-link scrollto">
									<i className="bx bx-user " /> <span> BIOGRAPHIE</span>
								</a>
							</li>
							<li className="nav-item">
								<a href="#parcourprof" className="nav-link scrollto">
									<i className="bx bx-briefcase" />{" "}
									<span> PARCOURS PROFESSIONNELS</span>
								</a>
							</li>
							<li className="nav-item">
								<a href="#parcouracademique" className="nav-link scrollto">
									<i className="bx bx-book" /> <span> PARCOURS ACADÉMIQUE</span>
								</a>
							</li>
							<li className="nav-item">
								<a href="#competences" className="nav-link scrollto">
									<i className="bx bx-award" /> <span> COMPÉTENCES</span>
								</a>
							</li>
							<li className="nav-item d-none d-sm-block">
								<a href="#langue" className="nav-link scrollto">
									<i className="bx bx-globe" /> <span> LANGUES</span>
								</a>
							</li>
						</ul>
					</nav>

					<main id="main" className="col-lg-9 ">
						<section id="resume" className="resume">
							<div className="resume-item">
								<div className="col-lg-12">
									<div className="card">
										<div className="resume-section mx-4 ">
											<section
												id="contact"
												className="contact col-lg-12 col-md-9 col-sm-6 col-4"
											>
												<div className="row">
													<div className="col-lg-2 ">
														<p className="n-title">CONTACT</p>
													</div>
													<div className="col-lg-10">
														<hr className="red-hr" />
													</div>
												</div>
												<div className="row">
													<div className="col">
														<p className="cv-section-content">
															<strong>Nom :</strong> {cvData.contact.nom}
															<br />
															<strong>Prénom :</strong> {cvData.contact.prenom}
															<br />
															<strong>Email :</strong> {cvData.contact.email}
															<br />
															<strong>Téléphone :</strong>
															{cvData.contact.telephone}
															<br />
															<strong>Adresse :</strong>{" "}
															{cvData.contact.adresse}
															<br />
															<strong>Lien Git:</strong>{" "}
															{cvData.contact.lienGit}
															<br />
															<strong>Lien LinkedIn :</strong>{" "}
															{cvData.contact.lienLinkedIn}
															<br />
														</p>
													</div>
												</div>
											</section>

											<section
												id="biographie"
												className="biographie col-lg-12 col-md-9 col-sm-6 col-4"
											>
												<div className="row">
													<div className="col-lg-2">
														<p className="n-title">BIOGRAPHIE</p>
													</div>
													<div className="col-lg-10">
														<hr className="red-hr" />
													</div>
													<div className="col">
														<p className="cv-section-content">
															{cvData.biographie}
														</p>
													</div>
												</div>
											</section>

											<section
												id="parcourprof"
												className="parcourprof col-lg-12 col-md-9 col-sm-6 col-4"
											>
												<div className="row ">
													<div className="col-lg-4">
														<p className="n-title">PARCOURS PROFESSIONNELS</p>
													</div>
													<div className="col-lg-8 ">
														<hr className="red-hr" />
													</div>
													<div className="col">
														{cvData.parcoursProfessionnels.map(
															(parcourspro, index) => (
																<div key={index}>
																	<p className="cv-section-content">
																		<strong>Poste :</strong> {parcourspro.poste}
																		<br />
																		<strong>Entreprise :</strong>{" "}
																		{parcourspro.entreprise}
																		<br />
																		<strong>Période :</strong>{" "}
																		{parcourspro.dateDebut &&
																			parcourspro.dateFin
																			? `${parcourspro.dateDebut.substring(
																				0,
																				10
																			)} jusqu'à ${parcourspro.dateFin.substring(
																				0,
																				10
																			)}`
																			: parcourspro.dateDebut
																				? `${parcourspro.dateDebut.substring(
																					0,
																					10
																				)} jusqu'à présent`
																				: parcourspro.dateFin
																					? `jusqu'à ${parcourspro.dateFin.substring(
																						0,
																						10
																					)}`
																					: "Dates non spécifiées"}
																		<br />
																		<strong>Description :</strong>{" "}
																		{parcourspro.description}
																	</p>
																	{index !==
																		cvData.parcoursProfessionnels.length -
																		1 && <hr />}
																</div>
															)
														)}
													</div>
												</div>
											</section>

											<section
												id="parcouracademique"
												className="parcouracademique col-lg-12 col-md-9 col-sm-6 col-4"
											>
												<div className="row">
													<div className="col-lg-4">
														<p className="n-title">PARCOURS ACADÉMIQUES</p>
													</div>
													<div className="col-lg-8">
														<hr className="red-hr" />
													</div>
													<div className="col">
														{cvData.parcoursAcademiques.map(
															(parcoursaca, index) => (
																<div key={index}>
																	<p className="cv-section-content">
																		<strong>Diplôme :</strong>{" "}
																		{parcoursaca.diplome}
																		<br />
																		<strong>Établissement :</strong>{" "}
																		{parcoursaca.etablissement}
																		<br />
																		<strong>Période :</strong>{" "}
																		{parcoursaca.dateDebut &&
																			parcoursaca.dateFin
																			? `${parcoursaca.dateDebut.substring(
																				0,
																				10
																			)} jusqu'à ${parcoursaca.dateFin.substring(
																				0,
																				10
																			)}`
																			: parcoursaca.dateDebut
																				? `${parcoursaca.dateDebut.substring(
																					0,
																					10
																				)} jusqu'à présent`
																				: parcoursaca.dateFin
																					? `jusqu'à ${parcoursaca.dateFin.substring(
																						0,
																						10
																					)}`
																					: "Dates non spécifiées"}
																	</p>
																	{index !==
																		cvData.parcoursAcademiques.length - 1 && (
																			<hr />
																		)}
																</div>
															)
														)}
													</div>
												</div>
											</section>

											<section
												id="competences"
												className="competences col-lg-12 col-md-9 col-sm-6 col-4"
											>
												<div className="row">
													<div className="col-lg-2 ">
														<p className="n-title">COMPÉTENCES</p>
													</div>
													<div className="col-lg-10">
														<hr className="red-hr" />
													</div>
													{cvData.competences.map((competence, index) => (
														<div
															className="col-lg-3 col-md-2  col-9"
															key={index}
														>
															<p className="cv-section-content">{competence}</p>
														</div>
													))}
												</div>
											</section>

											<section
												id="langue"
												className="langue col-lg-12 col-md-9 col-sm-6 col-4"
											>
												<div className="row">
													<div className="col-lg-2">
														<p className="n-title">LANGUES</p>
													</div>
													<div className="col-lg-10">
														<hr className="red-hr" />
													</div>
													{cvData.langues.map((langue, index) => (
														<div
															className="col-lg-3 col-md-2  col-9"
															key={index}
														>
															<p className="cv-section-content">{langue}</p>
														</div>
													))}
												</div>
											</section>
										</div>
									</div>
								</div>
							</div>
						</section>
					</main>
				</div>
			</div>

			<div className="container">
				<div className="row justify-content-center">
					<div className="col-12 text-center mb-4">
						<button className="switch-button" onClick={togglePdfResume}>
							{isPdfResumeVisible
								? "Obtenir le modéle Canadien"
								: "Obtenir le modéle Standard "}
						</button>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-md-8">
						{isPdfResumeVisible ? (
							<PrintPdfResume cvData={cvData} />
						) : (
							<PrintPdfResumeCana cvData={cvData} />
						)}
					</div>
				</div>
			</div>

			<div className="container mt-5 mx-6">
				<div className="row justify-content-center">
					<div className="col-md-10">
						<div className="card animated">
							<div className="card-headercorrect">Les Fautes Détectées :</div>
							<div className="card-body-corection">
								<ul className='corre'>
									{fautes.map((faute, index) => (
										<li key={index}>
											<strong>Attention Le mot <span className="text-danger">{faute.motFaux}</span> :</strong> <strong>{faute.message}</strong>
											{selectedMot === faute.motFaux && (
												<ol >
													{faute.suggestions.map((suggestion, index) => (
														<li key={index}>{suggestion}</li>
													))}
												</ol>
											)}
											<span className=" masq text-danger" style={{ cursor: 'pointer', }} onClick={() => handleMotClick(faute.motFaux)}>
												{selectedMot === faute.motFaux ? 'Masquer les suggestions' : 'Voir les suggestions'}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>


		</>
	);
}
