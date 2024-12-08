import { useEffect, useState } from "react";
import { BsFilter, BsSearch } from "react-icons/bs";
import "../Selection.css";
import Modal from "react-modal";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ReactPaginate from "react-paginate";

export function Candidates() {
	const navigate = useNavigate();
	const [candidates, setCandidates] = useState([]);

	const [collections, setCollections] = useState([]);
	const [offres, setOffres] = useState([]);
	const [selectedCandidate, setSelectedCandidate] = useState(null);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [popupOpen, setPopupOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isUserRegistered, setIsUserRegistered] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [CVs, setCvs] = useState();
	const [showAllCompetences, setShowAllCompetences] = useState(false);
	const [theme, setTheme] = useState("light");
	const [activities, setActivities] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [visibleActivities, setVisibleActivities] = useState(5);
	const [showAll, setShowAll] = useState(false);
	const [sortedActivities, setSortedActivities] = useState(null);
	const [sortByDate, setSortByDate] = useState(false);
	const [showMessageForm, setShowMessageForm] = useState(false);

	const toggleShowAll = () => {
		setShowAll(!showAll);
		if (!showAll) {
			setVisibleActivities(activities.length);
		} else {
			setVisibleActivities(5);
		}
	};

	const [compteVerified, setCompteVerified] = useState(false);

	const handleCheckboxChange = async (e) => {
		const isChecked = e.target.checked;
		setCompteVerified(isChecked);

		if (isChecked) {
			try {
				const response = await axios.get(
					"http://localhost:3000/condidacy/getverifiedCondidacy",
					{
						params: {
							offreId: id, // Pass offreId as a query parameter
						},
					}
				);
				console.log("compte verified", compteVerified);
				setCandidates(response.data); // Assuming the response contains the list of verified candidates
			} catch (error) {
				console.error("Error fetching verified candidates:", error);
			}
		} else {
			// If the checkbox is unchecked, fetch data from another endpoint
			try {
				const response = await axios.get(
					`http://localhost:3000/condidacy/getbyidoffre/${id}`
				);
				console.log(response.data);
				console.log("compte verified", compteVerified);
				setCandidates(response.data);
			} catch (error) {
				console.error("Error fetching candidates:", error);
			}
		}
	};

	const handleSearchTermChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const filterCandidatesByName = (candidates, searchTerm) => {
		if (!searchTerm) return candidates; // Si le searchTerm est vide, retourne tous les candidats
		return candidates.filter((candidate) => {
			if (candidate.user && Array.isArray(candidate.user)) {
				// Vérifie si candidate.user est une liste
				// Parcourt la liste des utilisateurs associés au candidat
				for (let i = 0; i < candidate.user.length; i++) {
					const user = candidate.user[i];
					if (
						user.name &&
						user.name.toLowerCase().includes(searchTerm.toLowerCase())
					) {
						return true; // Retourne true si le nom de l'utilisateur correspond au searchTerm
					}
				}
			} else if (candidate.user && candidate.user.name) {
				// Si candidate.user est un seul utilisateur
				return candidate.user.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			}
			return false; // Retourne false si aucun utilisateur ne correspond
		});
	};

	// Au moment d'ajouter une nouvelle activité à l'historique
	const addActivity = (type, details) => {
		const timestamp = new Date().toLocaleString();
		const newActivity = { type, timestamp, details };
		const updatedActivities = [...activities, newActivity];
		setActivities(updatedActivities);

		// Sauvegarde des données d'historique mises à jour dans le stockage local
		localStorage.setItem("activities", JSON.stringify(updatedActivities));
	};

	useEffect(() => {
		// Vérifie s'il existe des données d'historique sauvegardées dans le stockage local
		const storedActivities = localStorage.getItem("activities");
		if (storedActivities) {
			// Si des données sont présentes, les utilise comme données initiales pour l'historique
			setActivities(JSON.parse(storedActivities));
		} else {
			// Sinon, initialise l'historique avec un tableau vide
			setActivities([]);
		}
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	const openModal = (candidate) => {
		setSelectedCandidate(candidate);
		setModalIsOpen(true);
	};

	const handleMailButtonClick = () => {
		// Afficher le formulaire d'envoi de message lorsque le bouton "Mail" est cliqué
		setShowMessageForm(true);
	};

	const filteredCollections = collections.filter((collection) =>
		collection.titre.toLowerCase().includes(searchValue.toLowerCase())
	);

	const { id } = useParams();
	useEffect(() => {
		console.log(id);
		const getCollections = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/collection/getAll"
				);
				setCollections(response.data);
				localStorage.setItem("collections", JSON.stringify(response.data));
			} catch (error) {
				console.error("Error fetching collections:", error);
			}
			useEffect(() => {
				// Vérifie s'il existe des données sauvegardées dans le stockage local
				const storedCollections = localStorage.getItem("collections");
				if (storedCollections) {
					// Si des données sont présentes, les utilise comme données initiales
					setCollections(JSON.parse(storedCollections));
				} else {
					// Sinon, récupère les données depuis le serveur
					getCollections();
				}
			}, []);
		};

		getCollections();

		const getcompetences = async () => {
			try {
				const offerId = id;

				const response = await axios.get(`http://localhost:3000/offre/getbyid/${offerId}`);

				// Vérifiez si la réponse contient des données et si le champ compétence est une chaîne de caractères
				if (response.data && typeof response.data.competence === 'string') {
					// Si oui, split la chaîne en un tableau en utilisant la virgule comme séparateur
					const competencesArray = response.data.competence.split(',');
					// Initialisez l'état 'offres' avec le tableau résultant
					setOffres(competencesArray);
					console.log("monta", competencesArray)
				} else {
					// Sinon, les données de réponse ne sont pas valides, affichez un message d'erreur
					console.error("Invalid response data:", response.data);
				}
			} catch (error) {
				console.error("Error fetching competences:", error);
			}
		};




		getcompetences();

		const getuserbycandidacy = async () => {
			try {
				const offerId = id;
				const response = await axios.get(
					`http://localhost:3000/condidacy/getbyidoffre/${offerId}`
				);
				setCandidates(response.data);
				candidates.forEach((candidate) => {
					console.log(candidate.user.name);
				});
			} catch (error) {
				console.error("Error fetching candidates:", error);
			}
		};
		getuserbycandidacy();

		const getCvbyUser = async () => {
			try {
				const response = await axios.get(`http://localhost:3000/cv/getall`);
				setCvs(response.data);

				console.log("Compétences:", CVs.competences);
			} catch (error) {
				console.error("Error fetching candidates:", error);
			}
		};
		getCvbyUser();

		const candidateIds = candidates.map((candidate) => candidate.user._id);
		candidateIds.forEach((userId) => {
			const isAssigned = localStorage.getItem(userId);
			if (isAssigned !== null) {
				updateCandidateAssignment(userId, isAssigned === "true");
			}
		});
	}, []);

	const getCollectionNameById = (collectionId) => {
		const collection = collections.find(
			(collection) => collection._id === collectionId
		);
		return collection ? collection.titre : "Collection introuvable";
	};

	const handleSkillCheckboxChange = (competence) => {
		if (selectedSkills.includes(competence)) {
			setSelectedSkills(selectedSkills.filter((skill) => skill !== competence));
		} else {
			setSelectedSkills([...selectedSkills, competence]);
		}
	};

	const filterCandidates = (candidates) => {
		if (selectedSkills.length === 0) {
			return candidates;
		} else {
			return candidates.filter((candidate) => {
				// Retrieve the competences of the current candidate
				const candidateCompetences =
					CVs.find((cv) => cv.user === candidate.user._id)?.competences || [];
				// Check if any of the candidate's competences match the selected skills
				return selectedSkills.some((skill) =>
					candidateCompetences.some(
						(candidateSkill) =>
							candidateSkill.trim().toLowerCase() === skill.trim().toLowerCase()
					)
				);
			});
		}
	};

	const handleBookIconClick = (candidate) => {
		setSelectedUser(candidate.user);
		setPopupOpen(true);
	};
	useEffect(() => {
		console.log("selectedUser:", selectedUser);
	}, [selectedUser]);

	// Mise à jour de l'état local et du localStorage lorsque le candidat est affecté à une collection
	const handleAssignToCollection = async (collectionId) => {
		try {
			if (!selectedUser || !selectedUser._id) {
				console.error(
					"Aucun utilisateur sélectionné ou ID d'utilisateur non défini."
				);
				return;
			}
			const collectionName = getCollectionNameById(collectionId);
			const userId = selectedUser._id;
			const response = await axios.post(
				`http://localhost:3000/collection/assign/${collectionId}/${userId}`
			);
			console.log(response.data);

			// Mettre à jour l'état local
			setIsUserRegistered(true);
			updateCandidateAssignment(selectedUser._id, true);

			// Mettre à jour le localStorage
			localStorage.setItem(selectedUser._id, true);

			setPopupOpen(false);
			toast.success("Candidat affecté avec succès!");
			setErrorMessage("");
			const activity = {
				type: "assign_to_collection",
				timestamp: new Date().toLocaleString(),
				details: `Vous avez affecté le candidat <strong>${selectedUser.name}</strong> à la collection "<strong>${collectionName}</strong>" le  `,
			};

			const updatedActivities = [...activities, activity];
			setActivities(updatedActivities);
			localStorage.setItem("activities", JSON.stringify(updatedActivities));
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				toast.error(error.response.data.message);
			} else {
				setErrorMessage(
					'Une erreur s"est produite lors de la tentative d"affectation de l"utilisateur à la collection'
				);
			}
		}
	};
	// Utilisez useEffect pour surveiller les changements dans le stockage local
	useEffect(() => {
		candidates.forEach((candidate) => {
			const storedValue = localStorage.getItem(candidate.user._id);
			const isAssigned = storedValue ? storedValue === "true" : false;
			if (candidate.isAssigned !== isAssigned) {
				setCandidates((prevCandidates) =>
					prevCandidates.map((c) =>
						c.user._id === candidate.user._id ? { ...c, isAssigned } : c
					)
				);
			}
		});
	}, [candidates]);

	const updateCandidateAssignment = (userId, isAssigned) => {
		setCandidates((prevCandidates) =>
			prevCandidates.map((candidate) =>
				candidate.user._id === userId ? { ...candidate, isAssigned } : candidate
			)
		);

		localStorage.setItem(userId, isAssigned.toString());
	};

	const filteredCandidates = filterCandidates(candidates).filter(
		(candidate) => filterCandidatesByName([candidate], searchTerm).length > 0
	);

	const handlePageChange = ({ selected }) => {
		setCurrentPage(selected);
	};
	const candidatesPerPage = 5;
	const pageCount = Math.ceil(candidates.length / candidatesPerPage);
	const indexOfLastCandidate = (currentPage + 1) * candidatesPerPage;
	const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
	const currentCandidates = filterCandidates(filteredCandidates).slice(
		indexOfFirstCandidate,
		indexOfLastCandidate
	);

	const handlePlanInterview = async (userId, userEmail) => {
		try {
			const response = await axios.post("http://localhost:3000/meet/planifier");
			const { link } = response.data;

			const emailContent = `
                <body>
                    <table width="100%">
                        <tr>
                            <td style="padding: 20px 0; background-color: #000000">
                                <a
                                    target="_blank"
                                    style="
                                        text-decoration: none;
                                        color: #fff;
                                        display: flex;
                                        align-items: start;
                                        justify-content: start;
                                    "
                                >
                                    <img src="https://i.postimg.cc/qR5fh0QH/logo-network.png"
                                    width="70px" height="70px" alt="Esprit Network auto" style="display:
                                    block; border: 0 ; padding: 10px;" />
                                    <h1>Esprit Network</h1>
                                </a>
                            </td>
                        </tr>
                        <tr style="background: #fff">
                            <td style="padding: 20px">
                                <p style="margin: 2; font-size: 14px; color: #000000">
                                    Bonjour ${userEmail},<br /><br />
                                    Nous sommes ravis de vous informer que votre candidature a été retenue ! \n\nVous êtes invité à rejoindre un entretien. Voici le lien de la réunion : <a href="${link}" target="_blank">lien de la réunion</a> <br /><br /> <br />
                                    Cordialement, <br /><br />
                                    L’équipe Esprit Network
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
            `;

			// Envoi du lien de la réunion par e-mail au candidat
			const emailResponse = await axios.post(
				"http://localhost:3000/send-email",
				{
					recipient: userEmail,
					subject: "Invitation à l'entretien",
					html: emailContent,
				}
			);

			// Vérifiez si l'e-mail a été envoyé avec succès
			if (emailResponse.status === 200) {
				console.log("E-mail envoyé avec succès au candidat :", userEmail);
			} else {
				console.error(
					"Erreur lors de l'envoi de l'e-mail au candidat :",
					userEmail
				);
			}

			// Utilisez le lien de la réunion comme vous le souhaitez
			console.log("Lien de la réunion :", link);
			// Par exemple, rediriger l'utilisateur vers le lien de la réunion
			window.location.href = link;
		} catch (error) {
			console.error("Erreur lors de la planification de l'entretien :", error);
			// Gérer les erreurs ici
		}
	};

	const goToTest = (id) => {
		localStorage.setItem("idCandidat", JSON.stringify(id));
		navigate(`/evalution/test/lister`);
	};
	return (
		<>
			{/* ======= Selection Section ======= */}
			<ToastContainer />
			<section id="services" className={`services section-bg ${theme}`}>
				<div className="container" data-aos="fade-up">
					<div className="title">
						<div className={`title ${theme === "dark" ? "dark" : ""}`}>
							<h2>Liste des candidatures</h2>
						</div>
					</div>

					<section id="candidates">
						<div className="container py-1 ">
							<div className="row py-1">
								<div className="input-group py-1 mb-3">
									<span className="input-group-text">
										<BsSearch />
									</span>
									<input
										type="text"
										className="form-control"
										placeholder="Search candidates by name"
										value={searchTerm}
										onChange={handleSearchTermChange}
									/>

									<button className="btn btn-danger" type="button">
										Search
									</button>
								</div>

								{compteVerified && (
									<div
										className="d-flex align-items-center"
										style={{
											top: "1px",
											left: "10px",
											fontSize: "1.5rem",
											color: "black",
										}}
									>
										Comptes complet
										<i className="bi bi-patch-check-fill custom-icon ms-2"></i>
									</div>
								)}

								<div className="col-lg-3">
									<div className="cardd bg-light border border-danger">
										<div className="card-body">
											<h4 className="card-title text-dark text-center mb-4">
												Filtrer
											</h4>

											<ul className="list-group list-group-flush">
												<h5> . Verification</h5>
												<li className="list-group-item d-flex justify-content-between align-items-center">
													<div className="d-flex align-items-center">
														Comptes complet
														<i className="bi bi-patch-check-fill custom-icon ms-2"></i>
													</div>
													<input
														type="checkbox"
														className="form-check-input"
														id="checkbox2"
														checked={compteVerified}
														onChange={(e) => {
															handleCheckboxChange(e);
														}}
													/>
												</li>
											</ul>
											<hr />

											<ul className="list-group list-group-flush">
												<h5> . Compétences</h5>
												{offres.map((offre, index) => (
													<li
														key={index}
														className="list-group-item d-flex justify-content-between align-items-center"
													>
														{offre}
														<input
															type="checkbox"
															className="form-check-input"
															checked={selectedSkills.includes(offre)}
															onChange={() => handleSkillCheckboxChange(offre)}
														/>
													</li>
												))}
											</ul>

										</div>
									</div>
								</div>
								<div className="col-lg-9">
									<div className="row row-cols-1 row-cols-md-3 g-4 py-1">
										{candidates.length === 0 ? (
											<div className="empty-collection-container">
												<i className="bi bi-exclamation-triangle"></i>
												<p className="empty-collection">
													Aucune Postule Pour Cette Offre.
												</p>
												<i className="bi bi-exclamation-triangle"></i>
											</div>
										) : (
											currentCandidates.map((candidate) => (
												<div key={candidate.id} className="col">
													<div className="member">
														<div className="mx-4">
															{candidate.offre.statusOffre ? (
																<>
																	{candidate.isAssigned ? (
																		<i
																			className="bi bi-bookmark-check-fill"
																			onClick={() =>
																				handleBookIconClick(candidate)
																			}
																			style={{
																				position: "absolute",
																				top: "10px",
																				left: "10px",
																				fontSize: "1.5rem",
																				cursor: "pointer",
																			}}
																		></i>
																	) : (
																		<i
																			className="bi bi-bookmark border-dark rounded p-1"
																			onClick={() =>
																				handleBookIconClick(candidate)
																			}
																			style={{
																				position: "absolute",
																				top: "10px",
																				left: "10px",
																				fontSize: "1.5rem",
																				cursor: "pointer",
																			}}
																		></i>
																	)}
																	<i
																		className="bi bi-person-lines-fill bi-xl"
																		onClick={() => openModal(candidate)}
																		style={{
																			position: "absolute",
																			top: "10px",
																			right: "10px",
																			fontSize: "1.5rem",
																			cursor: "pointer",
																		}}
																	></i>
																	<div
																		onClick={() =>
																			redirectToCandidatePage(candidate.id)
																		}
																	>
																		<div>
																			{candidate.user.pic ? (
																				<img
																					src={candidate.user.pic}
																					className="card-img-top rounded-top "
																					alt={`Image de ${candidate.name}`}
																					style={{
																						display: "flex",
																						justifyContent: "center",
																						marginLeft:"35px",
																						alignItems: "center",
																						width: "180px", // Set the desired width
																						height: "180px", // Set the desired height
																						borderRadius: "10px", // Ensure the border radius is applied to the container
																						overflow: "hidden", // Hide any content that overflows the container
																					}}
																				/>
																			) : (
																				<img
																					src="../../public/assets/img/team/Avatar.jpg"
																					className=" img-fluid w-50 ms-5 ps-3 mt-5 "
																					alt="Image par défaut"
																				/>
																			)}
																		</div>
																		<br />
																		<h5
																			className="card-title"
																			style={{
																				marginBottom: "5px",
																				marginRight: "10px",
																			}}
																		>
																			{candidate.user.name}
																		</h5>
																		<p
																			className="card-text"
																			style={{ marginBottom: "5px" }}
																		>
																			{candidate.user.email}
																		</p>
																		<div>
																			{/* Render competences from CVs where CVs.user._id matches candidate.user._id */}
																			<div
																				className="d-flex flex-wrap justify-content-center"
																				style={{ marginBottom: "10px" }}
																			>
																				{CVs.filter(
																					(cv) => cv.user === candidate.user._id
																				).map((cv) => (
																					<div key={cv._id}>
																						{cv.competences.map(
																							(competence, index) => (
																								<span
																									key={index}
																									className="badge border border-secondary text-black rounded-pill m-1"
																								>
																									{competence}
																								</span>
																							)
																						)}
																					</div>
																				))}
																			</div>
																		</div>
																		<a
																			href="#"
																			className="btn btn-link text-dark align-right ms-1 "
																			onClick={() =>
																				setShowAllCompetences(
																					(prevState) => !prevState
																				)
																			}
																		>
																			{showAllCompetences ? "-Moins" : "+Plus"}
																		</a>
																	</div>
																	<a href="#">
																		<i
																			className="bi bi-eye-fill"
																			style={{
																				position: "absolute",
																				bottom: "1px",
																				left: "10px",
																				fontSize: "1.5rem",
																				color: "black",
																			}} onClick={() =>
																				window.open(`/resume/${candidate.user._id}`, "_blank")
																			}
																		></i>
																	</a>
																</>
															) : (
																<div className="offer-not-true">
																	<div
																		onClick={() =>
																			redirectToCandidatePage(candidate.id)
																		}
																	>
																		<div>
																			{candidate.pic ? (
																				<img
																					src={candidate.pic}
																					className="card-img-top rounded-top "
																					alt={`Image de ${candidate.name}`}
																					style={{
																						width: "100%",
																						display: "block",
																						borderRadius: "10px 10px 0 0",
																					}}
																				/>
																			) : (
																				<img
																					src="../../public/assets/img/team/Avatar.jpg"
																					className=" img-fluid w-50 ms-5 ps-3 mt-5 "
																					alt="Image par défaut"
																				/>
																			)}
																		</div>
																		<br />
																		<h5
																			className="card-title"
																			style={{
																				marginBottom: "5px",
																				marginRight: "10px",
																			}}
																		>
																			{candidate.user.name}
																		</h5>
																		<p
																			className="card-text"
																			style={{ marginBottom: "5px" }}
																		>
																			{candidate.user.email}
																		</p>
																		<div>
																			{/* Render competences from CVs where CVs.user._id matches candidate.user._id */}
																			<div
																				className="d-flex flex-wrap justify-content-center"
																				style={{ marginBottom: "10px" }}
																			>
																				{CVs.filter(
																					(cv) => cv.user === candidate.user._id
																				).map((cv) => (
																					<div key={cv._id}>
																						{cv.competences.map(
																							(competence, index) => (
																								<span
																									key={index}
																									className="badge border border-secondary text-black rounded-pill m-1"
																								>
																									{competence}
																								</span>
																							)
																						)}
																					</div>
																				))}
																			</div>
																		</div>
																		<a
																			href="#"
																			className="btn btn-link text-dark align-right ms-1 "
																			onClick={() =>
																				setShowAllCompetences(
																					(prevState) => !prevState
																				)
																			}
																		>
																			{showAllCompetences ? "-Moins" : "+Plus"}
																		</a>
																	</div>
																	<a href="#">
																		<i
																			className="bi bi-eye-fill"
																			style={{
																				position: "absolute",
																				bottom: "1px",
																				left: "10px",
																				fontSize: "1.5rem",
																				color: "black",
																			}}
																		></i>
																	</a>
																</div>
															)}
														</div>
													</div>
												</div>
											))
										)}
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				<ReactPaginate
					previousLabel={"Précedent"}
					nextLabel={"Suivant"}
					breakLabel={"..."}
					breakClassName={"break-me"}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					onPageChange={handlePageChange}
					containerClassName={"pagination"}
					activeClassName={"active"}
					previousClassName={"page-item"}
					nextClassName={"page-item"}
					breakLinkClassName={"page-link"}
					pageClassName={"page-item"}
					pageLinkClassName={"page-link"}
					previousLinkClassName={"page-link"}
					nextLinkClassName={"page-link"}
					pageCount={pageCount}
				/>

				{popupOpen && (
					<div className="popup ">
						<section id="contact" className="contact py-1">
							<div className="modal-header row justify-content-center">
								<AiOutlineCloseCircle
									className="close-icon"
									onClick={() => setPopupOpen(false)}
								/>

								<div className="alignement mb-3 d-flex justify-content-between align-items-center">
									<h2 className="mx-3">Collections</h2>
									<Link to="/short">
										<i
											class="bi bi-file-earmark-plus-fill"
											style={{ fontSize: "30px" }}
										></i>
									</Link>
								</div>
							</div>
							<div className="input-group">
								<span className="input-group-text" style={{ height: "30px" }}>
									<BsSearch />
								</span>

								<input
									type="text"
									className="form-control mx-2"
									placeholder="Chercher vos collections"
									style={{
										height: "30px",
										width: "300px",
										transition: "background-color 0.3s",
										backgroundColor: "white",
										color: "black",
									}}
									value={searchValue}
									onChange={(event) => setSearchValue(event.target.value)}
									onFocus={(event) => {
										event.target.style.backgroundColor = "#333333";
										event.target.style.color = "white";
										event.target.placeholder = "";
									}}
									onBlur={(event) => {
										event.target.style.backgroundColor = "white";
										event.target.style.color = "black";
										event.target.placeholder = "Chercher vos collections";
									}}
								/>
								<button
									className="btn btn-danger"
									type="button"
									style={{ height: "30px", fontSize: "13px" }}
								>
									Rechercher
								</button>
							</div>

							<h4 className="mt-3">Recent</h4>
							<div className="collection-grid">
								{filteredCollections.map((collection, index) => (
									<div className="collection-item col-4" key={collection.id}>
										<img
											src={collection.image}
											className="collection-icon"
											alt="Collection Icon"
											onError={(e) => {
												e.target.onerror = null;
												e.target.src =
													"../../public/assets/img/team/holder.jpg";
											}}
										/>
										<h5 className="collection-title font-weight-bold">
											{collection.titre}
										</h5>
										<h5 className="add-icon">
											<IoMdAdd
												onClick={() =>
													handleAssignToCollection(
														collection._id,
														selectedUser.id
													)
												}
											/>
										</h5>
									</div>
								))}
							</div>
						</section>
					</div>
				)}

				<Modal
					isOpen={modalIsOpen}
					onRequestClose={() => setModalIsOpen(false)}
					style={{
						content: {
							width: "50%",
							height: "40%",
							maxWidth: "400px",
							margin: "auto",
							borderRadius: "20px",
							border: "none",
							background: "rgba(255, 255, 255, 0.9)",
							boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
							overflow: "hidden",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						},
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							textAlign: "center",
							padding: "20px",
						}}
					>
						<div className="modal-header">
							<AiOutlineCloseCircle
								className="close-icon"
								onClick={() => setModalIsOpen(false)}
							/>
						</div>
						{/* {selectedCandidate && (
							<div style={{ marginBottom: "20px" }}>
								{selectedCandidate.user.pic ? (
									<img
										className="card-img-top rounded-top"
										src={selectedCandidate.user.pic}
										alt={`Image de ${selectedCandidate.name}`}
										style={{
											width: "300px",
											height: "auto",
											borderRadius: "10px",
										}}
									/>
								) : (
									<img
										className="card-img-top rounded-top"
										src="../../public/assets/img/team/Avatar.jpg"
										alt="Image par défaut"
										style={{
											width: "300px",
											height: "auto",
											borderRadius: "10px",
										}}
									/>
								)}
							</div>
						)} */}
						{selectedCandidate && (
							<div>
								<h2>{selectedCandidate.user.name}</h2>
								<p>{selectedCandidate.user.email}</p>

								<div className="flex d-flex ">
									<button
										type="button"
										className="btn btn-outline-dark ms-2"
										onClick={() =>
											handlePlanInterview(
												selectedCandidate.user.id,
												selectedCandidate.user.email
											)
										}
									>
										<i className="bi bi-camera-video-fill"></i>Meet
									</button>
									<button
										type="button"
										className="btn btn-outline-secondary mx-1 "
										onClick={() => goToTest(selectedCandidate.user._id)}
									>
										<i className="bi bi-tools"></i>Test
									</button>
									<Link
										to={`/Email/${selectedCandidate.user._id}?email=${selectedCandidate.user.email}`}
										className="collection-link "
									>
										<button type="button" className="btn btn-outline-danger">
											<i className="bi bi-envelope-fill "></i>Mail
										</button>
									</Link>
								</div>
							</div>
						)}
					</div>
				</Modal>
			</section>
			<div className="footer">
				<h2>Historique des activités</h2>
				<button className="btn btn-primary">
					{sortByDate ? "Désactiver le tri par date" : "Trier par date"}
				</button>
				<div
					className="activity-list"
					style={{
						border: "1px solid #ccc",
						padding: "5px",
						borderRadius: "50px",
					}}
				>
					<ul>
						{activities.slice(0, visibleActivities).map((activity, index) => (
							<li key={index}>
								<span dangerouslySetInnerHTML={{ __html: activity.details }} />
								<span style={{ color: "red" }}>{activity.timestamp}</span>
							</li>
						))}
					</ul>
				</div>
				{activities.length > 5 && (
					<button onClick={toggleShowAll} className="btn btn-link">
						{showAll ? "Voir moins" : "Voir plus"}
					</button>
				)}
			</div>
		</>
	);
}
