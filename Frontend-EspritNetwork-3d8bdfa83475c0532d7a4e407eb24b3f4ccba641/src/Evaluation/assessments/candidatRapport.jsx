import { useEffect, useState } from "react";
import "../Evaluation.css";
import axios from "axios";
import { useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { Navbar } from "../../Home/Navbar";

export function CandidatRapport() {
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [passageTest, setPassageTest] = useState([]);
	const [scoreTotal, setScoreTotal] = useState(0);
	const { idOffre } = useParams();
	const { idCandidat } = useParams();
	const [candidature, setCandidature] = useState({
		date_postule: "",
		status: "",
	});
	const [antiCheating, setAntiCheating] = useState([]);

	useEffect(() => {
		const getRapport = async () => {
			await axios
				.get("http://localhost:3000/test/candidatRapport", {
					params: { idCandidat: idCandidat, idOffre: idOffre },
				})
				.then((response) => {
					let tabTests = [];
					for (
						let index = 0;
						index < response.data.data[0].passagetests.length;
						index++
					) {
						const element = response.data.data[0].passagetests[index];
						tabTests.push(element);
					}

					setResult(response.data.data[0]);
					if (response.data.candidature.length > 0) {
						setCandidature({ postule: true, ...response.data.candidature[0] });
						console.log("candidature", response.data.candidature[0]);
					} else {
						setCandidature({
							postule: false,
							date_postule: "*****",
							status: "*****",
						});
					}
					console.log(response.data);
					setAntiCheating(response.data.antiCheating);
					setPassageTest(tabTests);
					console.log("passageTest", tabTests);
					setLoading(false);
				})
				.catch((error) => {
					console.error("Error fetching test:", error);
				});
		};
		getRapport();
	}, []);

	//****Inviter  */
	const [meetLink, setMeetLink] = useState("");
	const [methodeInvitation, setMethodeInvitation] = useState("");
	const [interviewDate, setInterviewDate] = useState();
	const [status, setStatus] = useState("");

	const createMeetingEnligne = async () => {
		await axios
			.post("http://localhost:3000/interview/planifier", {
				// Make sure to replace these placeholders with actual data
				date: interviewDate,
				idCandidat: idCandidat,
				idOffre: idOffre,
			})
			.then((res) => {
				const data = res.data;
				console.log(data);
				setMeetLink(data.link);
				toast.success(res.data.message, {
					duration: 2500,
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
	const createMeetingAubureau = async () => {
		console.log("createMeetingAubureau");
		console.log(interviewDate);
		await axios
			.post("http://localhost:3000/interview/planifierAubureau", {
				// Make sure to replace these placeholders with actual data
				date: interviewDate,
				idCandidat: idCandidat,
				idOffre: idOffre,
			})
			.then((res) => {
				const data = res.data;
				console.log(data);
				toast.success(res.data.message, {
					duration: 2500,
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
	const sendInvitation = async () => {
		if (methodeInvitation === "enligne") {
			createMeetingEnligne();
		} else if (methodeInvitation === "aubureau") {
			createMeetingAubureau();
		} else {
			console.log("nooo data check", methodeInvitation);
		}
	};
	const send = async () => {
		if (status === "accepté") {
			await axios
				.post("http://localhost:3000/interview/EnovyerMaildAcceptation", {
					idCandidat: idCandidat,
					idOffre: idOffre,
				})
				.then((res) => {
					console.log(res.data);
					toast.success(res.data.message, {
						duration: 2500,
					});
				})
				.catch((err) => {
					console.log(err.message);
				});
		} else if (status === "rejeté") {
			await axios
				.post("http://localhost:3000/interview/EnovyerMaildeRefus", {
					idCandidat: idCandidat,
					idOffre: idOffre,
				})
				.then((res) => {
					console.log(res.data);
					toast.success(res.data.message, {
						duration: 2500,
					});
				})
				.catch((err) => {
					console.log(err.message);
				});
		} else {
			console.log("nooo data check", status);
		}
	};
	const resetData = () => {
		setMeetLink("");
		setMethodeInvitation("");
	};
	useEffect(() => {
		let totalScore = 0;
		passageTest.forEach((test) => {
			totalScore += test.score;
		});
		setScoreTotal(totalScore);
	}, [passageTest]);

	const [selectedTestItem, setSelectedTestItem] = useState(null);

	const handleTestItemClick = (item) => {
		setSelectedTestItem(item);
	};
	return (
		<>
			<Navbar />
			{loading ? (
				<div className="d-flex justify-content-center py-5 ">
					<div className="py-5">
						<l-newtons-cradle size="180" color="#cf0000" />
					</div>
				</div>
			) : (
				<>
					<nav className="mt-5 navbar navbar-expand-lg col-sm-12">
						<div className="container-fluid mx-3">
							<div className="collapse navbar-collapse  flex d-flex  flex-lg-row  justify-content-between">
								<div className="row ">
									<div className="row ms-5 pt-2  ">
										<div className="col-2">
											<span
												className="text-black"
												style={{
													borderRadius: " 50%",
													background: "#ccc",
													padding: "10px",
													margin: "10px",
													fontSize: "20px",
												}}
											>
												{result.candidat.name.charAt(0) +
													result.candidat.name.charAt(
														result.candidat.name.indexOf(" ") + 1
													)}
											</span>
										</div>
										<div className="col">
											<h5>
												{result.candidat.name} - {result.offre.titre}
												<i
													className="btn btn-outline-secondary  fa fa-external-link-square ms-3"
													onClick={() =>
														window.open(`/resume/${idCandidat}`, "_blank")
													}
												></i>
											</h5>
											<p>{result.candidat.email}</p>
										</div>
									</div>
								</div>
								<div className="row col-lg-3 col-sm-12">
									<div className=" flex d-flex justify-content-end">
										<button
											type="button"
											className="btn btn-outline-success"
											data-bs-toggle="modal"
											data-bs-target="#acceptMail"
										>
											Accepté
										</button>
										<button
											className="btn btn-outline-danger mx-2"
											type="button"
											data-bs-toggle="modal"
											data-bs-target="#rejectMail"
										>
											Refusé
										</button>
										<button
											className="btn btn-outline-info "
											type="button"
											data-bs-toggle="modal"
											data-bs-target="#inviterMail"
										>
											Invité
										</button>
									</div>
								</div>
							</div>
						</div>
					</nav>
					<div className="section-bg">
						<Toaster />
						<section id="portfolio-details" className="portfolio-details">
							<div className="container-fluid">
								<div className="col-lg-12 col-md-6 col-sm-12 mb-4">
									<div
										className="portfolio-info"
										style={{ backgroundColor: "#ffffff" }}
									>
										<div className="row">
											<div className="col-12 col-lg-2 mt-2">
												<h4 className="text-black">
													Offre {result.offre.typecontrat}
												</h4>
											</div>
											<div className="col-12 col-lg-4">
												<h5>{result.offre.titre}</h5>
												<p>{result.offre.description} </p>
											</div>
											<div className="col-12 col-lg-3">
												<h5>Publié Le </h5>
												<p>{result.offre.created_at} </p>
											</div>
										</div>
									</div>
								</div>
								<div className="row ">
									<div className="col-lg-3">
										<div
											className="portfolio-info"
											style={{ backgroundColor: "#ffffff" }}
										>
											<ul>
												<li>
													<strong>Postulé le </strong>:
													<p className="py-4">
														{candidature.postule ? (
															candidature.date_postule.split("T")[0]
														) : (
															<p className="badge bg-info py-2">
																ce candidat n&apos;a pas postulé
															</p>
														)}
													</p>
												</li>
												<li>
													<strong>Étape d&apos;embauche</strong>: <br />
													<p className="py-4">
														<p className="badge bg-success py-2 ">
															{candidature.status}
														</p>
													</p>
												</li>
											</ul>
										</div>
									</div>
									<div className="col-lg-5">
										<div
											className=" portfolio-info"
											style={{ backgroundColor: "#ffffff" }}
										>
											<div className="row mb-4">
												<strong>Score obtenu : </strong>
												<div className="col-10 progress mt-3">
													<div
														className="progress-bar bg-danger w-75"
														role="progressbar"
														aria-valuenow={scoreTotal}
														aria-valuemin={0}
														aria-valuemax={100}
													>
														{scoreTotal} points  obtenu
													</div>
												</div>
												<h2 className="col-2">{scoreTotal}Pt</h2>
											</div>
											<ul>
												<strong>Les Tests Passés : </strong>
												<div className="row row-cols-1 row-cols-md-2">
													{passageTest.map((item, index) => (
														<div className="col mt-4" key={index}>
															<div className="member p-2">
																<div className="d-flex justify-content-between align-items-start">
																	<div className="flex flex-row align-items-center">
																		<h4 style={{ color: "#Cf0000" }}>
																			Test.{item.test.technologie}
																		</h4>
																		{/* <p>{item.test.description}</p> */}
																	</div>
																	<div className="d-flex justify-content-end ">
																		<i className=" text-black">
																			{item.score}/{item.test.questions.length}
																		</i>
																	</div>
																</div>
																<strong>Status Test : </strong>
																<div>
																	{item.etat === true ? (
																		<p className="badge bg-info">Passé</p>
																	) : (
																		<p className="badge bg-danger">Non Passé</p>
																	)}
																</div>
																<div className="row">
																	<div className="col">
																		<strong>Invité le </strong>
																		{item.invited_at
																			? item.invited_at
																					.toString()
																					.substring(0, 10)
																			: "******T"}
																	</div>
																	<div className="col">
																		<strong>Passé le </strong>
																		<p>
																			{item.passed_at
																				? item.passed_at
																						.toString()
																						.substring(0, 10)
																				: "*****"}
																		</p>
																	</div>

																	<div className="flex d-flex justify-content-between">
																		<button
																			className="btn btn-outline"
																			type="button"
																			onClick={() =>
																				window.open(
																					`/evalution/test/eye/${item.idTest}`,
																					"_blank"
																				)
																			}
																		>
																			<i className="btn btn-outline-secondary f fa fa-external-link-square "></i>
																		</button>
																		<button
																			className="btn btn-outline"
																			type="button"
																			data-bs-toggle="modal"
																			data-bs-target="#seeTest"
																			onClick={() => handleTestItemClick(item)}
																		>
																			<i className=" btn btn-outline-info fas fa-eye"></i>
																		</button>
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</ul>
										</div>
									</div>
									<div className=" col-lg-4">
										<div
											className=" portfolio-info"
											style={{ backgroundColor: "#ffffff" }}
										>
											<h3> Monitor anti-tricherie</h3>
											<div style={{ maxHeight: "300px", overflowY: "auto" }}>
												<div className="card-body">
													{antiCheating.map((item, index) => (
														<div key={index}>
															<li className="list-group-item  flex d-flex justify-content-between">
																<h5>Test {index} : </h5>
															</li>
															<ul className="list-group list-group-flush">
																<li className="list-group-item  flex d-flex justify-content-between">
																	<p>Appareil utilisé:</p>
																	<span className="badge text-info">
																		{item.typeApapreil}
																	</span>
																</li>
																<li className="list-group-item  flex d-flex justify-content-between">
																	<p>Emplacement:</p>
																	<p>Tunis (Gouvernorat de Tunis), TN</p>
																</li>
																<li className="list-group-item  flex d-flex justify-content-between">
																	<p>Webcam activée ?</p>
																	<span className="badge text-info">
																		{item.cameraActivated ? "oui" : "non"}
																	</span>
																</li>
																<li className="list-group-item  flex d-flex justify-content-between">
																	<p>Mode plein écran toujours actif ?</p>
																	<span className="badge text-info">
																		{item.isFullScreen ? "oui" : "non"}
																	</span>
																</li>
																<li className="list-group-item  flex d-flex justify-content-between">
																	<p>
																		Souris toujours dans la fenêtre
																		d&apos;évaluation ?
																	</p>
																	<span className="badge text-info">
																		{item.isMouseInsideWindow ? "oui" : "non"}
																	</span>
																</li>
																<li className="list-group-item  ">
																	<p>Capture video de passge de test : </p>
																	<video controls width="350" height="auto">
																		<source
																			src="https://firebasestorage.googleapis.com/v0/b/espritnetwork-743b0.appspot.com/o/recordings%2FWIN_20240503_09_58_28_Pro.mp4?alt=media&token=19ef043f-9605-4949-8910-c2a7f89f82a6"
																			type="video/webm"
																		/>
																	</video>
																</li>
															</ul>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
					{/* models */}
					<div className="modal fade" id="acceptMail" tabIndex={-1}>
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content ">
								<div className="modal-header">
									<h5 className="modal-title">Accepter le candidat</h5>
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Fermer"
									/>
								</div>
								<div className="modal-body ms-5">
									<p>Voulez-vous Accepter ce candidat ?</p>
									<div className="form-check form-switch ">
										<input
											className="form-check-input"
											type="checkbox"
											onClick={() => setStatus("accepté")}
										/>
										<label className="form-check-label">
											Envoyer également un e-mail de Accept à ce candidat
										</label>
									</div>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
									>
										Annuler
									</button>
									<button
										type="button"
										className="btn btn-danger"
										onClick={send}
									>
										Accepter
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="modal fade" id="rejectMail" tabIndex={-1}>
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content ">
								<div className="modal-header">
									<h5 className="modal-title" id="rejectCandidateModalLabel">
										Rejeter le candidat
									</h5>
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Fermer"
									/>
								</div>
								<div className="modal-body ms-5">
									<p>Voulez-vous rejeter ce candidat ?</p>
									<div className="form-check form-switch ">
										<input
											className="form-check-input"
											type="checkbox"
											id="rejectionEmail"
											onClick={() => setStatus("rejeté")}
										/>
										<label
											className="form-check-label"
											htmlFor="rejectionEmail"
										>
											Envoyer également un e-mail de rejet à ce candidat
										</label>
									</div>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
									>
										Annuler
									</button>
									<button
										type="button"
										className="btn btn-danger"
										onClick={send}
									>
										Rejeter
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="modal fade" id="inviterMail" tabIndex={-1}>
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content ">
								<div className="modal-header">
									<h5 className="modal-title">
										Inviter le candidat Pour un entretien
									</h5>
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Fermer"
									/>
								</div>
								<div className="modal-body ms-5">
									<h6 className="font-weight-bold">
										Voulez-vous recontrer ce candidat :
									</h6>
									<div className="form-check form-switch ">
										<input
											className="form-check-input"
											type="checkbox"
											id="rejectionEmail"
											checked={methodeInvitation === "aubureau"}
											onClick={() => setMethodeInvitation("aubureau")}
										/>
										<label className="form-check-label">Au bureau</label>
									</div>

									<div className="form-check form-switch ">
										<input
											className="form-check-input"
											type="checkbox"
											checked={methodeInvitation === "enligne"}
											onClick={() => setMethodeInvitation("enligne")}
											id="rejectionEmail"
										/>
										<label className="form-check-label">
											En ligne (via un appel vidéo) Google Meet
										</label>
									</div>
									<h6 className="font-weight-bold">Le : </h6>

									<input
										className="form-control"
										type="date"
										id="rejectionEmail"
										name="date"
										onChange={(e) => setInterviewDate(e.target.value)}
										required
									/>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
										onClick={resetData}
									>
										Annuler
									</button>
									<button
										type="submit"
										className="btn btn-danger"
										onClick={sendInvitation}
									>
										Inviter
									</button>
								</div>
								{meetLink && (
									<a
										href={meetLink}
										target="_blank"
										rel="noopener noreferrer"
										className="badge bg-info text-dark py-3 "
									>
										Tester le lien Meet de l&apos;entretien
									</a>
								)}
							</div>
						</div>
					</div>
					<div className="modal fade" id="seeTest" tabIndex={-1}>
						<div className="modal-dialog modal-lg modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h3 className="modal-title">Les reponses du  test : </h3>
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Close"
									/>
								</div>
								<div className="modal-body">
									{selectedTestItem && (
										<>
											<h6>Test en {selectedTestItem.test.technologie}</h6>
											<h6>Description: {selectedTestItem.test.description}</h6>
											<h6>Reponses :</h6>
											<h6>{selectedTestItem.critere}</h6>
											<div className="col-lg-12">
												<div className="options py-3">
													<div className="row">
														{selectedTestItem.response.map((item, index) => (
															<div
																className="col-4 flex d-flex  justify-content-between "
																key={index}
															>
																{" "}
																<h6 className="mt-4"> {index}</h6>
																<div className="card mx-4">
																	<div className="card-body">
																		<p className="card-text mx-2">
																			<code>{item.reponse}</code>
																		</p>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											</div>
										</>
									)}
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
									>
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
					{/* modals */}
				</>
			)}
		</>
	);
}
