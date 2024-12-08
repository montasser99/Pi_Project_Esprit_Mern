import { useNavigate } from "react-router-dom";
import Countdown from "./Countdown";

import espritNetwork from "../../assets/logo-network.png";
const OffersList = ({ offers, viewType }) => {
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo1 = JSON.parse(userInfoString);
	var userId = userInfo1._id;
	const navigate = useNavigate();


	const handleVoirPlusClick = async (offerId) => {
		try {
			const response = await fetch("http://localhost:3000/vue/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ offre: offerId, user: userId }), 
			});

			if (response.ok) {
				navigate(`/condidat/alloffres/details/${offerId}`);
			} else {
				console.error("Failed to add Vue");
			}
		} catch (error) {
			console.error("Error adding Vue:", error);
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
			return "maintenant";
		}
	};


	const remainingDays = (dateString) => {
		const currentDate = new Date();
		const expirationDate = new Date(dateString);
		const diffTime = expirationDate.getTime() - currentDate.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	return (
		<div className="row">
			{offers.length === 0 ? (
				<p className="text-center card card-body my-3">
					Pas d'offres disponibles
				</p>
			) : (
				offers.map((offer) => {
					if (viewType === "grid") {
						return (
							<div className="col-lg-4 my-3 card-mobile" key={offer._id}>
								<div className="card h-100">
									{offer.user.pic ? (
										<div style={{ width: "170px", height: "170px" }}>
											<img
												src={offer.user.pic}
												className="card-img-top rounded-top ms-5 my-2"
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
													borderRadius: "10px 10px 0 0",
												}}
												alt="Logo de la société"
											/>
										</div>
									) : (
										<img
											src={espritNetwork} 
											className="card-img-top"
											alt="Image de société"
											style={{ maxWidth: "170px", margin: "auto" }}
										/>
									)}
									<div className="card-body">
										<h5 className="card-title " style={{ color: "#Cf0000" }}>
											{offer.titre}
										</h5>
										<p className="card-text">
											{offer.description.length > 90
												? offer.description.substring(0, 90) + "..."
												: offer.description}
										</p>
										<div className="d-flex align-items-center">
											<p className="mb-0 me-3">
												<i className="bi bi-clock"></i>{" "}
												{formatDateDifference(offer.created_at)}
											</p>
											<p className="mb-0">
												<i className="bi bi-geo-alt"></i> {offer.user.adresseC}
											</p>
										</div>
										<div>
										<p  className='mt-3'>
										<i className="bi bi-building"></i>{" "}
												{offer.user.name}
											</p>
										</div>


										{offer.dateExpiration && (
											<div className="d-flex flex-column mt-3">
												<p>Date d'expiration :</p>
												<p
													className={`mx-1 ${remainingDays(offer.dateExpiration) === 1
														? "text-danger"
														: "text-success"
														}`}
												>
													<Countdown date={offer.dateExpiration} />
												</p>
											</div>
										)}
									</div>
									<div className="card-footer d-flex justify-content-end">
										<button
											className="btn btn-outline-dark me-2"
											onClick={() => handleVoirPlusClick(offer._id)}
										>
											Voir Plus
										</button>
										<button
											className="btn btn-primary"
											onClick={() =>
												navigate(`/postuler/${offer._id}/${userId}`)
											}
										>
											Postuler
										</button>
									</div>
								</div>
							</div>
						);
					} else {
						return (
							<div className="col-12 py-3" key={offer._id}>
								<div className="card card-test ms-5 p-3 shadow-sm">
									<div className="row flex d-flex align-items-center">
										<div className="col-md-4">
											{offer.user.pic ? (
												<div style={{ width: "170px", height: "170px" }}>
													<img
														src={offer.user.pic}
														className="card-img-top rounded-top ms-5 my-2"
														style={{
															width: "100%",
															height: "100%",
															objectFit: "cover",
															borderRadius: "10px 10px 0 0",
														}}
														alt="Logo de la société"
													/>
												</div>
											) : (
												<img
													src={espritNetwork} 
													className="card-img-top ms-5"
													alt="Image de société"
													style={{ maxWidth: "170px", margin: "auto" }}
												/>
											)}
										</div>
										<div className="col-md-8">
											<h4 style={{ color: "#Cf0000" }}>{offer.titre}</h4>
											<h4>
												<strong>{offer.typeoffre}</strong>
											</h4>
											<p>
												{offer.description.length > 90
													? offer.description.substring(0, 90) + "..."
													: offer.description}
											</p>
											<div className="d-flex flex">
												<div className="d-flex flex">
													<p className="me-4">
														<i className="bi bi-clock"></i>{" "}
														{formatDateDifference(offer.created_at)}
													</p>
													<p className="me-4">
														<i className="bi bi-geo-alt"></i>{" "}
														{offer.user.adresseC}
													</p>
													<p>
														<i className="bi bi-building"></i>{" "}
														{offer.user.name}
													</p>
												</div>
											</div>
											{offer.dateExpiration && (
												<div className="d-flex flex-row mt-3">
													<p>Date d'expiration :</p>
													<p
														className={`mx-1 ${remainingDays(offer.dateExpiration) === 1
															? "text-danger"
															: "text-success"
															}`}
													>
														<Countdown date={offer.dateExpiration} />
													</p>
												</div>
											)}
										</div>
										<div className="col d-flex justify-content-end">
											<button
												className="btn btn-outline-dark mx-2"
												onClick={() => handleVoirPlusClick(offer._id)}
											>
												Voir Plus
											</button>
											<button
												className="btn btn-primary"
												onClick={() =>
													navigate(`/postuler/${offer._id}/${userId}`)
												}
											>
												Postuler
											</button>
										</div>
									</div>
								</div>
							</div>
						);
					}
				})
			)}
		</div>
	);
};

export default OffersList;
