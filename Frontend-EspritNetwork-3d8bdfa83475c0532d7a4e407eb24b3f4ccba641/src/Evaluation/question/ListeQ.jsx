import { useEffect, useState } from "react";
import FilterBar from "./card/FilterBar";
import "../Evaluation.css";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export function ListeQ() {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [questions, setQuestions] = useState([]);
	const [filters, setFilters] = useState({
		domaine: "",
		categorie: "",
		technologies: "",
	});

	const handleFilterChange = (filterName, filterValue) => {
		setFilters({ ...filters, [filterName]: filterValue });
	};

	useEffect(() => {
		const getAllQuestion = async () => {
			console.log("/***** Get All Questions ******/");
			await axios
				.get(`http://localhost:3000/question/getall`)
				.then((response) => {
					console.log(response);
					setQuestions(response.data);

					setLoading(false);
				})
				.catch((err) => {
					console.log(err.message);
					setLoading(false);
				});
		};
		getAllQuestion(); // Filtrage des questions
	}, []);

	const filteredQuestions = questions
		? questions.filter((question) => {
				const isDomaineMatch =
					!filters.domaine || question.domaine === filters.domaine;
				const isCategorieMatch =
					!filters.categorie || question.categorie === filters.categorie;
				const isTechnologiesMatch =
					!filters.technologies ||
					question.technologies.includes(filters.technologies);

				return isDomaineMatch && isCategorieMatch && isTechnologiesMatch;
		  })
		: [];
	const handleDeleteQuestion = async (id) => {
		await axios
			.delete(`http://localhost:3000/question/delete/` + id)
			.then((response) => {
				console.log(response.data);
				const qts = questions.filter((q) => q._id !== id);
				setQuestions(qts);
				toast.success("Question a eté supprimer  avec succès !!", {
					duration: 1500,
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
	return (
		<div>
			<section id="why-us" className="why-us section-bg py-5">
				<div className="container py-5">
					<div className="section-title py-5">
						<h2  className="text-black" >Liste des questions</h2>
					</div>
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
						<div>
							<div className="row">
								<FilterBar onFilterChange={handleFilterChange} />
							</div>
							<Toaster />
							<div className="row py-5">
								<div className="accordion-list">
									<ul className="flex-column  d-flex  ">
										{filteredQuestions.map((question, index) => (
											<li key={index} className="col-12">
												<a
													data-bs-toggle="collapse"
													className="collapse d-flex justify-content-start"
													data-bs-target={`#accordion-list-${index}`}
												>
													<span className="mx-5">{index}</span>{" "}
													<strong>{question.titre}</strong>
													<i className="icon-i bx bx-chevron-up icon-close" />
													<i className="icon-i bx bx-chevron-down icon-show" />
												</a>
												<div
													id={`accordion-list-${index}`}
													className="collapse "
													data-bs-parent=".accordion-list"
												>
													<ul className="flex d-flex justify-content-center">
														<h5 className="py-3">Les alternatives : </h5>
														{question.options.map((option, k) => (
															<li key={k} className="col">
																{option.isCorrect ? (
																	<span style={{ color: "green" }}>
																		{option.option}
																	</span>
																) : (
																	<span>{option.option}</span>
																)}
															</li>
														))}
													</ul>
													<div className="flex d-flex justify-content-between">
														<a className=" py-2 flex d-flex justify-content-center ">
															<i
																className="fas fa-edit mx-2"
																onClick={() =>
																	navigate(
																		`/evalution/question/update/${question._id}`
																	)
																}
															></i>
														</a>
														<a className=" flex d-flex justify-content-center ">
															<i
																className="fas fa-trash "
																onClick={() =>
																	handleDeleteQuestion(question._id)
																}
															></i>
														</a>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
