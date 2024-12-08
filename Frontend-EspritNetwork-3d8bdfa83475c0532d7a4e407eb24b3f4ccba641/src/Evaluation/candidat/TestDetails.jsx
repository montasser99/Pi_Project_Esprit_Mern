import { useEffect, useState } from "react";
import "../Evaluation.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Navbar } from "../../Home/Navbar";
export function TestDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [test, setTest] = useState({
		domaine: "",
		categorie: "",
		technologie: "",
		duree: 0,
		niveau: "",
		questions: [],
		description: "",
	});
	const etat = localStorage.getItem("etatTest");
	console.log("etat", etat);
	useEffect(() => {
		axios
			.get(`http://localhost:3000/test/getbyid/${id}`)
			.then((response) => {
				setTest(response.data);
				console.log("test", response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching test:", error);
				setLoading(false);
			});
	}, [id]);
	return (
		<>
			{" "}
			<Navbar />
			<div id="main">
				<section id="breadcrumbs" className="breadcrumbs">
					<div className="container">
						<h2 className="text-danger pt-4">Test Details</h2>
					</div>
				</section>
				{loading ? (
					<div className="position-relative" style={{ marginTop: "15rem" }}>
						<div className="position-absolute top-50 start-50 translate-middle">
							<div className="spinner-border  spinner-border-lg" role="status">
								<span className="visually-hidden">
									<div className="loading">Loading</div>
								</span>
							</div>
						</div>
					</div>
				) : (
					<section id="portfolio-details" className="portfolio-details">
						<div className="container">
							<div className="row gy-4">
								<div className="col-lg-4">
									<div className="portfolio-info">
										<h3>Test Details</h3>
										<ul>
											<li>
												<strong>Technologie</strong>: {test.technologie}
											</li>
											<li>
												<strong>Domaine</strong>: {test.domaine}
											</li>
											<li>
												<strong>Catégorie</strong>: {test.categorie}
											</li>
											<li>
												<strong>Durée</strong>: {test.duree} minutes
											</li>
										</ul>
									</div>
									<div className="portfolio-info">
										<h3>Test Description</h3>
										<p>{test.description}</p>
									</div>
								</div>
								<div className=" col-lg-8">
									<div className=" portfolio-info">
										<h3> Quelques points avant de commencer </h3>
										<ul>
											<li>
												<i className="fas fa-check mx-4"></i> Veuillez autoriser
												l&apos;utilisation de votre caméra/webcam
											</li>
											<li>
												<i className="fas fa-check mx-4"></i>
												Ne quittez pas le mode plein écran.
											</li>
											<li>
												<i className="fas fa-check mx-4"></i>
												Des instantanés de vous seront pris périodiquement
												pendant l&apos;évaluation.
											</li>
											<li>
												<i className="fas fa-check mx-4"></i>Vous pouvez
												repasser cette évalution une seul fois
											</li>
											<li>
												<i className="fas fa-check mx-4"></i> Vous pouvez
												utiliser une calculatrice, un stylo et du papier.
											</li>
										</ul>
										<div className=" py-5 mt-8 flex d-flex  justify-content-center">
											<button
												type="button"
												className="col-4 btn btn-outline-success"
												style={
													etat ? { cursor: "not-allowed", color: "gray" } : {}
												}
												// disabled={etat ? true : false}
												onClick={() => {
													localStorage.setItem(
														"idTest",
														JSON.stringify(test._id)
													);
													navigate(`/evalution/test/passTest/${test._id}`);
												}}
											>
												Commencer
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				)}
			</div>
		</>
	);
}
