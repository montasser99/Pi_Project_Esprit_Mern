import { useEffect, useState } from "react";
import "../Evaluation.css";
import { Navbar } from "../../Home/Navbar";
import { useParams } from "react-router";
import axios from "axios";
export function AssessmentCandidates() {
	const [file, setFile] = useState();
	const [fileName, setFileName] = useState("");
	const [path, setPath] = useState("");
	const [testsScore, setTestsScore] = useState([]);

	/**********/

	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState();
	const [companyID, setCompanyID] = useState("");
	//get session id from params
	const { id } = useParams();
	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		const userId = userInfo._id;
		setCompanyID(userId);
		const fetchSession = async () => {
			console.log("getbyCompanyIdAndSessionId");
			try {
				await axios
					.get(
						"http://localhost:3000/session/getbyCompanyIdAndSessionId", // Updated endpoint URL
						{
							params: {
								companyID: companyID,
								sessionID: id,
							},
						}
					)
					.then((response) => {
						setSession(response.data);
						response.data.candidats.forEach(async (candidat) => {
							try {
								for (let i = 0; i < response.data.testes.length; i++) {
									const result = await axios.get(
										"http://localhost:3000/test/getResultTestbyCandidatAndOffre",
										{
											params: {
												idCandidat: candidat.candidatId,
												idOffre: response.data.Offre._id,
												idTest: response.data.testes[i]._id,
											},
										}
									);
									setTestsScore((prev) => [...prev, result.data.score]);
								}
								console.log("testsScore", testsScore);
							} catch (error) {
								console.error(
									"Erreur lors de la récupération du résultat du test pour le candidat",
									candidat.candidatId,
									":",
									error
								);
							}
						});

						setLoading(false);
					})
					.catch((error) => {
						console.error("Error fetching API:", error);
						setLoading(false);
					});
			} catch (error) {
				console.error("Error fetching session:", error);
				setLoading(false);
			}
		};
		fetchSession();
	}, [companyID, id]);
	/**********/
	/*****import candidats  */
	const saveFile = (e) => {
		setFile(e.target.files[0]);
		console.log(e.target.files[0]);
		setFileName(e.target.files[0].name);
	};

	const Inviter = async () => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("fileName", fileName);
			formData.append("path", path);
			formData.append("id", id); // Corrected key name
			console.log("FormData before sending:", formData);

			const response = await axios.post(
				"http://localhost:3000/test/importAndInviteCandidatsToPassTest",
				formData
			);

			console.log("Response from server:", response.data);
			window.location.reload();
		} catch (error) {
			console.error("Error sending FormData:", error);
		}
	};

	/*****import candidats  */
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
						<section id="services" className="section  ">
							<div
								style={{
									background: "#fff",
									borderRadius: "10px",
								}}
							>
								<div className="container">
									<div className="flex d-flex justify-content-between ">
										<div>
											{session && (
												<div className="row">
													<div className="col">
														<h5>{session.nom}</h5>
														<p>
															{session.testes.length} tests |
															{session.candidats.length} candidats
														</p>
													</div>
												</div>
											)}
										</div>
										<div className="row ">
											<button
												className="btn btn-secondary "
												data-bs-toggle="modal"
												data-bs-target="#fullScreenModal"
											>
												<i className="fa  fa-envelope text-grey mx-2"></i>
												Inviter
											</button>
										</div>
									</div>
								</div>
							</div>
							<hr />
							<main className="container">
								<div className="card shadow p-5">
									<h2>Candidates</h2>
									<table className="table table-hover mb-0 ">
										{session && session.testes && (
											<thead>
												<tr>
													<th rowSpan="2">Nom</th>
													{/* <th rowSpan="2">AVG. % SCORE</th> */}
													<th colSpan={session.testes.length}>Tests Results</th>
													<th rowSpan="2">Actions</th>
												</tr>
												<tr>
													{session.testes.map((test, index) => (
														<th key={index}>{test.technologie}</th>
													))}
												</tr>
											</thead>
										)}
										<tbody>
											{session &&
												session.candidats.map((candidate, index) => (
													<tr key={index}>
														<td>{candidate.candidatNom}</td>
														{/* <td>21%</td> Assuming this is static for now */}
														{testsScore.map((test, index) => (
															<td key={index}>{test}</td>
														))}
														<td>
															<i
																className="btn btn-outline-secondary fas fa-eye"
																onClick={() =>
																	window.open(
																		`/evalution/test/candidatRapport/${candidate.candidatId}/${session.Offre._id}`,
																		"_blank"
																	)
																}
															></i>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</main>
						</section>

						<div className="modal fade" id="fullScreenModal" tabIndex={-1}>
							<div className="modal-dialog modal-lg modal-dialog-centered">
								<div className="modal-content ">
									<h2 className="modal-title d-flex justify-content-center pt-3 ">
										Importer les candidates
									</h2>
									<section id="contact" className="contact py-3">
										<div className=" d-flex flex-row">
											<form className="form-ajout">
												<div className="mb-3">
													<label htmlFor="title" className="form-label">
														Importer les candidates
														<strong>*</strong>
													</label>
												</div>
												<div className="mb-3">
													<div className="input-group mb-3">
														<input
															type="file"
															className="form-control"
															name="file"
															onChange={saveFile}
														/>
													</div>
												</div>
											</form>
										</div>
									</section>

									<div className="modal-footer">
										<button
											type="button"
											className="btn mx-3"
											style={{
												color: "white",
												backgroundColor: "#37517e",
											}}
											disabled={!file} // Disable button if file is not selected
											onClick={Inviter}
											data-bs-dismiss="modal"
										>
											Enregistrer
										</button>
										<button
											type="button"
											className="btn btn-secondary"
											data-bs-dismiss="modal"
										>
											Annuler
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
