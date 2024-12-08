import { useState, useEffect } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import iso6391 from "iso-639-1";

const LanguesForm = () => {
	const [languesList, setLanguesList] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState("");
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const user = userId;
	useEffect(() => {
		fetchLanguesData();
	}, []);

	const fetchLanguesData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/cv/getCvByUserId/${user}`
			);
			const languesData = response.data.langues;
			setLanguesList(languesData);
		} catch (error) {
			console.error("Erreur lors de la récupération des langues:", error);
		}
	};

	const addchamp = () => {
		if (selectedLanguage.trim() !== "") {
			setLanguesList([...languesList, selectedLanguage]);
			setSelectedLanguage(""); // Réinitialise la sélection de langue
		}
	};

	const removechamp = (index) => {
		const updatedLanguesList = [...languesList];
		updatedLanguesList.splice(index, 1);
		setLanguesList(updatedLanguesList);
	};

	const handleLangueChange = (index, value) => {
		const updatedLanguesList = [...languesList];
		updatedLanguesList[index] = value;
		setLanguesList(updatedLanguesList);
	};

	const handleInputChange = (event) => {
		const { value } = event.target;
		setSelectedLanguage(value);
	};

	const saveLangues = async () => {
		try {
			const cvResponse = await axios.get(`http://localhost:3000/cv/getCvByUserId/${userId}`);
			const cvData = cvResponse.data;
			let cvId = null;
	
			if (cvData) {
				cvId = cvData._id;
			}
	
			const updatedLangues = [...languesList];
	
			if (selectedLanguage.trim() !== "") {
				updatedLangues.push(selectedLanguage);
				setSelectedLanguage(""); 
			}
	
			if (cvId) {
				await axios.put(`http://localhost:3000/cv/update/${cvId}`, {
					langues: updatedLangues
				});
			} else {
				const response = await axios.post("http://localhost:3000/cv/add", {
					langues: updatedLangues
				});
				console.log("Langues ajoutées avec succès:", response.data);
			}
			toast.success("Langues enregistrées avec succès!");
		} catch (error) {
			console.error("Erreur lors de l'enregistrement des langues:", error);
			toast.error("Une erreur est survenue lors de l'enregistrement des langues.");
		}
	};
	


	return (
		<div
			className="card cardformulaire shadow"
			data-aos="fade-down"
			data-aos-duration="100"
		>
			<div className="card-body titre">
				{languesList.map((langue, index) => (
					<div className="row" key={index}>
						<div className="col-md-10 mb-3">
							<label htmlFor={`langue-${index}`} className="form-label">
								Langue {index + 1}
							</label>
							<input
								type="text"
								className="form-control"
								id={`langue-${index}`}
								value={langue}
								onChange={(e) => handleLangueChange(index, e.target.value)}
								placeholder="Entrez la Langue"
							/>
						</div>
						<div className="col-md-1 d-flex justify-content-center align-items-center">
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
				<div className="row">
					<div className="col-md-10 mb-3">
						<label htmlFor="language" className="form-label">
							Sélectionnez une langue :
						</label>
						<input
							type="text"
							list="languages"
							value={selectedLanguage}
							onChange={handleInputChange}
							placeholder="Sélectionnez une langue"
							className="form-control"
						/>
						<datalist id="languages">
							{iso6391.getAllNames().map((language) => (
								<option key={language} value={language}>
									{language}
								</option>
							))}
						</datalist>
					</div>
					<div className="col-md-1 d-flex justify-content-center align-items-center">
						<button
							type="button"
							className="btn btn-success btn-sm mt-3 mx-2"
							onClick={addchamp}
						>
							<MdAdd />
						</button>
					</div>
				</div>
				<div className="container d-flex flex-wrap justify-content-center align-items-center">
					<Link to="/resume" className="btn btn-formulaire btn-block mt-2 mx-2">
						Quitter
					</Link>
					<button
						type="button"
						className="btn btn-formulaire btn-block mt-2 mx-2"
						onClick={saveLangues}
					>
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	);
};

export default LanguesForm;
