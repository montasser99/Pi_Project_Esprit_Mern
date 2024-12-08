import { useEffect, useState } from "react";
import "../Evaluation.css";
import "./question.css";
import axios from "axios";
import { OptionInput } from "./OptionInput";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

export function EditQ() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [technologies, setTechnologies] = useState([]);
	const [domaines, setDomaines] = useState([]);
	const [optionsUpdated, setOptionsUpdated] = useState([]);

	const [updatedQuestion, setUpdatedQuestion] = useState({
		domaine: "",
		categorie: "",
		technologie: "",
		titre: "",
		options: [],
		niveau: "",
	});
	const handleChangeIsCorrect = (id) => {
		const updated = optionsUpdated.map((opt, index) => ({
			...opt,
			isCorrect: index === id,
		}));
		setOptionsUpdated(updated);
	};

	const handleRemoveOption = (index) => {
		const updated = optionsUpdated.filter((_, idx) => idx !== index);
		setOptionsUpdated(updated);
	};

	const handleOptionChange = (index, value) => {
		const updated = optionsUpdated.map((opt, idx) =>
			idx === index ? { ...opt, option: value } : opt
		);
		setOptionsUpdated(updated);
	};

	const handleQuestionChange = (e) => {
		setUpdatedQuestion({ ...updatedQuestion, [e.target.name]: e.target.value });
		console.log("updatedQuestion :", updatedQuestion);
	};

	const handleAddOption = () => {
		console.log("option : ", optionsUpdated);
		setOptionsUpdated([...optionsUpdated, { option: "", isCorrect: false }]);
	};

	const handleUpdateQuestion = async () => {
		try {
			const updatedQuestionWithOptions = {
				...updatedQuestion,
				options: optionsUpdated.flat(),
			};

			const response = await axios.put(
				"http://localhost:3000/question/update/" + id,
				{
					updatedQuestion: updatedQuestionWithOptions,
				}
			);

			console.log("Question updated successfully:", response.data);
			toast.success("Question mise à jour avec succès !!", {
				duration: 2500,
			});
		} catch (error) {
			console.error("Error updating question:", error);
		}
	};

	useEffect(() => {
		console.log("id :", id);
		axios
			.get("http://localhost:3000/question/getbyid/" + id)
			.then((response) => {
				setUpdatedQuestion(response.data);
				setOptionsUpdated(response.data.options);
				console.log(" getbyid Question : ", response.data);
				setLoading(false);
			});
		axios.get("http://localhost:3000/domaine/getAll").then((response) => {
			setDomaines(response.data);
			setLoading(false);
		});
		axios.get("http://localhost:3000/competence/getAll").then((response) => {
			setTechnologies(response.data);
			setLoading(false);
		});
	}, [id]);
	return (
		<div>
			<section id="contact" className="contact py-5">
				<div className="container py-5" data-aos="fade-up">
					<Toaster />
					<div className="section-title pt-5">
						<h2 className="text-black" >Modification d&apos;une question</h2>
					</div>
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
							<div className="row">
								<div className="col-lg-12 mt-5 mt-lg-0 d-flex align-items-stretch">
									<form className="form-ajout">
										<div className="row">
											<div className="form-group col-md-6">
												<label className="py-2"> Domaine </label>
												<input
													className="form-control"
													list="domaine"
													name="domaine"
													value={updatedQuestion.domaine}
													onChange={handleQuestionChange}
												/>

												<datalist id="domaine">
													{domaines.map((item, index) => (
														<option value={item.name} key={index}></option>
													))}
												</datalist>
											</div>
											<div className="form-group col-md-6">
												<div className="form-group ">
													<label className="py-2"> Catégorie </label>
													<select
														className="form-select"
														name="categorie"
														value={updatedQuestion.categorie}
														onChange={handleQuestionChange}
													>
														<option>Selectionner</option>
														<option>Backend</option>
														<option>Frontend</option>
														<option>Autre</option>
													</select>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="form-group col-md-6">
												<div className="form-group ">
													<label className="py-2"> Technologies </label>
													<input
														className="form-control"
														list="technologie"
														name="technologie"
														value={updatedQuestion.technologie}
														onChange={handleQuestionChange}
													/>

													<datalist id="technologie">
														{technologies.map((item, index) => (
															<option value={item.name} key={index}></option>
														))}
													</datalist>
												</div>
											</div>
											<div className="form-group col-md-6">
												<div className="form-group ">
													<label className="py-2"> Niveau</label>
													<select
														name="niveau"
														value={updatedQuestion.niveau}
														className="form-select"
														onChange={handleQuestionChange}
													>
														<option value="Basique">Basique</option>
														<option value="Intermédiaire">Intermédiaire</option>
														<option value="Avancé"> Avancé</option>
													</select>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="form-group col-md-12">
												<label>Titre de la question :</label>
												<input
													type="text"
													className="form-control"
													id="questionInput"
													name="titre"
													value={updatedQuestion.titre}
													onChange={handleQuestionChange}
												/>
											</div>
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
													{optionsUpdated.map((option, index) => (
														<OptionInput
															key={index}
															option={option}
															onChange={(e) =>
																handleOptionChange(index, e.target.value)
															}
															onRemove={() => handleRemoveOption(index)}
															onToggleCorrect={() =>
																handleChangeIsCorrect(index)
															}
														/>
													))}
												</ul>
											</div>
										</div>
										<div className="d-flex justify-content-end">
											<button
												type="reset"
												className="btn mx-2"
												style={{
													color: "white",
													backgroundColor: "#cf0000",
												}}
												onClick={() => navigate("/evalution")}
											>
												Annuler
											</button>
											<button
												type="button"
												className="btn"
												style={{
													color: "white",
													backgroundColor: "#37517e",
												}}
												onClick={handleUpdateQuestion}
											>
												Enregistrer
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
