import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";;
import { pdfjs } from "react-pdf";
import Swal from 'sweetalert2';

const Apply = () => {
	const [affiliation, setAffiliation] = useState("");
	const [specialite, setSpecialite] = useState("");
	const [affiliations, setAffiliations] = useState([]);
	const [departements, setDepartements] = useState([]);
	const [options, setOptions] = useState([]);
	const [anneediplome, setAnneediplome] = useState("");
	const [document, setDocument] = useState("");
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo1 = JSON.parse(userInfoString);
	var userId = userInfo1._id;


	const { idoffre, iduser } = useParams();
	const navigate = useNavigate();

	const [formErrors, setFormErrors] = useState({
		affiliation: { touched: false, message: "" },
		anneediplome: { touched: false, message: "" },
		specialite: { touched: false, message: "" },
		options: { touched: false, message: "" },
		document: { touched: false, message: "" },
	});

	const fetchData = async () => {
		try {
			const affResponse = await axios.get(
				"http://localhost:3000/affiliation/getAll"
			);
			setAffiliations(affResponse.data);

			const depResponse = await axios.get(
				"http://localhost:3000/departement/getAll"
			);
			setDepartements(depResponse.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleReset = () => {
		setAffiliation("");
		setSpecialite("");
		setOptions([]);
		setAnneediplome("");
		setDocument("");

		setFormErrors({
			affiliation: { touched: false, message: "" },
			anneediplome: { touched: false, message: "" },
			specialite: { touched: false, message: "" },
			options: { touched: false, message: "" },
			document: { touched: false, message: "" },
		});
	};




	const validateForm = () => {

		const errors = {
			affiliation: {
				touched: true,
				message: affiliation.length === 0 ? "Affiliation est obligatoire !" : "",
			},
			anneediplome: {
				touched: true,
				message: anneediplome === "" ? "Année de diplomation est obligatoire !" : "",
			},
			specialite: {
				touched: true,
				message: specialite.length === 0 ? "Spécialité est obligatoire !" : "",
			},
			options: {
				touched: true,
				message: options.length === 0 ? "Options est obligatoire !" : "",
			},
			document: {
				touched: true,
				message: !document ? "Dossier candidature est obligatoire !" : "",
			},
		};

		if (anneediplome === "en cours") {
			errors.anneediplome.message = "";
		}

		Object.keys(errors).forEach((field) => {
			if (!errors[field].touched) {
				errors[field].message = "";
			}
		});


		setFormErrors(errors);

		return Object.values(errors).every((field) => !field.message);
	};


	const { showToast } = useAppContext();



	const AddedPostuleForm = async () => {
		try {
			if (!validateForm()) {
				return;
			}


			const existingCondidacy = await axios.get(`http://localhost:3000/condidacy/getbyidoffre/${idoffre}`);

			if (existingCondidacy.data.length > 0 && existingCondidacy.data[0].user && existingCondidacy.data[0].user._id === userId) {
				const confirmResult = await Swal.fire({
					icon: 'warning',
					title: 'Attention',
					text: 'Vous avez déjà postulé à cette offre. Votre ancienne candidature sera écrasée par la nouvelle.',
					showCancelButton: true,
					confirmButtonText: 'Écraser',
					cancelButtonText: 'Annuler'
				});

				if (confirmResult.value) {
					const candidacyId = existingCondidacy.data[0]._id;
					await axios.delete(`http://localhost:3000/condidacy/delete/${candidacyId}`);

				} else {
					return;
				}
			}


			//***************************Starting code extract text from pdf  ***************************/

			pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

			const extractText = async (url) => {
				try {
					const pdf = await pdfjs.getDocument({ url }).promise;
					const pages = pdf.numPages;
					const texts = [];

					for (let i = 1; i <= pages; i++) {
						const page = await pdf.getPage(i);
						const textContent = await page.getTextContent();
						const text = textContent.items.map((s) => s.str).join('');
						texts.push(text);
					}

					return texts.join('\n\n');
				} catch (error) {
					alert(error.message);
				}
			};


			const pdfText = await extractText(URL.createObjectURL(document));


			const offreDetails = await axios.get(`http://localhost:3000/offre/getbyid/${idoffre}`);

			const offreCompetences = offreDetails.data.competence.split(',');
			const offreLangues = offreDetails.data.langue.split(',');

			const pdfTextLower = pdfText.toLowerCase();
			const competencesLower = offreCompetences.map(comp => comp.toLowerCase());

			const competencesMatch = competencesLower.every(comp => pdfTextLower.includes(comp));

			const languesLower = offreLangues.map(lang => lang.toLowerCase());

			const languesMatch = pdfText === '' || languesLower.every(lang => pdfTextLower.includes(lang) || lang === 'français' || lang === 'francais');


			const matchingCompetences = competencesLower.filter(comp => pdfTextLower.includes(comp));
			const competencesMatchPercentage = Math.floor((matchingCompetences.length / competencesLower.length) * 100);

			const matchingLangues = languesLower.filter(lang => pdfTextLower.includes(lang) || lang === 'français' || lang === 'francais');
			const languesMatchPercentage = Math.floor((matchingLangues.length / languesLower.length) * 100);


			if (!document) {
				console.error("No file selected");
				return;
			}

			const currentDate = new Date().toISOString().replace(/[:.]/g, "_");
			const documentName = `document_${idoffre}_${iduser}_${currentDate}.pdf`;

			const uploadURL = `http://localhost:3000/upload?documentName=${encodeURIComponent(
				documentName
			)}`;

			const formData = new FormData();
			formData.append("file", document);
			formData.append("documentName", documentName);

			const response = await axios.post(uploadURL, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});


			if (!languesMatch && !competencesMatch) {
				const confirmResultBoth = await Swal.fire({
					icon: 'warning',
					title: 'Attention',
					text: `Votre compétences linguistiques correspondent à ${languesMatchPercentage}% de l'offre, et les compétences correspondent à ${competencesMatchPercentage}%. Est-ce que vous voulez quand même continuer?`,
					showCancelButton: true,
					confirmButtonText: 'Oui',
					cancelButtonText: 'Non',
				});

				if (!confirmResultBoth.value) {
					return;
				}
			} else if (!languesMatch) {
				const confirmResultLangues = await Swal.fire({
					icon: 'warning',
					title: 'Attention',
					text: `Votre compétences linguistiques correspondent  à ${languesMatchPercentage}% de l'offre. Est-ce que vous voulez quand même continuer?`,
					showCancelButton: true,
					confirmButtonText: 'Oui',
					cancelButtonText: 'Non',
				});

				if (!confirmResultLangues.value) {
					return;
				}
			} else if (!competencesMatch) {
				const confirmResultCompetences = await Swal.fire({
					icon: 'warning',
					title: 'Attention',
					text: `Votre competence technique correspondent  à ${competencesMatchPercentage}% de l'offre. Est-ce que vous voulez quand même continuer?`,
					showCancelButton: true,
					confirmButtonText: 'Oui',
					cancelButtonText: 'Non',
				});

				if (!confirmResultCompetences.value) {
					return;
				}
			}

			const postuleData = {
				affiliation: affiliation,
				document: documentName,
				specialite: specialite,
				option: options[0].toString(),
				anneediplome: anneediplome,
				user: iduser,
				offre: idoffre,
			};

			const postuleResponse = await axios.post(
				"http://localhost:3000/condidacy/add",
				postuleData
			);

			const toastData = {
				type: 'success',
				message: 'La postulation a été effectuée avec succès !',
				position: 'top-right',
				style: {
					padding: '15px',
					marginTop: '100px',
				},
			};
			showToast(toastData);

			navigate("/condidat/mesoffres");

		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (!file) {
			return;
		}

		setDocument(file);
		setFormErrors((prevErrors) => ({
			...prevErrors,
			document: { touched: false, message: "" },
		}));
	};

	const getYearOptions = () => {
		const currentYear = new Date().getFullYear() - 1;
		const years = [];
		for (let year = currentYear; year >= 2003; year--) {
			years.push(year.toString());
		}
		return years;
	};

	const yearsOptions = getYearOptions();

	const handleSpecialiteChange = (selectedSpecialite) => {
		const selectedDepartement = departements.find(
			(dep) => dep.specialite === selectedSpecialite
		);
		if (selectedDepartement) {
			setOptions(selectedDepartement.options || []);
		} else {
			setOptions([]);
		}
		setSpecialite(selectedSpecialite);

		setFormErrors((prevErrors) => ({
			...prevErrors,
			specialite: { touched: false, message: "" },
			options: { touched: false, message: "" },
		}));
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div
			className="container"
			style={{ marginTop: "100px" }}
			data-aos="fade-up"
		>
			<div className="section-title">
				{" "}
				<h2>Postuler une offre</h2>{" "}
			</div>
			<div
				className="card shadow mb-5"
				style={{ width: "80%", maxWidth: "600px", margin: "0 auto" }}
			>
				<div className="card-body">
					<div className="row">
						<div className="col-md-12 mb-3">
							<label htmlFor="affiliation" className="form-label">
								Affiliations
							</label>
							<select
								className={`form-control ${formErrors.affiliation.touched &&
									formErrors.affiliation.message && affiliation === ""
									? "is-invalid"
									: ""
									}`}
								id="affiliation"
								value={affiliation}
								onChange={(e) => setAffiliation(e.target.value)}
							>
								<option value="" disabled>
									Sélectionnez une affiliation
								</option>
								{affiliations.map((affiliationOption) => (
									<option
										key={affiliationOption._id}
										value={affiliationOption.name}
									>
										{affiliationOption.name}
									</option>
								))}
							</select>
							{formErrors.affiliation.touched && formErrors.affiliation.message && (
								<div className="invalid-feedback">
									{formErrors.affiliation.message}
								</div>
							)}
						</div>
					</div>

					<div>
						<div className="col-md-12">
							<label htmlFor="anneediplome" className="form-label">
								Année de diplomation
							</label>
							<select
								className={`form-control ${formErrors.anneediplome.touched && formErrors.anneediplome.message && anneediplome === "" ? "is-invalid" : ''}`}
								id="anneediplome"
								value={anneediplome}
								onChange={(e) => setAnneediplome(e.target.value)}
							>
								<option value="" disabled>
									Sélectionnez une année
								</option>
								<option value="en cours">En cours</option>
								{yearsOptions.map((year, index) => (
									<option key={index} value={year}>
										{year}
									</option>
								))}
							</select>
							{formErrors.anneediplome.touched && (
								<div className="invalid-feedback">
									{formErrors.anneediplome.message}
								</div>
							)}
						</div>
					</div>

					<div className="row">
						<div className="col-md-12 mb-3">
							<label htmlFor="specialite" className="form-label">
								Spécialité
							</label>
							<select
								className={`form-control ${formErrors.specialite.touched &&
									formErrors.specialite.message
									? "is-invalid"
									: ""
									}`}
								id="specialite"
								value={specialite}
								onChange={(e) => handleSpecialiteChange(e.target.value)}
							>
								<option value="" disabled>Sélectionnez une spécialité</option>
								{departements.map((departement) => (
									<option key={departement._id} value={departement.specialite}>
										{departement.specialite}
									</option>
								))}
							</select>
							{formErrors.specialite.touched && (
								<div className="invalid-feedback">
									{formErrors.specialite.message}
								</div>
							)}
						</div>
					</div>

					{specialite && (
						<div className="row">
							<div className="col-md-12 mb-3">
								<label htmlFor="options" className="form-label">
									Options
								</label>
								<select
									className={`form-control ${formErrors.options.touched &&
										formErrors.options.message
										? "is-invalid"
										: ""
										}`}
									id="options"
									value={options[0] || ''}
									onChange={(e) => setOptions([e.target.value])}
								>
									{departements
										.filter(dep => dep.specialite === specialite)
										.map((selectedDepartement) => (
											selectedDepartement.options.map((option, index) => (
												<option key={index} value={option}>
													{option}
												</option>
											))
										))}
								</select>
								{formErrors.options.touched && (
									<div className="invalid-feedback">
										{formErrors.options.message}
									</div>
								)}
							</div>
						</div>
					)}

					<div className="row">
						<div className="col-md-12 mb-3">
							<label htmlFor="fileInput" className="form-label">
								Dossier candidature en un seul PDF (CV+LM+Attestations)
							</label>
							<input
								type="file"
								className={`form-control ${formErrors.document.touched &&
									formErrors.document.message
									? "is-invalid"
									: ""
									}`}
								id="fileInput"
								onChange={handleFileChange}
							/>
							{formErrors.document.touched && (
								<div className="invalid-feedback">
									{formErrors.document.message}
								</div>
							)}
						</div>
					</div>

					<div className="container d-flex justify-content-center align-items-center">
						<button
							type="button"
							className="btn btn-outline-secondary btn-block mt-2 mx-2"
							style={{ width: "130px" }}
							onClick={handleReset}
						>
							Reset
						</button>

						<button
							type="button"
							className="btn btn-outline-primary btn-block mt-2 mx-2"
							style={{ width: "130px" }}
							onClick={AddedPostuleForm}
						>
							Valider
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Apply;
