import { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useParams, useNavigate } from "react-router-dom";
import "../../Offre.css";
import axios from "axios";
import LangueSelect from "../LangueSelect";
import { useAppContext } from "../../context/AppContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const animatedComponents = makeAnimated();
const ModifierOffre = () => {
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo1 = JSON.parse(userInfoString);
	var userId = userInfo1._id;
	/**************declaration data formulaire and methodes here ******************/

	const [titre, setTitre] = useState("");
	const [description, setDescription] = useState("");
	const [competence, setCompetence] = useState("");
	const [salaire, setSalaire] = useState("");
	const [typeContrat, setTypeContrat] = useState("");
	const [langue, setLangue] = useState("");
	const [experience, setExperience] = useState("");
	const [typeOffre, setTypeOffre] = useState("");
	const [dateExpiration, setDateExpiration] = useState(null);
	const [statusOffre, setStatusOffre] = useState(true);
	const [disableTypeContrat, setDisableTypeContrat] = useState(false);

	const [CompetenceSelect, setCompetenceSelect] = useState([]);

	const handleReset = () => {
		setTitre("");
		setDescription("");
		setCompetence("");
		setSalaire("");
		setTypeContrat("");
		setLangue("");
		setExperience("");
		setTypeOffre("");

		setFormErrors({
			titre: { touched: false, message: "" },
			typeOffre: { touched: false, message: "" },
			description: { touched: false, message: "" },
			competence: { touched: false, message: "" },
			typeContrat: { touched: false, message: "" },
		});
	};

	const { id } = useParams();

	const navigate = useNavigate();

	useEffect(() => {

		const fetchData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/offre/getbyid/" + id
				);

				const offreData = response.data; 
				setTitre(offreData.titre || "");
				setDescription(offreData.description || "");
				setSalaire(offreData.salaire || "");
				setTypeContrat(offreData.typecontrat || "");
				setExperience(offreData.experience || "");
				setTypeOffre(offreData.typeoffre || "");
				setLangue(offreData.langue || ""); 
				setStatusOffre(offreData.statusOffre || "");

				if (
					offreData.dateExpiration === undefined ||
					offreData.dateExpiration === null
				) {
					setDateExpiration("");
				} else {
					setDateExpiration(new Date(offreData.dateExpiration));
				}

				const competenceData = Array.isArray(offreData.competence)
					? offreData.competence
					: [offreData.competence];


				const competenceOptions = competenceData.map((comp) => ({
					value: comp,
					label: comp,
				}));
				setCompetence(competenceOptions);

				const langueData = Array.isArray(offreData.langue)
					? offreData.langue
					: [offreData.langue];


				const langueOptions = langueData.map((lang) => ({
					value: lang,
					label: lang,
				}));

				setLangue(langueOptions);
			} catch (error) {
				console.error("Error fetching offers:", error);
			}
		};

		fetchData();
	}, [id]);

	useEffect(() => {
		if (typeOffre === "stage") {
			setTypeContrat("stagiaire");
			setDisableTypeContrat(true);
		} else {
			setTypeContrat("");
			setDisableTypeContrat(false);
		}
	}, [typeOffre]);

	useEffect(() => {
		axios.get("http://localhost:3000/competence/getAll").then((response) => {
			const formattedCompetences = response.data.map((comp) => ({
				value: comp.name,
				label: comp.name,
			}));
			setCompetenceSelect(formattedCompetences);
		});
	}, []);

	const [newCompetence, setNewCompetence] = useState("");

	const handleNewCompetenceChange = (e) => {
		setNewCompetence(e.target.value);
	};

	const getTypeContratOptions = () => {
		let contratOptions = [
			{ value: "stagiaire", label: "Stagiaire" },
			{ value: "cdi", label: "CDI (Contrat à Durée Indéterminée)" },
			{ value: "cdd", label: "CDD (Contrat à Durée Déterminée)" },
			{
				value: "CIVP",
				label: "CIVP (Contrat d'Initiation à la Vie Professionnelle)",
			},
		];

		if (typeOffre === "emploi") {
			contratOptions = contratOptions.filter(
				(option) => option.value !== "stagiaire"
			);
		}

		return contratOptions;
	};

	const handleAddCompetence = async () => {
		if (newCompetence.trim() !== "") {
			const isExistingCompetence = CompetenceSelect.some(
				(comp) => comp.label === newCompetence
			);

			if (isExistingCompetence) {
				setFormErrors((prevErrors) => ({
					...prevErrors,
					competence: {
						touched: true,
						message: "Cette compétence existe déjà dans la liste.",
					},
				}));
			} else {
				try {
					const response = await axios.post(
						"http://localhost:3000/competence/add",
						{
							name: newCompetence,
						}
					);

					setCompetence([
						...competence,
						{ label: newCompetence, value: newCompetence },
					]);

					setNewCompetence("");
				} catch (error) {
					console.error("Error adding competence:", error);
				}
			}
		}
	};

	const { showToast } = useAppContext();

	const validdate = (date) => {
		const today = new Date();
		return date && date < today;
	};

	const ModifierOffreForm = async () => {
		try {
			if (!validateForm()) {
				console.error("Form validation failed");
				return;
			}

			if (validdate(dateExpiration) == true) {
				console.error("Form validation failed");
				return;
			}

			const response = await axios.put(
				"http://localhost:3000/offre/update/" + id,
				{
					titre,
					typeoffre: typeOffre,
					description,
					competence: competence.map((option) => option.value).join(","),
					typecontrat: typeContrat,
					salaire,
					langue: (langue || []).map((option) => option.value).join(","),
					experience,
					created_at: new Date(),
					dateExpiration: dateExpiration ? new Date(dateExpiration) : null,
					user: userId,
				}
			);

			const toastData = {
				type: "success",
				message: "Offre modifier avec succès!",
				position: "top-right",
				style: {
					padding: "15px",
					marginTop: "100px",
				},
			};
			showToast(toastData);
			if (statusOffre == true) {
				navigate("/mesoffre");
			} else {
				navigate("/mesarchives");
			}
		} catch (error) {
			console.error("Error adding offre:", error);
		}


	};

	/****Contorle de saisie  ****/

	const [formErrors, setFormErrors] = useState({
		titre: { touched: false, message: "" },
		typeOffre: { touched: false, message: "" },
		description: { touched: false, message: "" },
		competence: { touched: false, message: "" },
		typeContrat: { touched: false, message: "" },
	});
	const validateForm = () => {
		const errors = {
			titre: {
				touched: true,
				message:
					titre.length === 0
						? "Le titre est obligatoire !"
						: titre.length > 70
						? "titre ne doit pas dépasser 70 caractères."
						: "",
			},
			typeOffre: {
				touched: true,
				message: typeOffre.length === 0 ? "Type d'offre est obligatoire !" : "",
			},
			description: {
				touched: true,
				message:
					description.length === 0
						? "Description de l'offre est obligatoire !"
						: description.length > 1300
						? "Description ne doit pas dépasser 1300 caractères."
						: "",
			},
			competence: {
				touched: true,
				message:
					competence.length === 0
						? "Compétence de l'offre est obligatoire !"
						: "",
			},
			typeContrat: {
				touched: true,
				message: typeContrat
					? ""
					: "Type de contrat de l'offre est obligatoire !",
			},
		};

		setFormErrors(errors);

		return Object.values(errors).every((field) => !field.message);
	};

	return (
		<>
			<div
				className="container"
				style={{ marginTop: "100px" }}
				data-aos="fade-up"
			>
				<div className="section-title" data-aos="fade-up">
					<h2 className="text-black">Modifier une offre</h2>{" "}
				</div>
				<div
					className="card shadow mb-5"
					style={{
						borderTop: "3px solid #cf0000",
						borderBottom: "3px solid #cf0000",
						background: "#fff",
						boxShadow: "0 0 24px 0 rgba(0, 0, 0, 0.1)",
					}}
				>
					<div className="card-body">
						<div className="row">
							<div className="col-md-6 mb-3">
								<label htmlFor="titre" className="form-label">
									<strong>Titre </strong>
								</label>
								<input
									type="text"
									className={`form-control ${
										formErrors.titre.touched && formErrors.titre.message
											? "is-invalid"
											: ""
									}`}
									id="titre"
									value={titre}
									onChange={(e) => {
										setTitre(e.target.value);

										if (formErrors.titre.touched) {
											setFormErrors((prevErrors) => ({
												...prevErrors,
												titre: {
													touched: true,
													message: "",
												},
											}));
										}
									}}
									placeholder="Titre de l'offre"
									required
								/>
								{formErrors.titre.message && (
									<div className="invalid-feedback">
										{formErrors.titre.message}
									</div>
								)}
							</div>

							<div className="col-md-6 mb-3">
								<label htmlFor="typeOffre" className="form-label">
									<strong>Type d&apos;Offre</strong>
								</label>
								<select
									className={`form-control ${
										formErrors.typeOffre.touched && formErrors.typeOffre.message
											? "is-invalid"
											: ""
									}`}
									id="typeOffre"
									value={typeOffre}
									onChange={(e) => {
										setTypeOffre(e.target.value);

										if (formErrors.typeOffre.touched) {
											setFormErrors((prevErrors) => ({
												...prevErrors,
												typeOffre: {
													touched: true,
													message: "",
												},
											}));
										}
									}}
								>
									<option value="" disabled>
										Sélectionnez le type d&apos;offre
									</option>
									<option value="stage">Stage</option>
									<option value="emploi">Emploi</option>
								</select>
								{formErrors.typeOffre.message && (
									<div className="invalid-feedback">
										{formErrors.typeOffre.message}
									</div>
								)}
							</div>
						</div>

						<div className="row mx-auto ">
							<label htmlFor="description" className="form-label">
								<strong>Description</strong>
							</label>
							<textarea
								className={`form-control ${
									formErrors.description.touched &&
									formErrors.description.message
										? "is-invalid"
										: ""
								}`}
								id="description"
								rows="3"
								value={description}
								onChange={(e) => {
									setDescription(e.target.value);

									if (formErrors.description.touched) {
										setFormErrors((prevErrors) => ({
											...prevErrors,
											description: {
												touched: true,
												message: "",
											},
										}));
									}
								}}
								placeholder="Description de l'offre"
							></textarea>
							{formErrors.description.message && (
								<div className="invalid-feedback">
									{formErrors.description.message}
								</div>
							)}
						</div>

						<div className="row">
							<div className="col-md-8 mb-3">
								<label htmlFor="competence" className="form-label">
									<strong>Compétence</strong>
								</label>
								<div className="input-group">
									<Select
										isMulti
										components={animatedComponents}
										options={CompetenceSelect}
										value={competence}
										onChange={(selectedOptions) => {
											setCompetence(selectedOptions);

											setFormErrors((prevErrors) => ({
												...prevErrors,
												competence: {
													touched: false,
													message: "",
												},
											}));
										}}
										className={`competence-select col-md-7 ${
											formErrors.competence.touched &&
											formErrors.competence.message
												? "errorc"
												: ""
										}`}
									/>
									<div className="input-group-append align-items-start d-flex flex">
										<input
											type="text"
											className="form-control competence-input col-2 ms-2 mx-1"
											placeholder="Nouvelle compétence"
											value={newCompetence}
											onChange={handleNewCompetenceChange}
										/>
										<button
											className="btn btn-outline-secondary square-border-btn ms-2"
											type="button"
											onClick={handleAddCompetence}
										>
											+
										</button>
									</div>
								</div>
								{formErrors.competence.message && (
									<div className="text-danger" style={{ fontSize: "14px" }}>
										<span>{formErrors.competence.message}</span>
									</div>
								)}
							</div>

							<div className="col">
								<label htmlFor="typeContrat" className="form-label">
									<strong>Type de Contrat</strong>
								</label>
								<select
									className={`form-control ${
										formErrors.typeContrat.touched &&
										formErrors.typeContrat.message
											? "is-invalid"
											: ""
									}`}
									id="typeContrat"
									value={typeContrat}
									onChange={(e) => {
										setTypeContrat(e.target.value);

										if (formErrors.typeContrat.touched) {
											setFormErrors((prevErrors) => ({
												...prevErrors,
												typeContrat: {
													touched: false,
													message: "",
												},
											}));
										}
									}}
									disabled={disableTypeContrat}
								>
									<option value="" disabled>
										Sélectionnez le type de contrat
									</option>
									{getTypeContratOptions().map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
								{formErrors.typeContrat.message && (
									<div className="invalid-feedback">
										{formErrors.typeContrat.message}
									</div>
								)}
							</div>
						</div>
						<div className="row">
							<div className="col-md-3 mb-3">
								<label htmlFor="langue" className="form-label">
									<strong>Langue (optionnel)</strong>
								</label>
								<Select
									isMulti
									components={animatedComponents}
									options={LangueSelect}
									value={langue}
									onChange={(selectedOptions) =>
										setLangue(selectedOptions || [])
									}
								/>
							</div>

							<div className="col-md-3 mb-3">
								<label htmlFor="salaire" className="form-label">
									<strong>Salaire (optionnel)</strong>
								</label>
								<input
									type="text"
									className="form-control"
									id="salaire"
									value={salaire}
									onChange={(e) => setSalaire(e.target.value)}
									placeholder="Salaire proposé"
								/>
							</div>

							<div className="col-md-3 mb-3">
								<label htmlFor="experience" className="form-label">
									<strong>Expérience (optionnel)</strong>
								</label>
								<input
									type="number"
									className="form-control"
									id="experience"
									value={experience}
									onChange={(e) => setExperience(e.target.value)}
									placeholder="Expérience requise"
								/>
							</div>

							<div className="col-md-3 mb-3">
								<label htmlFor="dateExpiration" className="form-label">
									<strong>Date d'expiration (optionnel)</strong>
								</label>
								<DatePicker
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="yyyy-MM-dd HH:mm"
									className="form-control"
									id="dateExpiration"
									selected={dateExpiration}
									onChange={(date) => setDateExpiration(date)}
									placeholderText="Date d'expiration"
								/>
								{validdate(dateExpiration) && (
									<div className="text-typi">
										<p>
											La date d'expiration ne peut pas être antérieure à la date
											d'aujourd'hui.
										</p>
									</div>
								)}
							</div>
						</div>

						<div className="container d-flex justify-content-center align-items-center">
							<button
								type="submit"
								className="btn btn-outline-secondary btn-block mt-2 mx-2"
								style={{ width: "130px" }}
								onClick={handleReset}
							>
								Reset
							</button>
							<button
								to="/mesoffre"
								type="submit"
								className="btn btn-outline-primary btn-block mt-2 mx-2"
								style={{ width: "130px" }}
								onClick={() => validateForm() && ModifierOffreForm()}
							>
								Modifier
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default ModifierOffre;
