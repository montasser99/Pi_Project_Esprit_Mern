import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BiMap } from "react-icons/bi";
import "../DetailsMesOffres.css";
import espritNetwork from "../../assets/logo-network.png";

const DetailsMesOffres = () => {
	const [condidacy, setCondidacy] = useState({});
	const { idcondidacy } = useParams();
	const [img, setImg] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:3000/condidacy/getbyid/${idcondidacy}`
				);
				setImg(response.data.offre.user.pic);
				setCondidacy(response.data);
			} catch (error) {
				console.error("Error fetching condidacy data:", error);
			}
		};

		fetchData();
	}, [idcondidacy]);

	const handleGetPDF = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/condidacy/getpdf/${condidacy.document}`,
				{
					responseType: "blob",
				}
			);

			const blob = new Blob([response.data], { type: "application/pdf" });

			const url = window.URL.createObjectURL(blob);

			window.open(url, "_blank");
		} catch (error) {
			console.error("Error fetching PDF:", error);
		}
	};

	const formatDateDifference = (date) => {
		const currentDate = new Date();
		const postDate = new Date(date);
		const timeDifference = currentDate - postDate;
		const seconds = Math.floor(timeDifference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) {
			return `Il'y a ${days}  ${days === 1 ? "jour" : "jours"}`;
		} else if (hours > 0) {
			return `Il'y a ${hours} ${hours === 1 ? "heure" : "heures"} `;
		} else if (minutes > 0) {
			return `Il'y a ${minutes} ${minutes === 1 ? "minute" : "minutes"} `;
		} else {
			return "Maintenant";
		}
	};
	const formatExpirationDate = (dateString) => {
		const options = {
			timeZone: "Africa/Tunis",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		};
		const formattedDate = new Date(dateString).toLocaleDateString(
			"tn-TN",
			options
		);
		return formattedDate;
	};

	return (
		<div className="design">
			<section id="services" className="section py-5" data-aos="fade-up">
				<div className="details-container details-container11 py-5 ">
					<div className="section-title py-5">
						<h2 className="text-black">Analyse détaillée de l'offre</h2>
					</div>
					<div className="card carddd position-relative">
						<div
							className="card-title text-white p-2"
							style={{
								backgroundColor: "#000",
								position: "absolute",
								top: -40,
								left: 0,
								right: 0,
							}}
						>
							Informations sur l'offre
						</div>
						<div
							className="d-flex flex-column flex-md-row align-items-start"
							style={{ marginTop: "40px" }}
						>

							{img ? (
								<img
									src={img}
									className="card-img-top rounded-top"
									style={{
										width: "200px",
										height: "150px",
										display: "block",
										borderRadius: "10px 10px 0 0",
									}}
								/>
							) : (
								<img
									src={espritNetwork} 
									alt="Image de société"
									className="img-fluid"
									style={{ maxWidth: "200px", marginRight: "20px" }}
								/>
							)}

							<div className="ms-md-3 w-100">
								<div>
									<h2>{condidacy.offre?.titre}</h2>
								</div>
								<div>
									<BiMap size={20} /> {condidacy.offre?.user.adresseC}
								</div>
								<div>
									<p className="bg-green">
										{formatDateDifference(condidacy.date_postule)}
									</p>
								</div>
								<div className="competence-container">
									<h5>Compétence:</h5>
									<div className="competence-list">
										{condidacy.offre?.competence
											?.split(",")
											.map((comp, index) => (
												<div key={index} className="competence-item">
													{comp.trim()}
												</div>
											))}
									</div>
								</div>
							</div>
							<div className="ms-md-3 w-100 mt-3 mt-md-0">
								<div className="row">
									<div className="col-md-6">
										<div>
											<h5>Type de contrat</h5>
											<p>{condidacy.offre?.typecontrat}</p>
										</div>
									</div>
									<div className="col-md-6">
										<div>
											<h5>Salaire</h5>
											{condidacy.offre?.salaire ? (
												<p>{condidacy.offre.salaire}</p>
											) : (
												<p>Non spécifié</p>
											)}
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">
										<div>
											<h5>Langue</h5>
											{condidacy.offre?.langue ? (
												<p>{condidacy.offre.langue}</p>
											) : (
												<p>Non spécifié</p>
											)}
										</div>
									</div>
									<div className="col-md-6">
										<div>
											<h5>Expérience</h5>
											{condidacy.offre?.experience ? (
												<p>{condidacy.offre?.experience} ans</p>
											) : (
												<p>Non spécifié</p>
											)}
										</div>
									</div>
									{condidacy.offre && (
										<div className="col-md-7">
											<div>
												<h5>Date d'expiration : </h5>
												<p className="ml-2">
													{condidacy.offre.dateExpiration
														? formatExpirationDate(
															condidacy.offre.dateExpiration
														)
														: "Non spécifié"}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
						<hr
							className="mt-3"
							style={{
								backgroundColor: "gray",
								height: "1px",
								border: "none",
							}}
						/>
						<div className="w-100 px-md-3">
							<h5>Description</h5>
							<p>{condidacy.offre?.description} </p>
						</div>
					</div>
				</div>

				<div className="details-container details-container11 py-4">
					<div className="card carddd position-relative">
						<div
							className="card-title text-white p-2"
							style={{
								backgroundColor: "#000",
								position: "absolute",
								top: -60,
								left: 0,
								right: 0,
							}}
						>
							Vos informations sur le poste
						</div>
						<div className="containerdd flex d-flex flex-column flex-md-row mx-auto">
							<div className="item itemA">
								<h5>Affiliation</h5>
								<p>{condidacy.affiliation}</p>
							</div>
							<div className="item">
								<h5>Spécialité</h5>
								<p>{condidacy.specialite}</p>
							</div>
							<div className="item">
								<h5>Année de diplôme</h5>
								<p>{condidacy.anneediplome}</p>
							</div>

							<div className="item">
								<h5>Status</h5>
								<p>{condidacy.status}</p>
							</div>

							<div className="item">
								<h5>Document</h5>
								{condidacy.document ? (
									<button className="ms-4" onClick={handleGetPDF}>
										<i className="fas fa-file-pdf fa-lg"></i>
									</button>
								) : (
									<p>No PDF available</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default DetailsMesOffres;
