import axios from "axios";
import "../Evaluation.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Question } from "../question/card/Question";
import { Navbar } from "../../Home/Navbar";
export function SeeTest() {
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
	const [questions, setQuestions] = useState([]);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:3000/test/getbyid/${id}`)
				.then((response) => {
					setTest(response.data);
					setQuestions(response.data.questions);
					setLoading(false);
				})
				.catch((error) => {
					console.error("Error fetching test:", error);
					setLoading(false);
				});
		}
	}, [id]);

	const navigateToQuestion = (questionId) => {
		navigate(`/evalution/test/question/${questionId}`);
	};

	return (
		<>
			<div>
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
								<div
									className="spinner-border  spinner-border-lg"
									role="status"
								>
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
												<li>
													<strong>Entreprise</strong>:
													<a href="#">www.example.com</a>
												</li>
											</ul>
										</div>
										<div className="portfolio-info">
											<h3>Test Description</h3>
											<p>{test.description}</p>
										</div>
									</div>
									<div className="col-lg-8">
										<Question
											count={count}
											question={questions[count]}
											questions={questions}
											setCount={setCount}
											navigateToQuestion={navigateToQuestion}
										/>
									</div>
								</div>
							</div>
						</section>
					)}
				</div>
			</div>
		</>
	);
}
