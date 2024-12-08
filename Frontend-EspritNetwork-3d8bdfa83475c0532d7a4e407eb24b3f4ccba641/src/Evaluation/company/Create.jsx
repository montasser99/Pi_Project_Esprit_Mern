import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import "../Evaluation.css";
import { OptionInput } from "../question/OptionInput";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Navbar } from "../../Home/Navbar";
import Swal from "sweetalert2";

export function Create() {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [technologies, setTechnologies] = useState([]);
	const [domaines, setDomaines] = useState([]);
	const [options, setOptions] = useState([]);
	const [newQuestion, setNewQuestion] = useState({
		domaine: "",
		categorie: "",
		technologie: "",
		titre: "",
		niveau: "",
		options: [],
	});
	const [questions, setQuestions] = useState([]);
	const [listQuestions, setListQuestions] = useState([]);
	const [test, setTest] = useState({
		domaine: "",
		categorie: "",
		technologie: "",
		duree: 0,
		niveau: "",
		questions: [],
		description: "",
	});
	/**********Question**********/
	const handleAddOption = () => {
		setOptions([...options, { option: "", isCorrect: false }]);
	};

	const handleChangeIsCorrect = (id) => {
		const updatedOptions = options.map((opt, index) => ({
			...opt,
			isCorrect: index === id,
		}));
		setOptions(updatedOptions);
	};

	const handleRemoveOption = (index) => {
		const updatedOptions = options.filter((_, idx) => idx !== index);
		setOptions(updatedOptions);
	};

	const handleOptionChange = (index, value) => {
		const updatedOptions = options.map((opt, idx) =>
			idx === index ? { ...opt, option: value } : opt
		);
		setOptions(updatedOptions);
	};
	const handleNewQuestionChange = (e) => {
		setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
	};

	const handleCreateQuestion = async () => {
		// Check if any attribute in newQuestion is empty
		const isEmpty = Object.values(newQuestion).some(val => val === '');
		if (isEmpty) {
			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: 'Veuillez remplir tous les champs pour ajouter une question !',
			});
			return;
		}

		try {
			const response = await axios.post("http://localhost:3000/question/add", {
				...newQuestion,
				options,
			});

			console.log("Question added successfully:", response.data);
			updateQ(response.data.question);
			toast.success("Question ajouté avec succès !!", {
				duration: 2500,
			});

			// Show SweetAlert notification
			Swal.fire({
				icon: 'success',
				title: 'Success',
				text: 'Question ajoutée avec succès !',
			});
		} catch (error) {
			console.error("Error adding question:", error);
		}
	};


	useEffect(() => {
		const getAllQuestion = async () => {
			await axios
				.get(`http://localhost:3000/question/getall`)
				.then((response) => {
					setListQuestions(response.data);
					console.log("ListQuestions", response.data);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err.message);
					setLoading(false);
				});
		};

		axios.get("http://localhost:3000/domaine/getAll").then((response) => {
			setDomaines(response.data);
		});
		axios.get("http://localhost:3000/competence/getAll").then((response) => {
			setTechnologies(response.data);
			console.log("Technologies : ", response.data);
		});

		getAllQuestion();
	}, []);

	/**********Question**********/
	/***TEST Creation****/
	const updateQ = (item) => {
		const q = questions.find((q) => q._id === item._id);

		if (q) {
			// If the question is already in the list, remove it
			const updatedQuestions = questions.filter((q) => q._id !== item._id);
			setQuestions(updatedQuestions);
			console.log("updatedQuestions", updatedQuestions);
		} else {
			// If the question is not in the list, add it
			setQuestions((prevQuestions) => {
				const newQuestions = [...prevQuestions, item];
				console.log("questions", newQuestions);
				return newQuestions;
			});
		}
	};



	const handleTestChange = (e) => {
		setTest({ ...test, [e.target.name]: e.target.value });
	};

	const handleAddTest = (e) => {
		e.preventDefault();



		// Check if any attribute in test or questions is empty
		if (test.domaine == "" && test.questions.length == 0 && test.description == "" && test.niveau == ""&& test.duree == 0){
			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: 'Veuillez remplir tous les champs pour ajouter un test !',
			});
			return;
		}

		axios.post(`http://localhost:3000/test/add`, {
			...test,
			questions,
		})
			.then((response) => {
				console.log(response.data);
				toast.success("Test ajouté avec succès !!", {
					duration: 2500,
				});

				// Show SweetAlert notification
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Test ajouté avec succès !',
				});
			})
			.catch((err) => {
				console.log(err.response.data.message);
				// Show SweetAlert error message
				Swal.fire({
					icon: 'error',
					title: 'Erreur',
					text: 'Erreur lors de l\'ajout du test. Veuillez réessayer !',
				});
			});
	};

	/***TEST Creation****/

	return (
		<>
			<div>
				<Navbar />
				<section id="contact" className="contact  py-5">
					<div className="container py-5">
						<div className="section-title py-5">
							<h2 className="text-black">Création d&apos;un Test </h2>
						</div>
						<div className="row">
							<Toaster />
							<div className="col-lg-12 mt-5 mt-lg-0 d-flex align-items-stretch">
								<form className="form-ajout">
									<div className="row">
										<div className="col-6 py-2">
											<div className="form-group ">
												<label className="py-2"> Domaine </label>
												<input
													className="form-control"
													list="domaine"
													name="domaine"
													onChange={(e) => {
														handleTestChange(e);
														const l = listQuestions.filter(
															(q) => q.domaine === e.target.value
														);
														setListQuestions(l);
													}}
												/>

												<datalist id="domaine">
													{domaines.map((item, index) => (
														<option value={item.name} key={index}></option>
													))}
												</datalist>
											</div>
										</div>
										<div className="col-6 py-2">
											<div className="form-group ">
												<label className="py-2"> Catégorie </label>
												<select
													className="form-select"
													name="categorie"
													onChange={(e) => {
														handleTestChange(e);
													}}
												>
													<option>Autre</option>
													<option>Backend</option>
													<option>Frontend</option>
												</select>
											</div>
										</div>
									</div>
									<div className="row py-2">
										<div className="col-6 ">
											<div className="form-group ">
												<label className="py-2"> Technologies </label>
												<input
													className="form-control"
													list="technologie"
													name="technologie"
													onChange={(e) => {
														handleTestChange(e);
														const l = listQuestions.filter(
															(q) => q.technologie === e.target.value
														);
														setListQuestions(l);
													}}
												/>

												<datalist id="technologie">
													{technologies.map((item, index) => (
														<option value={item.name} key={index}></option>
													))}
												</datalist>
											</div>
										</div>
										<div className="col-6">
											<label className="py-2">Durée</label>
											<input
												type="numbre"
												className="form-control"
												placeholder="Durée en minutes"
												name="duree"
												onChange={handleTestChange}
											/>
										</div>
									</div>
									<div className="row py-2">
										<div className="col">
											<label className="py-2">Description</label>

											<textarea
												className=" form-control textarea  "
												placeholder="ajouter une description "
												name="description"
												onChange={handleTestChange}
											/>
										</div>
									</div>
									<br />
									{loading ? (
										<div
											className="position-relative"
											style={{ marginTop: "15rem" }}
										>
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
											<div className=" d-flex flex-row row py-2">
												<h3 className="col-3 py-2">
													Liste des Questions
													<a
														className="mx-3 btn btn-outline-success"
														data-bs-toggle="modal"
														data-bs-target="#verticalycentered"
													>
														<MdAdd />
													</a>{" "}
												</h3>
											</div>
											<div className="row">
												<div className="col-11">
													<table className="table table-hover ">
														<thead>
															<tr>
																<th></th>
																<th>Titre</th>
																<th>Domaine</th>
																<th>Technologie</th>
																<th>Niveau </th>
															</tr>
														</thead>
														<tbody>
															{listQuestions.map((item, index) => (
																<tr key={index}>
																	<td scope="row">
																		<input
																			type="checkbox"
																			checked={questions.some(
																				(q) => q._id === item._id
																			)}
																			onChange={() => updateQ(item)}
																		/>
																	</td>
																	<td>{item.titre}</td>
																	<td>{item.domaine}</td>
																	<td>{item.technologie}</td>
																	<td>{item.niveau}</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									)}
									<div className="d-flex justify-content-end ">
										<button
											type="button"
											className="btn btn-outline-danger mx-2  "
											onClick={() => navigate("/evalution")}
										>
											Annuler
										</button>
										<button
											type="button"
											className="btn btn-outline-success  "
											onClick={handleAddTest}
										>
											Enregistrer
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* Modal pour ajouter une nouvelle question */}

			<div className="modal fade" id="verticalycentered" tabIndex={-1}>
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content ">
						<h4 className="modal-title d-flex justify-content-center pt-3 ">
							Ajouter une nouvelle question
						</h4>
						<section id="contact" className="contact  py-5">
							<div className=" d-flex flex-row">
								<form className="form-ajout">
									<div className="row">
										<div className="form-group col-md-6">
											<label>Domaine</label>
											<input
												type="text"
												className="form-control"
												required
												name="domaine"
												onChange={handleNewQuestionChange}
											/>
										</div>
										<div className="form-group col-md-6">
											<label>Catégories</label>
											<input
												type="text"
												className="form-control"
												required
												name="categorie"
												onChange={handleNewQuestionChange}
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group col-md-6">
											<label>Technologie :</label>
											<input
												type="text"
												className="form-control"
												id="questionInput"
												name="technologie"
												onChange={handleNewQuestionChange}
											/>
										</div>
										<div className="form-group col-md-6 ">
											<label> Niveau</label>
											<select
												name="niveau"
												className="form-select"
												onChange={handleNewQuestionChange}
											>
												<option value="Basique">Basique</option>
												<option value="Intermédiaire">Intermédiaire</option>
												<option value="Avancé"> Avancé</option>
											</select>
										</div>
									</div>
									<div className="form-group ">
										<label>Titre :</label>
										<input
											type="text"
											className="form-control"
											id="questionInput"
											name="titre"
											onChange={handleNewQuestionChange}
										/>
									</div>

									<div className="row">
										<div className="form-group col-md-7 ">
											<div className="d-flex align-items-center">
												<label>Options:</label>
												<span type="button" onClick={handleAddOption}>
													<i className="fas fa-plus mx-3"></i>
												</span>
											</div>

											<ul className="row">
												{options.map((option, index) => (
													<OptionInput
														key={index}
														option={option}
														onChange={(e) =>
															handleOptionChange(index, e.target.value)
														}
														onRemove={() => handleRemoveOption(index)}
														onToggleCorrect={() => handleChangeIsCorrect(index)}
													/>
												))}
											</ul>
										</div>
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
								data-bs-dismiss="modal"
								type="button"
								onClick={handleCreateQuestion}
							>
								Enregistrer
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
