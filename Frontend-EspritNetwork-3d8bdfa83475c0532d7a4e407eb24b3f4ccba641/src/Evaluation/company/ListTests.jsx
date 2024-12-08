import { useEffect, useState } from "react";
import { FilterCard } from "../card/FilterCard";
import "../Evaluation.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Navbar } from "../../Home/Navbar";
export function ListTests() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [allTests, setAllTests] = useState([]);
	const [technologies, setTechnologies] = useState([]);
	// Récupérer idOffre depuis le localStorage
	var idOffreRecupere = JSON.parse(localStorage.getItem("idOffre"));
	var idCandidat = JSON.parse(localStorage.getItem("idCandidat"));

	// Afficher la valeur récupérée
	console.log("L'identifiant de l'offre récupéré est : ", idOffreRecupere);
	const [sendTest, setSendTest] = useState({
		idTest: "",
		idCandidat: idCandidat,
		idOffre: idOffreRecupere,
		dateFin: new Date(),
		message: "",
	});
	const [filters, setFilters] = useState({
		technology: "",
		domain: "",
		categorie: "",
	});

	const filteredTests = allTests
		? allTests.filter((test) => {
				return (
					test.technologie == filters.technology ||
					(filters.technology === "" &&
						(test.domaine === filters.domain || filters.domain === "") &&
						(test.categorie === filters.categorie || filters.categorie === ""))
				);
		  })
		: [];
	// console.log("filteredTests : ", filteredTests);

	const handleFilterChange = (filterName, filterValue) => {
		setFilters({ ...filters, [filterName]: filterValue });
	};

	useEffect(() => {
		const getAllTest = async () => {
			await axios
				.get(`http://localhost:3000/test/getall`)
				.then((response) => {
					setAllTests(response.data);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err.message);
					setLoading(false);
				});
		};
		axios.get("http://localhost:3000/competence/getAll").then((response) => {
			const formattedTechnologies = response.data.map((tech) => ({
				name: tech.name,
			}));
			setTechnologies(formattedTechnologies);
		});
		getAllTest();
	}, []);
	const handleDelete = async (id) => {
		await axios
			.delete(`http://localhost:3000/test/delete/` + id)
			.then(() => {
				// console.log(response.data);
				const tes = filteredTests.filter((t) => t._id !== id);
				setAllTests(tes);
				toast.success("Test a eté supprimer  avec succès !!", {
					duration: 2500,
				});
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
	const handleChangeSendTest = (e) => {
		setSendTest({ ...sendTest, [e.target.name]: e.target.value });
	};

	const handleSendTest = async () => {
		console.log("sendTest : ", sendTest);
		try {
			await axios
				.post(`http://localhost:3000/test/affecterTest`, sendTest)
				.then((response) => {
					console.log("response sendTest : ", response.data);
					toast.success(response.data.message, {
						duration: 3500,
					});
				})
				.catch((err) => {
					console.log(err.message);
				});
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<>
			<div>
				<Navbar />
				{/* ======= Test Section ======= */}
				<section id="services" className="section py-5">
					<div className="container">
						<div className="row">
							<Toaster />
							<div className="col-12">
								<h1 className="text-black">Filtrage </h1>
							</div>
							<div className="col-3">
								{/* Card de filtrage pour la technologie */}
								<FilterCard
									title="Technologie"
									options={technologies.map((tech) => tech.name)}
									onFilterChange={(value) =>
										handleFilterChange("technology", value)
									}
								/>
								{/* Card de filtrage pour le domaine */}
								<FilterCard
									title="Domaine"
									options={["Web", "Mobile", "IA", "Big Data"]}
									onFilterChange={(value) =>
										handleFilterChange("domain", value)
									}
								/>
								{/* Card de filtrage pour la catégorie */}
								<FilterCard
									title="Catégorie"
									options={["Backend", "Frontend", "Autre"]}
									onFilterChange={(value) =>
										handleFilterChange("categorie", value)
									}
								/>
							</div>
							<div className="col-9">
								{loading ? (
									<div className="position-relative">
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
										{filteredTests.length === 0 ? (
											<div className="row justify-content-center py-5 ">
												<div>
													<h5 className="text-danger py-5">
														Vous n&apos;avez créé aucun test. Accédez à la page
														Évaluation et créez des tests pour les utiliser dans
														votre processus de recrutement.
													</h5>
												</div>
											</div>
										) : (
											<>
												{/* <TestListCard tests={filteredTests} /> */}
												<div className="row">
													<div className="col-3 ">
														<p className="n-title">Résultats</p>
													</div>
													<div className="col-9 ">
														<hr />
													</div>
													{filteredTests.map((test, index) => (
														<div key={index} className="col-12 py-2">
															<div className="card card-test ms-5 p-3">
																<div className="flex d-flex justify-content-between">
																	<h4>
																		Test.
																		<span style={{ color: "#Cf0000" }}>
																			{test.technologie}
																		</span>
																	</h4>
																	<h4>
																		<button
																			className="btn btn-outline"
																			type="button"
																			onClick={() =>
																				navigate(
																					`/evalution/test/eye/${test._id}`
																				)
																			}
																		>
																			<i className=" btn btn-outline-success fas fa-eye"></i>
																		</button>
																		<button
																			className="btn btn-outline"
																			type="button"
																			onClick={() =>
																				navigate(
																					`/evalution/test/update/${test._id}`
																				)
																			}
																		>
																			<i className="btn btn-outline-secondary fas fa-edit"></i>
																		</button>
																		<button
																			className="btn btn-outline"
																			type="button"
																			data-bs-toggle="modal"
																			data-bs-target="#verticalycentered"
																			onClick={() => {
																				setSendTest({
																					...sendTest,
																					idTest: test._id,
																				});
																			}}
																		>
																			<i className="btn btn-outline-secondary fa-regular fa-paper-plane"></i>
																		</button>
																	</h4>
																</div>

																<h4 className=" ms-2">
																	<strong style={{ color: "#800" }}>
																		{test.domaine}.
																	</strong>
																	<strong style={{ color: "#527edb" }}>
																		{test.categorie}
																	</strong>
																</h4>
																<p>{test.description}</p>
																<div className="flex d-flex justify-content-end">
																	<button
																		className="btn btn-outline-danger"
																		type="button"
																		onClick={() => handleDelete(test._id)}
																	>
																		Delete
																	</button>
																</div>
															</div>
															<div
																className="modal fade"
																id="verticalycentered"
																tabIndex={-1}
															>
																<div className="modal-dialog modal-lg modal-dialog-centered">
																	<div className="modal-content ">
																		<h2 className="modal-title d-flex justify-content-center pt-3 ">
																			Envoyer le test à un candidat
																		</h2>
																		<section
																			id="contact"
																			className="contact py-3"
																		>
																			<div className=" d-flex flex-row">
																				<form className="form-ajout">
																					<div className="mb-3">
																						<label
																							htmlFor="title"
																							className="form-label"
																						>
																							Date de disponibilité
																							<strong>*</strong>
																						</label>
																						<input
																							type="date"
																							name="dateFin"
																							onClick={(e) =>
																								handleChangeSendTest(e)
																							}
																							className="form-control"
																							required
																						/>
																					</div>

																					<div className="mb-3">
																						<label
																							htmlFor="image"
																							className="form-label"
																						>
																							Message
																						</label>
																						<textarea
																							className="form-control"
																							id="message"
																							name="message"
																							required
																							onClick={(e) =>
																								handleChangeSendTest(e)
																							}
																							placeholder="message"
																						></textarea>
																					</div>
																				</form>
																			</div>
																		</section>

																		<div className="modal-footer">
																			<button
																				type="button"
																				className="btn btn-secondary"
																				data-bs-dismiss="modal"
																			>
																				Annuler
																			</button>

																			<button
																				className="btn btn-outline-danger"
																				type="button"
																				onClick={handleSendTest}
																				data-bs-dismiss="modal"
																			>
																				Envoyer
																			</button>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
				{/* End Test Section */}
			</div>
		</>
	);
}
