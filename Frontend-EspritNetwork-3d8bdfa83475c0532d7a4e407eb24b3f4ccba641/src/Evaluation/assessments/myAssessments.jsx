import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../../Home/Navbar";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
export function Myassessments() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [currentStep, setCurrentStep] = useState(0);
	const [testsSelected, setTestsSelected] = useState([]);
	const [offreSelected, setOffreSelected] = useState("");
	const [offres, setOffers] = useState([]);
	const [tests, setTests] = useState([]);
	const [session, setSession] = useState([]);
	const [nameSession, setNameSession] = useState("");
	const [companyID, setCompanyID] = useState("");

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		const userId = userInfo._id;
		setCompanyID(userId);
		fetchSessions(userId);
		fetchOffres(userId);
		fetchTests();
	}, []);

	const fetchOffres = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:3000/offre/getbyidUser/${userId}`
			);
			setOffers(response.data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching offers:", error);
			setLoading(false);
		}
	};

	const fetchTests = async () => {
		try {
			const response = await axios.get(`http://localhost:3000/test/getall`);
			setTests(response.data);
		} catch (error) {
			console.error("Error fetching tests:", error);
		}
	};
	const fetchSessions = async (companyID) => {
		try {
			const response = await axios.get(
				`http://localhost:3000/session/getbycompanyid?companyID=${companyID}`
			);
			setSession(response.data);
			console.log("session", response.data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching offers:", error);
			setLoading(false);
		}
	};
	const handleRowClick = (id) => {
		navigate(`/evalution/assessments/assessmentCandidates/${id}`);
	};

	const handleNextStep = () => {
		setCurrentStep(currentStep + 1);
	};

	const handlePrevStep = () => {
		setCurrentStep(currentStep - 1);
	};

	// Function to handle offer selection and save to session storage
	const handleOfferSelect = (offer) => {
		setOffreSelected(offer);
		sessionStorage.setItem("offreSelected", JSON.stringify(offer));
		toast.success("Selected !!", {
			duration: 2500,
		});
	};

	// Function to handle test selection and save to session storage
	const handleTestSelect = (test) => {
		// Check if the test already exists in testsSelected
		const testExists = testsSelected.some(
			(selectedTest) => selectedTest._id === test._id
		);

		// If the test doesn't exist, add it to testsSelected and update session storage
		if (!testExists) {
			setTestsSelected((prevTests) => {
				const updatedTests = [...prevTests, test];
				sessionStorage.setItem("testsSelected", JSON.stringify(updatedTests));
				return updatedTests;
			});
			toast.success("Selected !!", {
				duration: 2500,
			});
		}
	};
	// Function to handle deleting a test from testsSelected state and session storage
	const handleDeleteTest = (index) => {
		const updatedTests = [...testsSelected];
		updatedTests.splice(index, 1); // Remove the test at the specified index
		setTestsSelected(updatedTests); // Update state
		sessionStorage.setItem("testsSelected", JSON.stringify(updatedTests)); // Update session storage
	};
	const handleTerminerClick = async () => {
		// Prepare the data to send
		const dataToSend = {
			companyID: companyID,
			nom: nameSession,
			Offre: offreSelected,
			testes: testsSelected,
			candidats: [],
		};

		try {
			console.log("Data to send:", dataToSend);
			// Send the data using axios
			const response = await axios.post(
				"http://localhost:3000/session/add",
				dataToSend
			);
			console.log("Data sent successfully:", response.data);
			toast.success("Session created successfully", {
				duration: 2500,
			});
			window.location.reload();
		} catch (error) {
			console.error("Error sending data:", error);
		}
	};
	// Effect to load selected offer and tests from session storage on component mount
	useEffect(() => {
		const savedOffre = sessionStorage.getItem("offreSelected");
		const savedTests = sessionStorage.getItem("testsSelected");

		if (savedOffre) {
			setOffreSelected(JSON.parse(savedOffre));
		}
		if (savedTests) {
			setTestsSelected(JSON.parse(savedTests));
		}
	}, []);
	return (
		<>
			<Navbar />
			<div id="main">
				{loading ? (
					<div className="d-flex justify-content-center py-5 ">
						<div className="py-5">
							<l-newtons-cradle size="180" color="#cf0000" />
						</div>
					</div>
				) : (
					<>
						<section id="services" className="section section-bg py-5">
							<div className="container">
								<div className="flex d-flex justify-content-between pt-4">
									<h2 className="text-black">Mes évaluations</h2>
									<button
										className="btn btn-success text-white"
										data-bs-toggle="modal"
										data-bs-target="#fullScreenModal"
									>
										<i className="fas fa-plus mx-2"></i>Ajouter une nouvelle
										évaluation
									</button>
								</div>

								<div className="row py-5 pt-18">
									<div className="col-12">
										<div className="mb-4">
											<div className="contact px-2 pt-2 pb-2">
												<div className="table-responsive">

												{session.length === 0 ? (
									
									<div>
										<h5 className="text-danger py-5">
											Vous n&apos;avez pas encore  de evaluation enregistrée
										</h5>
									</div>
								
							) : (
													<table className="table table-hover mb-0">
														<thead>
															<tr>
																<th>NOM</th>
																<th>Titre de l&apos;offre</th>
																<th>NOMBRE DES CANDIDATS</th>
																<th>NOMBRE Tests</th>
															</tr>
														</thead>
														<tbody>
                    

															{session.map((item, index) => (
																<tr
																	onClick={() => handleRowClick(item._id)}
																	key={index}
																>
																	<td>{item.nom}</td>
																	<td>{item.Offre.titre}</td>
																	<td>{item.candidats.length}</td>
																	<td>{item.testes.length}</td>
																</tr>
															))}
														</tbody>
													</table>)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
						{/* this for section of add new evaluation */}
						<div
							className="modal fade"
							id="fullScreenModal"
							tabIndex={-1}
							aria-labelledby="fullScreenModalLabel"
							aria-hidden="true"
						>
							<div className="modal-dialog modal-fullscreen">
								<div className="modal-content">
									<div className="modal-header">
										<div className="flex d-flex">
											<div className="row ms-5">
												<h5 className="flex d-flex">
													<input
														type="text"
														className="form-control"
														name="name"
														defaultValue="Acoustical Engineer-Africa-Remote"
														onChange={(e) => {
															setNameSession(e.target.value);
														}}
													/>
													<i className="mt-2 ms-4 fas fa-plus"></i>
												</h5>
												<b className="ms-4">
													{offreSelected.titre} | {testsSelected.length} Tests
												</b>
											</div>
											<Toaster />
										</div>
										<button
											type="button"
											className="btn-close"
											data-bs-dismiss="modal"
											aria-label="Close"
										></button>
									</div>
									<div className="modal-body section-bg">
										<div className="container">
											<div className="stepper-wrapper">
												<div
													className={`stepper-item ${
														currentStep === 0 ? "active" : ""
													} ${currentStep > 0 ? "completed" : ""}`}
												>
													<div className="step-counter text-white">1</div>
													<div className="step-name">Offres</div>
												</div>
												<div
													className={`stepper-item ${
														currentStep === 1 ? "active" : ""
													} ${currentStep > 1 ? "completed" : ""}`}
												>
													<div className="step-counter text-white">2</div>
													<div className="step-name">Tests à passer</div>
												</div>
												<div
													className={`stepper-item ${
														currentStep === 2 ? "active" : ""
													} ${currentStep > 2 ? "completed" : ""}`}
												>
													<div className="step-counter text-white">3</div>
													<div className="step-name">Informations</div>
												</div>
											</div>
											<div className="step-content">
												{currentStep === 0 && (
													<div>
														<h5 className="py-5">
															Sélectionner l&apos;Offre pour évaluer
														</h5>
														<h6>Offres</h6>
														<div className="row">
															{offres.map((item, index) => (
																<div key={index} className="col-lg-6 mt-4">
																	<div className="member d-flex align-items-start p-2">
																		<div className="row flex d-flex align-items-center">
																			<h4 style={{ color: "#Cf0000" }}>
																				{item.titre}
																			</h4>
																			<h4>
																				<strong>{item.typecontrat}</strong>
																			</h4>
																			<p>{item.description}</p>
																			<span className="border border-secondary text-black rounded-pill m-3 me-1 col-3">
																				<b>{item.competence}</b>
																			</span>
																		</div>
																		<div className="col d-flex justify-content-end">
																			<i className="btn btn-outline-info  fa-solid fa-eye mx-2 text-black" 	onClick={() =>
																					window.open(
																						`/company/details/$${item._id}`,
																						"_blank"
																					)
																				}></i>
																			<i
																				className=" btn btn-outline-success  fa-solid fa-check text-black"
																				onClick={() => handleOfferSelect(item)}
																			></i>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												)}

												{currentStep === 1 && (
													<div>
														<h5 className="py-5">
															Sélectionner les Tests à passer pour
															l&apos;évaluation
														</h5>
														<h6>Tests</h6>
														<div className="row">
															{tests.map((item, index) => (
																<div key={index} className="col-lg-6 mt-4">
																	<div className="member d-flex align-items-start p-2">
																		<div className="row flex d-flex align-items-center">
																			<h4 style={{ color: "#Cf0000" }}>
																				Test : {item.technologie}
																			</h4>
																			<h6 className="ms-2">
																				{item.domaine}.{item.technologie}
																			</h6>
																			<p>
																				{item.questions.length} questions |
																				{item.duree} min
																			</p>
																			<p>{item.description}</p>
																		</div>
																		<div className="col d-flex justify-content-end">
																			<i
																				className="btn btn-outline-info  fa-solid fa-eye mx-2 text-black"
																				onClick={() =>
																					window.open(
																						`/evalution/test/eye/${item._id}`,
																						"_blank"
																					)
																				}
																			></i>
																			<i
																				className="btn btn-outline-success fa-solid fa-check text-black"
																				onClick={() => handleTestSelect(item)}
																			></i>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												)}

												{currentStep === 2 && (
													<div>
														<div className="row">
															<h5 className="pt-5">
																Information sur l&apos;évaluation
															</h5>
														</div>

														<section
															id="portfolio-details"
															className="ms-4 portfolio-details"
														>
															<div className="row">
																<div
																	className="portfolio-info"
																	style={{ backgroundColor: "#fff" }}
																>
																	<h3>information sur l&apos;offre :</h3>
																	<ul>
																		<li>
																			<strong>Titre</strong>:
																			{offreSelected.titre}
																		</li>
																		<li>
																			<strong>Type</strong>:{" "}
																			{offreSelected.typecontrat}
																		</li>
																		<li>
																			<strong>Competences </strong>:{" "}
																			{offreSelected.competence}
																			JS
																		</li>
																		<li>
																			<strong>Date de Crétaion :</strong>
																			{offreSelected.created_at.substring(
																					0,
																					16
																			)}
																		</li>
																	</ul>
																</div>
															</div>
															<div className="row py-5">
																<div
																	className="portfolio-info"
																	style={{ backgroundColor: "#fff" }}
																>
																	<h3>Tests: </h3>
																	<table className="table table-hover mb-0">
																		<thead>
																			<tr>
																				<th>Technologies</th>
																				<th>nombre des questions</th>
																				<th>Duree</th>
																				<th>Actions</th>
																			</tr>
																		</thead>
																		<tbody>
																			{testsSelected.map((test, index) => (
																				<tr key={index}>
																					<td>
																						<p className="text-black ms-4">
																							{test.domaine}.{test.technologie}
																						</p>
																					</td>
																					<td>
																						<p className="text-black ms-4">
																							{test.questions.length}
																						</p>
																					</td>
																					<td>
																						<p className="text-black ms-4">
																							{test.duree}
																						</p>
																					</td>
																					<td>
																						<p
																							className="text-danger ms-4"
																							onClick={() =>
																								handleDeleteTest(index)
																							}
																						>
																							<i className="fas fa-trash"></i>
																						</p>
																					</td>
																				</tr>
																			))}
																		</tbody>
																	</table>
																</div>
															</div>
															<div className="row flex d-flex justify-content-end">
																<button
																	className="btn btn-success col-2 mx-4"
																	onClick={handleTerminerClick}
																	data-bs-dismiss="modal"
																>
																	Terminer
																</button>
															</div>
														</section>
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="modal-footer justify-content-between">
										<button
											type="button"
											className="btn btn-secondary"
											onClick={handlePrevStep}
											disabled={currentStep === 0}
										>
											Previous
										</button>
										<button
											type="button"
											className="btn btn-secondary"
											onClick={handleNextStep}
											disabled={currentStep === 2}
										>
											Next
										</button>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
