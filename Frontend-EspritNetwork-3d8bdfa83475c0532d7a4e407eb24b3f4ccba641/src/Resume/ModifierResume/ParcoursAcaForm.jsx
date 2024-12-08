import { MdAdd, MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ModifierResume.css";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ParcoursAcaForm = () => {
	const [parcoursacaList, setParcoursacaList] = useState([
		{ diplome: "", etablissement: "", dateDebut: null, dateFin: null },
	]);
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const user = userId;

    
	useEffect(() => {
		fetchParcoursAcaData();
	}, []);

	const fetchParcoursAcaData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/cv/getCvByUserId/${user}`
			);
			const parcoursacaData = response.data.parcoursAcademiques;
			if (parcoursacaData.length > 0) {
				setParcoursacaList(parcoursacaData);
			}
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des parcours académiques:",
				error
			);
		}
	};

	const addchamp = () => {
		setParcoursacaList([
			...parcoursacaList,
			{ diplome: "", etablissement: "", dateDebut: null, dateFin: null },
		]);
	};

	const removechamp = (index) => {
		const updatedParcoursacaList = [...parcoursacaList];
		updatedParcoursacaList.splice(index, 1);
		setParcoursacaList(updatedParcoursacaList);
	};

	const handleParcoursChange = (index, field, value) => {
		const updatedParcoursacaList = [...parcoursacaList];
		updatedParcoursacaList[index][field] = value;
		setParcoursacaList(updatedParcoursacaList);
	};

	const saveParcours = async () => {
		try {
			const cvResponse = await axios.get(`http://localhost:3000/cv/getCvByUserId/${userId}`);
			const cvData = cvResponse.data;
			let cvId = null;
	
			if (cvData) {
				cvId = cvData._id;
			}
	
			if (cvId) {
				await axios.put(`http://localhost:3000/cv/update/${cvId}`, {
					parcoursAcademiques: parcoursacaList
				});
			} else {
				const response = await axios.post("http://localhost:3000/cv/add", {
					parcoursAcademiques: parcoursacaList
				});
				console.log("Parcours académiques enregistrés avec succès:", response.data);
			}
			toast.success("Votre Parcours Académique a été mis à jour avec succès!", { duration: 2500 });
		} catch (error) {
			console.error("Erreur lors de l'enregistrement des parcours académiques:", error);
			toast.error("Une erreur est survenue lors de l'enregistrement des parcours académiques.");
		}
	};
	

	return (
		<div
			className="card cardformulaire shadow"
			data-aos="fade-down"
			data-aos-duration="100"
		>
			<div className="card-body titre">
				{parcoursacaList.map((parcours, index) => (
					<div className="row" key={index}>
						<div className="col-md-4 mb-3">
							<label htmlFor={`diplome-${index}`} className="form-label">
								Diplôme
							</label>
							<input
								type="text"
								className="form-control"
								id={`diplome-${index}`}
								value={parcours.diplome}
								onChange={(e) =>
									handleParcoursChange(index, "diplome", e.target.value)
								}
								placeholder="Diplôme obtenu"
							/>
						</div>
						<div className="col-md-4 mb-3">
							<label htmlFor={`etablissement-${index}`} className="form-label">
								Établissement
							</label>
							<input
								type="text"
								className="form-control"
								id={`etablissement-${index}`}
								value={parcours.etablissement}
								onChange={(e) =>
									handleParcoursChange(index, "etablissement", e.target.value)
								}
								placeholder="Nom de l'établissement"
							/>
						</div>
						<div className="col-md-2 mb-3">
							<label htmlFor={`dateDebut-${index}`} className="form-label">
								Date Début
							</label>
							<DatePicker
								selected={parcours.dateDebut}
								onChange={(date) =>
									handleParcoursChange(index, "dateDebut", date)
								}
								dateFormat="dd/MM/yyyy"
								placeholderText="Date Début"
								className="form-control"
							/>
						</div>
						<div className="col-md-2 mb-3">
							<label htmlFor={`dateFin-${index}`} className="form-label">
								Date Fin
							</label>
							<DatePicker
								selected={parcours.dateFin}
								onChange={(date) =>
									handleParcoursChange(index, "dateFin", date)
								}
								dateFormat="dd/MM/yyyy"
								placeholderText="Date Fin"
								className="form-control"
							/>
						</div>
						<div className="col-lg-1 col-md-1 d-flex justify-content-center align-items-center">
							{index === parcoursacaList.length - 1 && (
								<button
									type="button"
									className="btn btn-success btn-sm mt-1 mx-1"
									onClick={addchamp}
								>
									<MdAdd />
								</button>
							)}
							{index >= 0 && (
								<button
									type="button"
									className="btn btn-danger btn-sm mt-1 mx-1"
									onClick={() => removechamp(index)}
								>
									<MdDelete />
								</button>
							)}
						</div>
					</div>
				))}
				<div className="container d-flex flex-wrap justify-content-center align-items-center">
					<Link to="/resume" className="btn btn-formulaire btn-block mt-2 mx-2">
						Quitter
					</Link>
					<button
						type="button"
						className="btn btn-formulaire btn-block mt-2 mx-2"
						onClick={saveParcours}
					>
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	);
};

export default ParcoursAcaForm;
