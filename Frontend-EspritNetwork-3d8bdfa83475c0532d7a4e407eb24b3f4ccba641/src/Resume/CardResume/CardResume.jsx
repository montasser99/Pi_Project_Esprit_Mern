import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CardResume.css";
import { BarreProgress } from "./BarreProgress";
import { MdEdit } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import imgDef from "../../assets/cv/imgd.png";
import axios from "axios";

export function CardResume() {

	const [cvData, setCvData] = useState(null);
	const [progressPercentage, setProgressPercentage] = useState(0);
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	let user = userId;
	const { id } = useParams();
	if (userInfo.role === "company") {
		user = id;
	}
	useEffect(() => {
		fetch(`http://localhost:3000/cv/getCvByUserId/${user}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data.contact);
				setCvData(data.contact);
			})
			.catch((error) =>
				console.error("Erreur lors de la récupération des données CV:", error)
			);
	}, []);

	useEffect(() => {
		const updatePercentage = async () => {
			try {
				const response = await axios.post("http://localhost:3000/cv/updatepourcentage", {
					id: userId,
					pourcentage: progressPercentage
				});
				console.log(userId,progressPercentage)
				console.log(response.data.message); // Assuming you want to log the message
			} catch (error) {
				console.error("Error updating percentage:", error);
			}
		};
	
		updatePercentage(); // Call the async function immediately
	
	}, [progressPercentage]);
	
	


	if (!cvData) {
		return <div>Chargement en cours...</div>;
	}

	return (
		<div className="container-fluid ">
			<div className="row">
				<div className="col-lg-12 col-md-8 mt-4">
					<div className="card member">
						<div className="card-body cardresumecard d-flex align-items-start">
							<div className="picard ">
								{cvData.imageResume ? (
									<img
										src={cvData.imageResume}
										className="img-fluid rounded-circle picard-image"
										alt="Photo du candidat"
									/>
								) : (
									<img
										src={imgDef}
										className="img-fluid rounded-circle"
										alt="Image par défaut"
									/>
								)}
							</div>
							<div className="member-info col-10">
								<h4 className="card-title mt-3">
									{cvData.nom} {cvData.prenom}
									{progressPercentage === 100 && (
										<FaCheckCircle className="verified-icon" />
									)}
								</h4>
								<h3 className="htitrepro">{cvData.titreProfil}</h3>
								<p className="cv-item-description ">{cvData.adresse}</p>
								<BarreProgress
									onProgressChange={(percentage) =>
										setProgressPercentage(percentage)
									}
								/>
								{progressPercentage === 100 && (
									<div className="felicitation">
										<p>
											Félicitations ! Votre CV est maintenant complet et vérifié
										</p>
									</div>
								)}
								<div className="modifier-cv ">
									{userInfo.role === "student" || userInfo.role === "alumni" ? (
										<Link
											to="/resume/modifiercv"
											className="btn btn-modifier d-flex flex-wrap"
										>
											<MdEdit className="mx-1" />
											Modifier CV
										</Link>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
