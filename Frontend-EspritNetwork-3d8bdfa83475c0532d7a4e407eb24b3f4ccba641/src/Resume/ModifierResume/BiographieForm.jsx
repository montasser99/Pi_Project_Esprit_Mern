import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const BiographieForm = () => {
	const [biographie, setBiographie] = useState("");
	const [biographieError, setBiographieError] = useState("");

	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const user = userId;
	useEffect(() => {
		fetchCvData();

	}, []);

	const fetchCvData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/cv/getCvByUserId/${user}`
			);
			const cvData = response.data;
			setBiographie(cvData.biographie);
		} catch (error) {
			console.error("Error fetching CV data:", error);
		}
	};

	const addBiography = async () => {
		const isValid = validateInput();
		if (!isValid) {
			return;
		}
		try {
			const response = await axios.post("http://localhost:3000/cv/add", {
				biographie: biographie,
				user: user,
			});
			console.log("Biography added successfully:", response.data);
			toast.success("Votre Biographie a été mise à jour avec succès !", {
				duration: 2500,
			});
		} catch (error) {
			console.error("Error adding biography:", error);
		}
	};
	const validateInput = () => {
		const biographieIsValid = biographie.length <= 270;

		setBiographieError(
			biographieIsValid
				? ""
				: "Votre biographie ne doit pas dépasser 270 caractères"
		);

		return biographieIsValid;
	};



	return (

		<div
			className="card cardformulaire shadow"
			data-aos="fade-down"
			data-aos-duration="100"
		>

			<div className="card-body titre">
				<div className="mb-1">
					<label htmlFor="biography" className="form-label">
						Biographie
					</label>
					<textarea
						className="form-control"
						id="biography"
						rows="5"
						value={biographie}
						onChange={(e) => setBiographie(e.target.value)}
						onBlur={validateInput}
						placeholder="Écrivez votre biographie ici..."
					></textarea>
					{biographieError && (
						<div className="text-danger">{biographieError}</div>
					)}
				</div>
				<div className="container d-flex flex-wrap justify-content-center align-items-center">
					<Link to="/resume" className="btn btn-formulaire btn-block mt-2 mx-2">
						Quitter
					</Link>
					<button
						type="button"
						className="btn btn-formulaire btn-block mt-2 mx-2"
						onClick={addBiography}
					>
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	);
};

export default BiographieForm;
