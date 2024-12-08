import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const OffersList = ({ offers, fetchData }) => {
	const navigate = useNavigate();
	const [viewCounts, setViewCounts] = useState({});


	const notifyArchiver = () =>
		toast.success("L'offre a été archivée avec succès !", {
			position: "top-right",
			style: {
				padding: "15px",
				marginTop: "100px",
			},
		});

	useEffect(() => {
		const fetchViewCounts = async () => {
			try {
				const requests = offers.map(async (offer) => {
					const response = await axios.get(
						"http://localhost:3000/vue/getvueByoffreId",
						{
							params: {
								offreId: offer._id,
							},
						}
					);
					return { offerId: offer._id, count: response.data.count };
				});
				const responses = await Promise.all(requests);
				const viewCountsData = responses.reduce(
					(data, response) => ({
						...data,
						[response.offerId]: response.count,
					}),
					{}
				);
				setViewCounts(viewCountsData);
			} catch (error) {
				console.error("Error fetching view counts:", error);
			}
		};

		fetchViewCounts();
	}, [offers]);

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

	const showApplicantsList = (offerId) => {
		localStorage.setItem("idOffre", JSON.stringify(offerId));
		navigate(`/condidates/${offerId}`);
	};

	const archiverOffer = async (id) => {
		try {
			await axios.post(`http://localhost:3000/offre/archiver/${id}`);
			await fetchData();
			notifyArchiver();
		} catch (error) {
			console.error("Error deleting offer:", error);
		}
	};

	return (
		<div className="row">
			{offers.length === 0 ? (
				<p className="text-center card card-body my-3">
					Pas d'offres disponibles
				</p>
			) : (
				offers.map((offer) => (
					<div className="col-12 py-3 ms-5" key={offer._id}>
						<div className="card card-test p-3 shadow-sm">
							<div className="row">
								<div className="col-md-8">
									<h4
										style={{
											color: "#Cf0000",
											fontSize: "1.5rem",
											fontWeight: "bold",
										}}
									>
										{offer.titre}
									</h4>
									<h4 className="mt-2">
										<strong>{offer.typeoffre}</strong>
									</h4>
									<p className="mt-3">
										{offer.description.length > 90
											? offer.description.substring(0, 90) + "..."
											: offer.description}
									</p>
								</div>
								<div className="d-none d-md-block col-md-4 text-end">
									<button
										className="btn btn-outline-dark p-2"
										onClick={() => showApplicantsList(offer._id)}
									>
										<i className="bi bi-list me-2"></i> Candidats
									</button>
								</div>

								<div className="d-flex flex mb-1">
									<div className="d-flex flex">
										<p className="me-4">
											<i className="bi bi-clock"></i>{" "}
											{formatDateDifference(offer.created_at)}
										</p>
										<p className="me-4">
											<i className="bi bi-geo-alt"></i>
											{offer.user.adresseC ? offer.user.adresseC : "L'adresse n'existe pas."}
										</p>

										<p>
											<i className="bi bi-eye"></i> {viewCounts[offer._id] || 0}{" "}
											views
										</p>
									</div>
								</div>

								<div className="col-5 text-end col-md-4 d-md-none d-block mb-2">
									<button
										className="btn btn-outline-dark mt-2 d-flex"
										onClick={() => showApplicantsList(offer._id)}
									>
										<i className="bi bi-list me-2"></i> Candidats
									</button>
								</div>

								<div className="col d-flex justify-content-start ">
									<button
										className="btn btn-dark"
										onClick={() => navigate(`/company/details/${offer._id}`)}
										title="détaillée"
									>
										<i className="bi bi-eye-fill"></i>{" "}
									</button>
									<button
										className="btn btn-outline-success mx-2"
										onClick={() => navigate(`/modifieroffre/${offer._id}`)}
										title="Modifier"
									>
										<i className="bi bi-pencil-fill"></i>{" "}
									</button>
									<button
										className="btn btn-danger"
										onClick={() => archiverOffer(offer._id)}
										title="Archiver"
									>
										<i className="fas fa-archive"></i>{" "}
									</button>
								</div>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};
export default OffersList;
