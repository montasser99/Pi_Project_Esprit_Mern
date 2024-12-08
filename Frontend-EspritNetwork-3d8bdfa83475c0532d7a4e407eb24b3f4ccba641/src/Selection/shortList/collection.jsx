import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Modal,  Form } from "react-bootstrap";
import { BiGrid, BiListUl } from "react-icons/bi";
import ExcelJS from "exceljs";

export function Collection() {
	const [candidates, setCandidates] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [recipient, setRecipient] = useState("");
	const [subject, setSubject] = useState("");
	const [text, setText] = useState("");
	const [recipientError, setRecipientError] = useState(false);
	const [subjectError, setSubjectError] = useState(false);
	const [textError, setTextError] = useState(false);
	const [displayMode, setDisplayMode] = useState("grid");
	const navigate = useNavigate();

	const [isGridMode, setIsGridMode] = useState(true);
	const toggleViewMode = () => {
		setIsGridMode((prevMode) => !prevMode); // Inversez le mode actuel
	};

	const toggleDisplayMode = () => {
		setDisplayMode(displayMode === "grid" ? "list" : "grid");
	};

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleRecipientChange = (e) => {
		setRecipient(e.target.value);
	};

	const handleSubjectChange = (e) => {
		setSubject(e.target.value);
	};

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	const { id } = useParams();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const collectionName = queryParams.get("name");

	useEffect(() => {
		const fetchUsersByCollectionId = async () => {
			try {
				const collectionId = id;
				const response = await axios.get(
					`http://localhost:3000/collection/getusers/${collectionId}`
				);
				const users = response.data;
				console.log(users);

				const usersData = Array.isArray(users) ? users : [users];
				console.log(usersData);
				setCandidates(usersData);
				console.log(usersData);
				console.log("oooo ", candidates);

				if (usersData.length > 0) {
					const user = usersData[0];
					const userEmail = user.email;
					setRecipient(userEmail);
				}
			} catch (error) {
				console.error("Error fetching users by collection ID:", error);
			}
		};

		fetchUsersByCollectionId();
	}, []);

	const removeUserFromCollection = async (collectionId, userId) => {
		try {
			const response = await axios.delete(
				`http://localhost:3000/collection/remove/${collectionId}/${userId}`
			);
			if (response.status === 200) {
				toast.success("Candidat retiré avec succès!");

				setTimeout(() => {
					// Recharger la page pour afficher les changements
					window.location.reload();
				}, 1000);

				updateCandidateAssignment(userId, false);

				// Retirer l'entrée du candidat dans localStorage
				localStorage.removeItem(userId);
			} else {
				// Gérer les réponses d'erreur si nécessaire
			}
		} catch (error) {
			// Gérer les erreurs de connexion ou autres erreurs
		}
	};
	const goToTest = (id) => {
		localStorage.setItem("idCandidat", JSON.stringify(id));
		navigate(`/evalution/test/lister`);
	};
	const updateCandidateAssignment = (userId, isAssigned) => {
		setCandidates((prevCandidates) =>
			prevCandidates.map((candidate) =>
				candidate.user && candidate.user._id === userId
					? { ...candidate, isAssigned }
					: candidate
			)
		);

		// Mettre à jour le localStorage
		localStorage.setItem(userId, isAssigned.toString());
	};

	const handleOpenMailModal = (userEmail) => {
		const recipientEmail = userEmail;
		setRecipient(recipientEmail);
		handleOpenModal();
	};

	//mailing//

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!recipient || !subject || !text) {
			if (!recipient) setRecipientError(true);
			if (!subject) setSubjectError(true);
			if (!text) setTextError(true);

			return;
		}

		const htmlContent = `
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
                  <p>${text.replace(/\n\r?/g, "<br/>")}<br/>
                          <a>@L’équipe Esprit Network</a>
                      </p>
                  </td>
              </tr>
          </table>
      </body>
  `;

		const response = await fetch("http://localhost:3000/send-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipient: recipient,
				subject: subject,
				html: htmlContent,
			}),
		});

		if (response.ok) {
			console.log("E-mail envoyé avec succès");
			toast.success("E-mail envoyé avec succès");

			// Réinitialiser les champs du formulaire après l'envoi réussi

			setSubject("");
			setText("");
			handleCloseModal();
		} else {
			console.error("Erreur lors de l'envoi de l'e-mail");
		}
	};
	////////////////////////////*****meetting**** *////////////////////

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
			// window.location.href = link;
			toast.success("Invitation envoyée avec succès");

			window.open(link, "_blank");
		} catch (error) {
			console.error("Erreur lors de la planification de l'entretien :", error);
			// Gérer les erreurs ici
		}
	};

	async function exportToExcel(candidates) {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Candidats");

		worksheet.addRow(["Id", "Nom", "Email"]);

		console.log("candidates", candidates);
		candidates.forEach((candidate) => {
			worksheet.addRow([candidate.id, candidate.name, candidate.email]);
		});

		const buffer = await workbook.xlsx.writeBuffer();
		saveAs(new Blob([buffer]), `Candidats_${collectionName}.xlsx`);
	}

	return (
		<>
			<main id="main">
				<ToastContainer />
				<div
					className="mb-3"
					style={{
						backgroundColor: "#EFEFEF",
						marginTop: "80px",
						padding: "30px",
					}}
				>
					<nav
						id="navbar"
						className="navbar d-flex align-items-center py-2 section-bg mt-4"
					>
						<div className="title mx-auto">
							{" "}
							{/* Utilisation de la classe "mx-auto" pour centrer le titre */}
							<h2>{collectionName}</h2>
						</div>
						<ul className="py-3 mx-5 mt-3">
							<li>
								<Link to={`/collection/edit/${id}`}>
									<strong className="pointerLine cursor-pointer active mx-3">
										Modifier <i className="bi bi-pencil-fill mx-3"></i>
									</strong>
								</Link>
							</li>
							<li>
								<strong
									className="pointerLine cursor-pointer active mx-3"
									onClick={() => exportToExcel(candidates)}
								>
									Exporter <i className="fas fa-file-excel mx-3"></i>
								</strong>
							</li>
							<li>
								<strong
									className="pointerLine cursor-pointer active mx-3"
									onClick={toggleDisplayMode}
								>
									{displayMode === "grid" ? "En liste  " : "En grille"}
									{isGridMode ? <BiListUl /> : <BiGrid />}
								</strong>
							</li>
						</ul>
					</nav>
				</div>

				<section id="team" className="team section-bg">
					<div className="title" style={{ transform: "translateY(-100%)" }}>
						<h3>~~La crème de la crème~~</h3>
					</div>

					<div className="row justify-content-center">
						{displayMode === "grid" ? (
							<div className="row">
								{/* Affichage en grille */}
								{candidates.length === 0 ? (
									<div className="empty-collection-container">
										<i className="bi bi-exclamation-triangle"></i>
										<p className="empty-collection">
											Aucun utilisateur trouvé dans cette collection.
										</p>
										<i className="bi bi-exclamation-triangle"></i>
									</div>
								) : (
									candidates.map((users, index) => (
										<div
											className="col-lg-5 mb-4"
											key={users.id}
											data-aos="zoom-in"
											data-aos-delay="100"
											style={{ transform: "translateY(-12%)" }}
										>
											<div
												className="member d-flex align-items-start"
												style={{ width: "80%", position: "relative" }}
											>
												<i
													className="bi bi-dash-circle"
													style={{
														position: "absolute",
														top: "5px",
														right: "5px",
														color: "red",
													}}
													onClick={() => removeUserFromCollection(id, users.id)}
												></i>
												<div className="pic">
													<div>
														{users.pic ? (
															<img
																src={users.pic}
																className="card-img-top rounded-top "
																alt={`Image de ${users.name}`}
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
												</div>
												<div className="member-info">
													<h4 style={{ color: "#322c2c" }}>{users.name}</h4>
													<p>{users.email}</p>
													<div
														className="d-flex flex-wrap"
														style={{ marginBottom: "5px" }}
													>
														{/* Other content */}
														<a href="#" className="grey-link">
															+3 More
														</a>
													</div>
													<div className="mt-3 d-flex align-items-center">
														<button
															type="button"
															className="btn btn-outline-danger btn-sm me-3"
															onClick={() =>
																handlePlanInterview(users.id, users.email)
															}
														>
															<i className="bi bi-camera-video-fill"></i> Meet
														</button>
														<button
															type="button"
															className="btn btn-outline-secondary btn-sm me-3"
															onClick={() => goToTest(users.id)}
														>
															<i className="bi bi-tools"></i> Test
														</button>
														<button
															type="button"
															className="btn btn-outline-dark btn-sm me-3"
															onClick={() => handleOpenMailModal(users.email)}
														>
															<i className="bi bi-envelope-fill"></i> Mail
														</button>
													</div>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						) : (
							<div className="col-lg-10">
								{/* Affichage en liste */}
								<table
									className="table"
									style={{ transform: "translateY(-12%)" }}
								>
									<thead>
										<tr>
											<th></th>
											<th>Nom</th>
											<th>Email</th>
											<th>Actions</th>
											<th>Retirer</th>
										</tr>
									</thead>
									<tbody>
										{candidates.length === 0 ? (
											<tr>
												<td colSpan="3">
													Aucun utilisateur trouvé dans cette collection.
												</td>
											</tr>
										) : (
											candidates.map((users, index) => (
												<tr key={users.id}>
													<td>
														<div className="pic">
															{users.pic ? (
																<img
																	src={users.pic}
																	className="table-avatar rounded-circle"
																	alt={`Image de ${users.name}`}
																	style={{
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
													</td>

													<td>{users.name}</td>
													<td>{users.email}</td>
													<td>
														<button
															type="button"
															className="btn btn-outline-danger btn-sm me-3"
															onClick={() =>
																handlePlanInterview(users.id, users.email)
															}
														>
															<i className="bi bi-camera-video-fill"></i> Meet
														</button>
														<button
															type="button"
															className="btn btn-outline-secondary btn-sm me-3"
														>
															<i className="bi bi-tools"></i> Test
														</button>
														<button
															type="button"
															className="btn btn-outline-dark btn-sm me-3"
															onClick={() => handleOpenMailModal(users.email)}
														>
															<i className="bi bi-envelope-fill"></i> Mail
														</button>
													</td>
													<td>
														<i
															className="bi bi-dash-circle"
															style={{ position: "absolute", color: "red" }}
															onClick={() =>
																removeUserFromCollection(id, users.id)
															}
														></i>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						)}
						<Modal
							show={showModal}
							onHide={handleCloseModal}
							dialogClassName="custom-modal"
						>
							<Modal.Header closeButton>
								<Modal.Title>
									Envoyer un e-mail <i class="bi bi-envelope-at"></i>
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form>
									<Form.Group controlId="recipient">
										<Form.Label>Destinataire</Form.Label>
										<Form.Control
											className={`form-control ${
												recipientError ? "is-invalid" : ""
											}`}
											type="email"
											placeholder="Entrez l'e-mail du destinataire"
											value={recipient}
											onChange={(e) => {
												setRecipient(e.target.value);
												setRecipientError(false);
											}}
										/>
										{recipientError && (
											<div className="invalid-feedback">
												Le destinataire est requis.
											</div>
										)}
									</Form.Group>

									<Form.Group controlId="subject">
										<Form.Label>Sujet</Form.Label>
										<Form.Control
											className={`form-control ${
												subjectError ? "is-invalid" : ""
											}`}
											type="text"
											placeholder="Entrez le sujet de l'e-mail"
											value={subject}
											onChange={(e) => {
												setSubject(e.target.value);
												setSubjectError(false);
											}}
										/>
										{subjectError && (
											<div className="invalid-feedback">
												Le sujet est requis.
											</div>
										)}
									</Form.Group>

									<Form.Group controlId="text">
										<Form.Label>Contenu</Form.Label>
										<Form.Control
											className={`form-control ${
												textError ? "is-invalid" : ""
											}`}
											as="textarea"
											rows={3}
											placeholder="Entrez le contenu de l'e-mail"
											value={text}
											onChange={(e) => {
												setText(e.target.value);
												setTextError(false);
											}}
										/>
										{textError && (
											<div className="invalid-feedback">
												Le contexte est requis.
											</div>
										)}
									</Form.Group>
								</Form>
							</Modal.Body>
							<Modal.Footer>
								<button
									type="button"
									className="btn btn-danger me-3"
									onClick={handleCloseModal}
								>
									Annuler
								</button>
								<button
									type="button"
									className="btn btn-dark me-3"
									onClick={handleSubmit}
								>
									Envoyer
								</button>
							</Modal.Footer>
						</Modal>
					</div>
				</section>
			</main>
		</>
	);
}
