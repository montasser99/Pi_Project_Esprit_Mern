import { MdAdd, MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ParcoursProForm = () => {
	const [parcoursproList, setParcoursproList] = useState([
		{
			poste: "",
			entreprise: "",
			dateDebut: null,
			dateFin: null,
			description: "",
		},
	]);
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const user = userId;
	useEffect(() => {
		fetchParcoursProData();
	}, []);

	const fetchParcoursProData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/cv/getCvByUserId/${user}`
			);
			const parcoursproData = response.data.parcoursProfessionnels;
			if (parcoursproData.length > 0) {
				setParcoursproList(parcoursproData);
			}
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des parcours professionnels:",
				error
			);
		}
	};

	const addchamp = () => {
		setParcoursproList([
			...parcoursproList,
			{
				poste: "",
				entreprise: "",
				dateDebut: null,
				dateFin: null,
				description: "",
			},
		]);
	};

	const removechamp = (index) => {
		const updatedParcoursproList = [...parcoursproList];
		updatedParcoursproList.splice(index, 1);
		setParcoursproList(updatedParcoursproList);
	};

	const handleParcoursChange = (index, field, value) => {
		const updatedParcoursproList = [...parcoursproList];
		updatedParcoursproList[index][field] = value;
		setParcoursproList(updatedParcoursproList);
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
					parcoursProfessionnels: parcoursproList
				});
			} else {
				const response = await axios.post("http://localhost:3000/cv/add", {
					parcoursProfessionnels: parcoursproList
				});
				console.log("Parcours professionnels enregistrés avec succès:", response.data);
			}
			toast.success("Votre Expérience Professionnelle a été mise à jour avec succès !", { duration: 2500 });
		} catch (error) {
			console.error("Erreur lors de l'enregistrement des parcours professionnels:", error);
			toast.error("Une erreur est survenue lors de l'enregistrement des parcours professionnels.");
		}
	};
	

	return (
		<div
			className="card cardformulaire shadow"
			data-aos="fade-down"
			data-aos-duration="100"
		>
			<div className="card-body titre">
				{parcoursproList.map((parcours, index) => (
					<div className="row" key={index}>
						<div className="col-md-6 mb-3">
							<label htmlFor={`poste-${index}`} className="form-label">
								Poste
							</label>
							<input
								type="text"
								className="form-control"
								id={`poste-${index}`}
								value={parcours.poste}
								onChange={(e) =>
									handleParcoursChange(index, "poste", e.target.value)
								}
								placeholder="Entrez votre poste"
							/>
						</div>
						<div className="col-md-2 mb-3">
							<label htmlFor={`dateDebut-${index}`} className="form-label">
								Date de début
							</label>
							<DatePicker
								selected={parcours.dateDebut}
								onChange={(date) =>
									handleParcoursChange(index, "dateDebut", date)
								}
								dateFormat="dd/MM/yyyy"
								placeholderText="Date de début"
								className="form-control"
							/>
						</div>
						<div className="col-md-2 mb-3">
							<label htmlFor={`dateFin-${index}`} className="form-label">
								Date de fin
							</label>
							<DatePicker
								selected={parcours.dateFin}
								onChange={(date) =>
									handleParcoursChange(index, "dateFin", date)
								}
								dateFormat="dd/MM/yyyy"
								placeholderText="Date de fin"
								className="form-control"
							/>
						</div>
						<div className="col-md-6 mb-3">
							<label htmlFor={`entreprise-${index}`} className="form-label">
								Entreprise
							</label>
							<input
								type="text"
								className="form-control"
								id={`entreprise-${index}`}
								value={parcours.entreprise}
								onChange={(e) =>
									handleParcoursChange(index, "entreprise", e.target.value)
								}
								placeholder="Nom de l'entreprise"
							/>
						</div>
						<div className="col-md-6 mb-3">
							<label htmlFor={`description-${index}`} className="form-label">
								Description
							</label>
							<input
								type="text"
								className="form-control"
								id={`description-${index}`}
								value={parcours.description}
								onChange={(e) =>
									handleParcoursChange(index, "description", e.target.value)
								}
								placeholder="Description"
							/>
						</div>
						<div className="col-lg-1  d-flex align-items-center">
							{index === parcoursproList.length - 1 && (
								<button
									type="button"
									className="btn btn-success btn-sm mt-3 mx-2"
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

export default ParcoursProForm;
