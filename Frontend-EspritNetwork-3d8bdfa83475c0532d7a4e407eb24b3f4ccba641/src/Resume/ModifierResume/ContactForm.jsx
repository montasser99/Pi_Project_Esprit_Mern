import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Resizer from "react-image-file-resizer";

const ContactForm = () => {
	const [nom, setNom] = useState("");
	const [prenom, setPrenom] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [telephone, setTelephone] = useState("");
	const [telephoneError, setTelephoneError] = useState("");
	const [adresse, setAdresse] = useState("");
	const [lienGit, setLienGit] = useState("");
	const [lienLinkedIn, setLienLinkedIn] = useState("");
	const [titreProfil, setTitreProfil] = useState("");
	const [imageResume, setImageResume] = useState(null);
	const [imageError, setImageError] = useState(""); // Assurez-vous que cette ligne est bien présente
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
			setNom(cvData.contact.nom);
			setPrenom(cvData.contact.prenom);
			setEmail(cvData.contact.email);
			setTelephone(cvData.contact.telephone);
			setAdresse(cvData.contact.adresse);
			setLienGit(cvData.contact.lienGit);
			setLienLinkedIn(cvData.contact.lienLinkedIn);
			setTitreProfil(cvData.contact.titreProfil);
			setImageResume(cvData.contact.imageResume);
		} catch (error) {
			console.error("Error fetching CV data:", error);
		}
	};

	// Image diminuer la taille
	const handleImageUpload = (e) => {
		const file = e.target.files[0];

		Resizer.imageFileResizer(
			file,
			300, // width
			300, // height
			"JPEG", // format
			100, // quality
			0, // rotation
			async (uri) => {
				try {
					await axios.post("http://localhost:3000/cv/upload/image", {
						imageDataUrl: uri,
					});
					setImageResume(uri);
					setImageError(
						" Parfait! Votre image est dans la plage de taille autorisée."
					);
				} catch (error) {
					if (error.response && error.response.status === 413) {
						setImageError(
							"Votre image dépasse la taille maximale autorisée . Veuillez choisir une image plus petite."
						);
					}
				}
			},
			"base64"
		);
	};

	const validateInput = () => {
		const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const telephoneIsValid = telephone.length >= 8;

		setEmailError(
			emailIsValid ? "" : "Adresse e-mail invalide exemple@exemple.com "
		);
		setTelephoneError(
			telephoneIsValid
				? ""
				: "Le numéro de téléphone doit avoir au moins 8 caractères"
		);

		return emailIsValid && telephoneIsValid;
	};
	const AddedContactForm = async () => {
		const isValid = validateInput();
		if (!isValid) {
			return;
		}
		try {
			if (imageResume) {
				await axios.post("http://localhost:3000/cv/upload/image", {
					imageDataUrl: imageResume,
				});
			}
			const response = await axios.post("http://localhost:3000/cv/add", {
				contact: {
					nom,
					prenom,
					email,
					telephone,
					adresse,
					lienGit,
					lienLinkedIn,
					titreProfil,
					imageResume,
				},
				user: user,
			});

			console.log("Contact added successfully:", response.data);
			toast.success(
				"Vos informations de Contact ont été mises à jour avec succès !",
				{ duration: 2000 }
			);
		} catch (error) {
			console.error("Error adding contact:", error);
		}
	};
	return (
		<div
			className="card cardformulaire shadow"
			data-aos="fade-down"
			data-aos-duration="100"
		>
			<div className="card-body titre ">
				<div className="row">
					<div className="col-md-6 mb-3">
						<label htmlFor="nom" className="form-label">
							Nom
						</label>
						<input
							type="text"
							className="form-control"
							id="nom"
							value={nom}
							onChange={(e) => setNom(e.target.value)}
							placeholder="Entrez votre nom"
						/>
					</div>
					<div className="col-md-6 mb-3">
						<label htmlFor="prenom" className="form-label">
							Prénom
						</label>
						<input
							type="text"
							className="form-control"
							id="prenom"
							value={prenom}
							onChange={(e) => setPrenom(e.target.value)}
							placeholder="Entrez votre prénom"
						/>
					</div>
					<div className="col-md-6 mb-3">
						<label htmlFor="email" className="form-label">
							Adresse Email
						</label>
						<input
							type="text"
							className={`form-control ${emailError ? "input-error" : ""}`}
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onBlur={validateInput}
							placeholder="Entrez votre adresse email"
						/>
						{emailError && <div className="text-danger">{emailError}</div>}
					</div>
					<div className="col-md-6 mb-3">
						<label htmlFor="telephone" className="form-label">
							Téléphone
						</label>
						<input
							type="text"
							className="form-control"
							id="telephone"
							value={telephone}
							onChange={(e) => setTelephone(e.target.value)}
							onBlur={validateInput}
							placeholder="Entrez votre numéro de téléphone"
						/>
						{telephoneError && (
							<div className="text-danger">{telephoneError}</div>
						)}
					</div>
					<div className="mb-3">
						<label htmlFor="adresse" className="form-label">
							Adresse
						</label>
						<textarea
							className="form-control"
							id="adresse"
							rows="2"
							value={adresse}
							onChange={(e) => setAdresse(e.target.value)}
							placeholder="Entrez votre adresse"
						></textarea>
					</div>
					<div className="col-md-6 mb-3">
						<label htmlFor="lienGit" className="form-label">
							Lien Git
						</label>
						<input
							type="text"
							className="form-control"
							id="lienGit"
							value={lienGit}
							onChange={(e) => setLienGit(e.target.value)}
							placeholder="Entrez votre lien Git"
						/>
					</div>
					<div className="col-md-6 mb-3">
						<label htmlFor="lienLinkedIn" className="form-label">
							Lien LinkedIn
						</label>
						<input
							type="text"
							className="form-control"
							id="lienLinkedIn"
							value={lienLinkedIn}
							onChange={(e) => setLienLinkedIn(e.target.value)}
							placeholder="Entrez votre lien LinkedIn"
						/>
					</div>

					<div className="col-md-6 mb-3">
						<label htmlFor="titreProfil" className="form-label">
							Titre du profil
						</label>
						<input
							type="text"
							className="form-control"
							id="titreProfil"
							value={titreProfil}
							onChange={(e) => setTitreProfil(e.target.value)}
							placeholder="Entrez le titre de votre profil"
						/>
					</div>

					<div className="col-md-6 mb-3">
						<label htmlFor="imageResume" className="form-label">
							Upload Image
						</label>
						<input
							type="file"
							className="form-control"
							id="imageResume"
							onChange={handleImageUpload}
							placeholder="Entrez votre titre du profi"
							accept="image/*"
						/>
						{imageError && (
							<div
								className={
									imageError.includes("Parfait!")
										? "text-success"
										: "text-danger"
								}
							>
								{imageError}
							</div>
						)}
					</div>
				</div>
				<div className="container d-flex flex-wrap justify-content-center align-items-center">
					<Link to="/resume" className="btn btn-formulaire btn-block mt-2 mx-2">
						Quitter
					</Link>
					<button
						type="submit"
						className="btn btn-formulaire btn-block mt-2 mx-2"
						onClick={AddedContactForm}
					>
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	);
};

export default ContactForm;
