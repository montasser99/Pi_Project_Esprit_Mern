import { useNavigate } from "react-router-dom";
import "../Evaluation.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../../Home/Navbar";
import "ldrs/ring";
import "ldrs/newtonsCradle"; // Default values shown

export function MesTests() {
	const [tests, setTests] = useState([]);
	const [filterType, setFilterType] = useState("all");
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const idCandidat = userId;
	useEffect(() => {
		axios
			.get("http://localhost:3000/test/getTestPasserbyCandidat", {
				params: { idCandidat: idCandidat },
			})
			.then((response) => {
				console.log("test", response.data);
				setTests(response.data);
				setLoading(false);
			});
	}, [idCandidat]);

	// Fonction de filtrage des tests en fonction de l'état
	const filteredTests = tests.filter((test) => {
		if (filterType === "completed") {
			return test.passage.etat === true;
		} else if (filterType === "todo") {
			return test.passage.etat === false;
		} else if (filterType === "dashboard") {
			return test.passage.etat === true;
		}
		return true; // "all"
	});

	return (
		<>
			<div
				className="fullscreen-container"
				style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
			>
				<Navbar />
				<section id="services" className="services  py-5">
					<nav
						id="navbar"
						className="navbar d-flex  align-items-start py-2 section-bg mt-4"
					>
						<ul className="py-2 mx-5 mt-3 ">
							<li>
								<strong
									className="pointerLine cursor-pointer  mx-3"
									style={{ color: filterType === "all" ? "#cf0000" : "black" }}
									onClick={() => setFilterType("all")}
								>
									Tous <i className="fa-solid fa-chalkboard-user mx-3"></i>
								</strong>
							</li>
							<li>
								<strong
									className="pointerLine cursor-pointer active mx-3"
									style={{
										color: filterType === "completed" ? "#cf0000" : "black",
									}}
									onClick={() => setFilterType("completed")}
								>
									Complété <i className="fa-solid fa-hourglass-end mx-3"></i>
								</strong>
							</li>
							<li>
								<strong
									className="pointerLine  cursor-pointer active mx-3"
									style={{ color: filterType === "todo" ? "#cf0000" : "black" }}
									onClick={() => setFilterType("todo")}
								>
									à faire <i className="fa-solid fa-hourglass-start mx-3"></i>
								</strong>
							</li>
							<li>
								<strong
									className="pointerLine  cursor-pointer active mx-3"
									style={{
										color: filterType === "dashboard" ? "#cf0000" : "black",
									}}
									onClick={() => setFilterType("dashboard")}
								>
									Dashboard
									<i className="fa fa-tachometer mx-3" aria-hidden="true"></i>
								</strong>
							</li>
						</ul>
					</nav>{" "}
					<div className="container">
						<div className="section-title">
							<h2 className="text-black">Vos Tests </h2>
						</div>
						{loading ? (
							<div className="d-flex justify-content-center py-5 ">
								<div className="py-5">
									<l-newtons-cradle
										size="250"
										speed="1.1"
										color="#cf0000"
									></l-newtons-cradle>
								</div>
							</div>
						) : (

							
								tests.length === 0 ? (
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
									<div className="row py-5">
										{filterType === "dashboard"
											? filteredTests.map((test, index) => (
												<div className="col-lg-6 mt-4 " key={index}>
													<div className="member d-flex align-items-start py-3 m-2">
														<div className="member-info">
															<h4>Test en {test.test.technologie}</h4>
															<strong className="py-1">
																<span> Critère d&apos;évaluation: </span>
															</strong>
															<p>Pour chaque niveau de question : 1 point pour le
																niveau facile, 2 points pour le niveau moyen et 3
																points pour le niveau difficile
															</p>
															<strong><span>Pour l&apos;offre : </span></strong>
															<span className="text-black text-uppercase">
																{test.offre.titre}
															</span>
															<br />	<br />
															<strong className="py-1">
																<span>Votre Score : </span>
															</strong>
															<h3 className=" badge bg-success py-2">
																{test.passage.score}/{test.test.questions.length} {" "}
																Qs
															</h3>
															<br />

														</div>
													</div>
												</div>
											))
											: filteredTests.map((test, index) => (
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
														<p>{test.test.description}</p>
														<h4 className=" flex flex-row pt-4">
															<button
																type="button"
																className=" btn btn-outline-secondary"
																onClick={() => {
																	localStorage.setItem(
																		"etatTest",
																		JSON.stringify(test.passage.etat)
																	);
																	navigate(
																		`/evalution/test/testDetails/${test._doc._id}`
																	);
																}}
															>
																Devrais savoir
															</button>
															<button
																type="button"
																className=" btn btn-outline-success"
																data-bs-toggle="modal"
																data-bs-target="#verticalycentered"
																disabled={test.passage.etat ? true : false}
																style={
																	test.passage.etat
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
								)
							)}
					</div>
				</section>
			</div>
		</>
	);
}
