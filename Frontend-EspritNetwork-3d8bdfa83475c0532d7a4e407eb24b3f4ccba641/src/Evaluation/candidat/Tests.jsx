import { Link, useNavigate } from "react-router-dom";
import "../Evaluation.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../../Home/Navbar";
export function Tests() {
	const [tests, setTests] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const idCandidat = userId;
	useEffect(() => {
		console.log("idCandidat", idCandidat);
		axios
			.get("http://localhost:3000/test/getbyCandidat", {
				params: { idCandidat },
			})
			.then((response) => {
				setTests(response.data);
				console.log("test", response.data);
				setLoading(false);
			});
	}, []);
	return (
		<>
			{" "}
			<Navbar />
			<div>
				{/* ======= Test Section ======= */}
				<section id="services" className="services section-bg py-5">
					<div className="container" data-aos="fade-up">
						<div className="section-title">
							<h2>Vos Tests </h2>
							<p>
								Bienvenue dans cette étape cruciale du processus de recrutement
								chez l&apos;entreprise X. Nos tests de compétences ont été
								minutieusement élaborés pour évaluer vos aptitudes de manière
								précise, marquant une phase essentielle pour faire progresser
								votre candidature. Ces évaluations visent à mieux comprendre vos
								compétences en lien avec les exigences spécifiques du poste que
								vous visez. Considérez cette étape comme une opportunité de
								démontrer votre excellence professionnelle.
							</p>
						</div>
						{loading ? (
							<div className="d-flex justify-content-center">
								<div className="spinner-border" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
							</div>
						) : (
							<div>
								{tests.length === 0 ? (
									<div className="row justify-content-center py-5 ">
										<div>
											<h5 className="text-danger py-5">
												Vous n&apos;avez pas encore passé de test. Accédez à la
												page Évaluation et commencez à passer des tests pour
												améliorer votre profil.
											</h5>
										</div>
									</div>
								) : (
									<div className="row">
										{tests.map((test, index) => (
											<div
												key={index}
												className="col-xl-3 col-md-4 d-flex align-items-stretch"
												data-aos="zoom-in"
												data-aos-delay={100}
											>
												<div className="icon-box">
													<div className="icon">
														<i className="bx bxl-dribbble" />
													</div>
													<h3>
														<strong>Test en {test.test.technologie}</strong>
													</h3>
													<p>{test._doc.description}</p>
													<span>
														<strong>Date de Desponibilité :</strong>
													</span>
													<ul>
														<h6>{test.date}</h6>
													</ul>
													<h4 className=" flex flex-row pt-4">
														<button
															type="button"
															className=" btn btn-outline-secondary"
															onClick={() =>
																navigate(
																	`/evalution/test/testDetails/${test._doc._id}`
																)
															}
														>
															Devrais savoir
														</button>{" "}
														<button
															type="button"
															className=" btn btn-outline-success"
															data-bs-toggle="modal"
															data-bs-target="#verticalycentered"
															disabled={test.etat ? true : false}
															style={
																test.etat
																	? { cursor: "not-allowed", color: "gray" }
																	: {}
															}
														>
															Commencer
														</button>
													</h4>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						<div className="modal fade" id="verticalycentered" tabIndex={-1}>
							<div className="modal-dialog modal-dialog-centered">
								<div className="modal-content">
									<div className="modal-header">
										<h4 className="modal-title">Evalution en ReactJS</h4>
										<button
											type="button"
											className="btn-close"
											data-bs-dismiss="modal"
											aria-label="Close"
										/>
									</div>
									<div className="modal-body">
										<p>
											Non omnis incidunt qui sed occaecati magni asperiores est
											mollitia. Soluta at et reprehenderit.
										</p>
										<ul>
											<li>Vous avez 15 question à choix unique </li>
											<li>Dans 15 minutes </li>
										</ul>
										<span className="badge badge-danger">
											Avant de commencer :
										</span>
										<ul>
											<li>
												Assurez-vous que votre connexion Internet est fiable{" "}
											</li>
											<li>
												Vous pouvez repasser cette évalution une seul fois{" "}
											</li>
										</ul>
									</div>
									<div className="modal-footer">
										<button
											type="button"
											className="btn btn-secondary"
											data-bs-dismiss="modal"
										>
											Annuler
										</button>
										<Link to="/evalution/test/passTest">
											<button
												className="btn btn-outline-danger"
												data-bs-dismiss="modal"
												type="button"
											>
												commencer
											</button>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* End Test  Section */}
			</div>
		</>
	);
}
