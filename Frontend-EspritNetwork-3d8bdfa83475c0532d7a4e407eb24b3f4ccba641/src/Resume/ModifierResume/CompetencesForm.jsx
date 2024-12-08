import { useState, useEffect } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";

const CompetencesForm = () => {
	const [competencesList, setCompetencesList] = useState([]);
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const user = userId;
	useEffect(() => {
		fetchCompetencesData();
	}, []);

	const fetchCompetencesData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/cv/getCvByUserId/${user}`
			);
			const competencesData = response.data.competences;
			setCompetencesList(competencesData);
		} catch (error) {
			console.error("Erreur lors de la récupération des compétences:", error);
		}
	};

	const saveCompetences = async () => {
		try {
			// Vérifier si le champ de compétences existe pour l'utilisateur
			const cvResponse = await axios.get(`http://localhost:3000/cv/getCvByUserId/${userId}`);
			const cvData = cvResponse.data;
			let cvId = null;
	
			// Si le CV existe, récupérer son ID
			if (cvData) {
				cvId = cvData._id;
			}
	
			// Si le CV existe, mettre à jour les compétences, sinon les ajouter
			if (cvId) {
				// Mettre à jour les compétences
				await axios.put(`http://localhost:3000/cv/update/${cvId}`, {
					competences: competencesList.filter(competence => competence.trim() !== "")
				});
			} else {
				// Ajouter les compétences
				const response = await axios.post("http://localhost:3000/cv/add", {
					competences: competencesList.filter(competence => competence.trim() !== "")
				});
				console.log("Compétences ajoutées avec succès:", response.data);
			}
			toast.success("Vos Compétences ont été mises à jour avec succès !");
		} catch (error) {
			console.error("Erreur lors de l'enregistrement des compétences:", error);
			toast.error("Une erreur est survenue lors de l'enregistrement des compétences.");
		}
	};
	
	const addchamp = () => {
		setCompetencesList([...competencesList, ""]);
	};

	const removechamp = (index) => {
		const updatedCompetencesList = [...competencesList];
		updatedCompetencesList.splice(index, 1);
		setCompetencesList(updatedCompetencesList);
	};

	const handleCompetenceChange = (index, value) => {
		const updatedCompetencesList = [...competencesList];
		updatedCompetencesList[index] = value;
		setCompetencesList(updatedCompetencesList);
	};

	return (
		<div
			className="card cardformulaire shadow"
			data-aos="fade-down"
			data-aos-duration="100"
		>
			<div className="card-body titre">
				{competencesList.map((competence, index) => (
					<div className="row" key={index}>
						<div className="col-md-10 mb-3">
							<label htmlFor={`competence-${index}`} className="form-label">
								Compétence {index + 1}
							</label>
							<input
								type="text"
								className="form-control"
								id={`competence-${index}`}
								value={competence}
								onChange={(e) => handleCompetenceChange(index, e.target.value)}
								placeholder="Entrez la Compétence"
							/>
						</div>
						<div className="col-md-1 d-flex justify-content-center align-items-center">
							{index === competencesList.length - 1 && (
								<button
									type="button"
									className="btn btn-success btn-sm  mt-3 mx-2"
									onClick={addchamp}
								>
									<MdAdd />
								</button>
							)}
							{index >= 0 && (
								<button
									type="button"
									className="btn btn-danger btn-sm mt-3 mx-2"
									onClick={() => removechamp(index)}
								>
									<MdDelete />
								</button>
							)}
						</div>
					</div>
				))}
				{/* Afficher un champ de compétence vide si la liste est vide */}
				{competencesList.length === 0 && (
					<div className="row">
						<div className="col-md-10 mb-3">
							<label htmlFor={`competence-0`} className="form-label">
								Compétence 1
							</label>
							<input
								type="text"
								className="form-control"
								id={`competence-0`}
								value={""} // Champ vide
								onChange={(e) => handleCompetenceChange(0, e.target.value)}
								placeholder="Entrez la Compétence"
							/>
						</div>
						<div className="col-md-1 d-flex justify-content-center align-items-center">
							<button
								type="button"
								className="btn btn-success btn-sm  mt-3 mx-2"
								onClick={addchamp}
							>
								<MdAdd />
							</button>
						</div>
					</div>
				)}
				<div className="container d-flex flex-wrap justify-content-center align-items-center">
					<Link to="/resume" className="btn btn-formulaire btn-block mt-2 mx-2">
						Quitter
					</Link>
					<button
						type="submit"
						className="btn btn-formulaire btn-block mt-2 mx-2"
						onClick={saveCompetences}
					>
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	);
};

export default CompetencesForm;
