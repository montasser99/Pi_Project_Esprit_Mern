import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useNavigate } from "react-router-dom";
import "../../Offre.css";
import axios from "axios";
import LangueSelect from "../LangueSelect";
import { pdfjs } from "react-pdf";
import { useAppContext } from "../../context/AppContext";
import DatePicker from "react-datepicker";

const animatedComponents = makeAnimated();

const AjouterOffre = () => {
	/**************declaration data formulaire and methodes here ******************/
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo1 = JSON.parse(userInfoString);
	var userId = userInfo1._id;
	const [formType, setFormType] = useState("formulaire");
	const [titre, setTitre] = useState("");
	const [description, setDescription] = useState("");
	const [competence, setCompetence] = useState("");
	const [salaire, setSalaire] = useState("");
	const [typeContrat, setTypeContrat] = useState("");
	const [langue, setLangue] = useState("");
	const [experience, setExperience] = useState("");
	const [typeOffre, setTypeOffre] = useState("");
	const [disableTypeContrat, setDisableTypeContrat] = useState(false);
	const [dateExpiration, setDateExpiration] = useState(null);
	const [isLoading, setIsLoading] = useState(false); // État pour gérer le chargement



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
		setSelectedFile(null);

		setFormErrors({
			titre: { touched: false, message: "" },
			typeOffre: { touched: false, message: "" },
			description: { touched: false, message: "" },
			competence: { touched: false, message: "" },
			typeContrat: { touched: false, message: "" },
		});
	};

	const { showToast } = useAppContext();

	const navigate = useNavigate();

	useEffect(() => {
		if (typeOffre === "stage") {
			setTypeContrat("stagiaire");
			setDisableTypeContrat(true);
		} else {
			setDisableTypeContrat(false);
		}
	}, [typeOffre]);

	const getTypeContratOptions = () => {
		let contratOptions = [
			{ value: "stagiaire", label: "Stagiaire" },
			{ value: "cdi", label: "CDI (Contrat à Durée Indéterminée)" },
			{ value: "cdd", label: "CDD (Contrat à Durée Déterminée)" },
			{
				value: "civp",
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

	const validdate = (date) => {
		const today = new Date();
		return date && date < today;
	};

	const AddedOffreForm = async () => {

		if (!validateForm()) {
			console.error("Form validation failed");
			return;
		}

		if (validdate(dateExpiration) == true) {
			console.error("Form validation failed");
			return;
		}

		try {
			const response = await axios.post("http://localhost:3000/offre/add", {
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
			});


			const toastData = {
				type: "success",
				message: "Offre ajoutée avec succès!",
				position: "top-right",
				style: {
					padding: "15px",
					marginTop: "100px",
				},
			};
			showToast(toastData);

			navigate("/mesoffre");

		} catch (error) {
			console.error("Error adding offre:", error);
		}


	};

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

	/*************** here code of choosing file and declaration ****************/
	const [selectedFile, setSelectedFile] = useState(null);


	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const handleDrop = (event) => {
		event.preventDefault();

		const droppedFile = event.dataTransfer.files[0];
		setSelectedFile(droppedFile);
	};
	pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

	const readFileAsDataURL = (file) => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				resolve(event.target.result);
			};
			reader.readAsDataURL(file);
		});
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		const { name, size } = event.target.files[0];
		setSelectedFile(file);
	};

	const handleFormAjouter = async () => {
		if (selectedFile) {
			try {
				setIsLoading(true); // Définir isLoading sur true au début du traitement

				const dataUrl = await readFileAsDataURL(selectedFile);
				const pdf = await pdfjs.getDocument({ url: dataUrl }).promise;
				const pages = pdf.numPages;
				const texts = [];

				for (let i = 1; i <= pages; i++) {
					const page = await pdf.getPage(i);
					const textContent = await page.getTextContent();
					const text = textContent.items.map((s) => s.str).join('');
					texts.push(text + "francais.");
				}

				const extractedText = texts.join('\n\n');
				console.log(extractedText)
				if (extractedText) {
					const response = await axios.post(
						'https://next.levity.ai/api/ai/v2/f73fb164-9642-4e3c-ac32-097c0f8e7479/extract',
						{
							text: extractedText,
						},
						{
							headers: {
								Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV5YS5tZWNoZXJndWlAZW5zaS11bWEudG4iLCJsZXZpdHlVc2VySWQiOiI3YzZiZTQ2Yi04ZDlhLTRiZTMtOTQzYS1jYTFjMTY4NDg4ZDIiLCJsZXZpdHlXb3Jrc3BhY2VJZCI6IjU0MjIzNGU2LWE0MzYtNGU1NC04MGUxLWZlOGRhOGM0ZWRhNyIsImlzcyI6Ikxldml0eToyIn0.AfBxtex0oEWStON7Iph_8ynjvpjiqx96Qty698X5FY24Kdpv55WJJJlaFcgz8P5Q6r2-X8EIPank-GTtLu5CbWPRfYCVTnPRR_gXV4ft-oSZ_Tn9tMTBFaSTKCRJPmDK8oiP1MNEVHPcYCrWToNUmeJ6TM7024RPTwjdyYdYCp64SQsiHOxM-SxiHTT-fcbjfFBT_KZT_zx3iWmfpeS7ks9_6A6VMS7Id1BMXbeOkm2GNwhPuFCoh8cjIY6Vrabj4JXd9dUvkTq6JqKzcUiRZtrbdR7LWmEzNOZ_6zJUZKj7B9ORnrN5vevd47m-KkoL6PZiyZr0ZnNqtTVRaFqQkA',
								'Content-Type': 'application/json',
							},
						}
					);

					const { extracted } = response.data;
					setIsLoading(true)
					setTitre(extracted["Titre de l'offre"] || '');
					setDescription(extracted["Description"] || '');
					setSalaire(extracted["Salaire"] || '');
					setExperience(extracted["Expérience"] || '');
					setTypeOffre(extracted["Type d'Offre"] || '');
					setTypeContrat(extracted["Type de Contrat"] || '');

					console.log(response.data)

					if (extracted["Langue"] !== null) {
						let languesExtracted = extracted["Langue"].toLowerCase().split(',').map(langue => langue.trim());
						// Remplacer "francais" par "français" avec la cédille
						languesExtracted = languesExtracted.map(langue => langue === 'francais' ? 'français' : langue);
						const languesCorrespondantes = [];

						languesExtracted.forEach(langueExtracted => {
							LangueSelect.forEach((option) => {
								if (option.value === langueExtracted) {
									languesCorrespondantes.push(option);
								}
							});
						});

						setLangue(languesCorrespondantes);
					} else {
						// Faire quelque chose si extracted["Langue"] est null, par exemple :
						console.error("La langue extraite est null.");
						// Ou vous pouvez définir une valeur par défaut pour la langue
						// setLangue(defaultLangue); // Remplacez defaultLangue par la valeur par défaut souhaitée
					}

					if (extracted["Type de Contrat"] === null) {
						const typeContratFromExtracted = extractedText.toLowerCase();
						const keywords = ['cdi', 'cdd', 'civp', 'stagiaire'];
						const foundKeyword = keywords.find((keyword) => {
							const regex = new RegExp(`\\b${keyword}\\b`, 'i');
							return regex.test(typeContratFromExtracted);
						});
						setTypeContrat(foundKeyword ? foundKeyword.toLowerCase().toString() : '');
					};

					const extractedCompetences = extracted["Compétence"] ? extracted["Compétence"].split(",") : [];

					const responseCompetences = await axios.get("http://localhost:3000/competence/getAll");
					const formattedCompetences = responseCompetences.data.map((comp) => comp.name);

					const newCompetences = extractedCompetences.filter((comp) => !formattedCompetences.includes(comp.trim()));

					if (newCompetences.length > 0) {
						try {
							const response = await axios.post(
								'http://localhost:3000/competence/add',
								{
									competences: newCompetences.map((comp) => ({ name: comp.trim() })),
								}
							);


							setCompetence((prevCompetences) => [
								...prevCompetences,
								...newCompetences.map((comp) => ({ label: comp.trim(), value: comp.trim() })),
							]);

							setNewCompetence('');
						} catch (error) {
							console.error('Error adding competences:', error);
						}
					} else {
						setCompetence(extractedCompetences.map((comp) => ({ label: comp.trim(), value: comp.trim() })));
					}

					setFormType('formulaire');
				} else {
					alert("Aucun texte n'a été extrait du fichier PDF. Veuillez vérifier le contenu du fichier.");
				}
			} catch (error) {
				console.error('Error extracting keywords:', error);
			} finally {
				setIsLoading(false); // Réinitialiser isLoading une fois que le traitement est terminé
			}
		} else {
			alert('No file selected.');
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

			<section id="contact" className="contact py-5">
				<div className="container py-5 my-3" data-aos="fade-up">
					<div className="section-title">
						<h2 className="text-black">Ajouter une offre</h2>
					</div>
					<div className="row">
						<div>
							<div
								className="card shadow mb-5"
								style={{
									borderTop: "3px solid #cf0000",
									borderBottom: "3px solid #cf0000",
									background: "#fff",
									boxShadow: "0 0 24px 0 rgba(0, 0, 0, 0.1)",
								}}
							>
								<div className="mb-3" style={{ backgroundColor: "#F5F5F5" }}>
									<div className="card-body d-flex justify-content-evenly">
										<strong
											className={`strongg text-black cursor-pointer ${formType === "formulaire" ? "active" : ""
												}`}
											onClick={() => setFormType("formulaire")}
										>
											Par formulaire
										</strong>
										<strong
											className={`strongg text-black cursor-pointer ${formType === "fichier" ? "active" : ""
												}`}
											onClick={() => setFormType("fichier")}
										>
											Par fichier
										</strong>
									</div>
								</div>

								{formType === "formulaire" ? (
									<div className="card-body">
										<div className="row">

											<div className="col-md-6 mb-3">
												<label htmlFor="titre" className="form-label">
													<strong>Titre</strong>
												</label>
												<input
													type="text"
													className={`form-control ${formErrors.titre.touched && formErrors.titre.message
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
													className={`form-control ${formErrors.typeOffre.touched &&
														formErrors.typeOffre.message
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

										<div className="row  ">
											<div className="col-md-12 mb-3">
												<label htmlFor="description" className="form-label">
													<strong>Description </strong>
												</label>
												<textarea
													className={`form-control ${formErrors.description.touched &&
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
										</div>

										<div className="row">
											<div className="col-md-8 mb-3">
												<label htmlFor="competence" className="form-label">
													<strong>Compétence </strong>
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
														className={`competence-select col-md-7 ${formErrors.competence.touched &&
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
													<div className="text-typi">
														<span>{formErrors.competence.message}</span>
													</div>
												)}
											</div>

											<div className="col">
												<label htmlFor="typeContrat" className="form-label">
													<strong>Type de Contrat</strong>
												</label>
												<select
													className={`form-control ${formErrors.typeContrat.touched &&
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
													type="number"
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
													dateFormat="MMMM d, yyyy h:mm aa"
													className={`form-control ${validdate(dateExpiration) ? "is-invalid" : ""
														}`}
													id="dateExpiration"
													selected={dateExpiration}
													onChange={(date) => setDateExpiration(date)}
													placeholderText="Date d'expiration"
												/>
												{validdate(dateExpiration) && (
													<div className="text-typi">
														<p>
															La date d'expiration ne peut pas être antérieure à
															la date d'aujourd'hui.
														</p>
													</div>
												)}
											</div>
										</div>

										<div className="row d-flex justify-content-center align-items-center">
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
												onClick={() => validateForm() && AddedOffreForm()}
											>
												Ajouter
											</button>
										</div>
									</div>
								) : (
									<div className="container d-flex flex-column justify-content-center align-items-center" >
										<div className={`alert alert-warning ${isLoading ? 'blur' : ''}`} role="alert">
											<span className="badge bg-warning text-dark">Important!</span> Vérifiez les données à partir de la génération de l'offre et <strong>la date d'expiration </strong> doit être ajoutée manuellement.
										</div>


										<p className={`mb-4 text-center mobileAdd ${isLoading ? 'blur' : ''}`}>
											Facilitez votre processus de recrutement en ajoutant un{" "}
											<strong>
												<u>PDF</u>
											</strong>
											. Votre offre sera automatiquement enrichie pour offrir
											une présentation complète et captivante aux candidats.
										</p>

										<div className={`col-md-6 d-flex flex-column justify-content-center align-items-center ${isLoading ? 'blur' : ''}`}>
											<div
												className={`upload-container ${isLoading ? 'blur' : ''}`}
												onDragOver={handleDragOver}
												onDrop={handleDrop}
											>
												<label htmlFor="fileInput" className="file-label">
													<input
														type="file"
														id="fileInput"
														onChange={handleFileChange}
														className="file-input"
													/>
													<span className="file-text">
														<div>
															<i className="bi bi-arrow-up-circle custom-icon"></i>
														</div>
														{selectedFile
															? `Selected file: ${selectedFile.name}`
															: "Faites glisser et déposez votre fichier ici ou cliquez pour parcourir"}
													</span>
												</label>
												{selectedFile && (
													<div className="file-details mt-3">
														<p>
															File size:{" "}
															{Math.round(selectedFile.size / 1024 / 1024)} MB
														</p>
													</div>
												)}
											</div>

											<div className="d-flex justify-content-center mt-4 mb-5">
												<button
													type="submit"
													className="btn btn-outline-secondary mx-2"
													style={{ width: "130px" }}
												>
													Reset
												</button>
												<button
													type="submit"
													className="btn btn-outline-primary mx-2"
													style={{ width: "130px" }}
													onClick={handleFormAjouter}
												>
													Ajouter
												</button>
											</div>
										</div>

										{isLoading && (
											<div className="loading-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
												<div className="loading-animation animate__animated animate__pulse" style={{ display: 'flex', alignItems: 'center' }}>
													<img
														src="../../public/assets/img/logo-network.png"
														className="blur-1 loading-image"
														style={{ marginRight: '10px' }} 
													/>
													<p className="loading-message">Cette opération peut prendre un peu de temps</p>
												</div>
											</div>
										)}


									</div>

								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
export default AjouterOffre;
