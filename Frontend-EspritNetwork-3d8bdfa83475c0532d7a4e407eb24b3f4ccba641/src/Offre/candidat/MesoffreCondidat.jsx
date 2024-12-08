import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../MesoffreCondidat.css";
import { useAppContext } from "../context/AppContext";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import espritNetwork from "../../assets/logo-network.png";
const MesoffreCondidat = () => {
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo1 = JSON.parse(userInfoString);
	var userId = userInfo1._id;
	const [condidacy, setCondidacy] = useState([]);
	const [pageNumber, setPageNumber] = useState(0);
	const itemsPerPage = 4; 

	const { toastData, clearToastData } = useAppContext();

	useEffect(() => {
		if (toastData) {
			const { type, message, position, style } = toastData;
			toast[type](message, {
				position: position,
				style: style,
			});
			clearToastData();
		}
	}, [toastData]);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3000/condidacy/getbyiduser/${userId}`
			);
			
			setCondidacy(response.data);
			console.log(response.data);

		} catch (error) {
			console.error("Error fetching condidacy data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
	}, [condidacy]);

	const pageCount = Math.ceil(condidacy.length / itemsPerPage);

	const handlePageClick = ({ selected }) => {
		setPageNumber(selected);
	};

	const getDisplayCondidacy = () => {
		const startIndex = pageNumber * itemsPerPage;
		const endIndex = Math.min(
			(pageNumber + 1) * itemsPerPage,
			condidacy.length
		);
		return condidacy.slice(startIndex, endIndex);
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

	return (
		<div>
			<Toaster />

			<section id="services" className="section py-5 " data-aos="fade-up">
				<div className="container">
					<div className="section-title titleMe ">
						<h2 className="text-black">Liste de mes candidatures</h2>
					</div>
					{condidacy.length > 0 ? (
						<div className="row mx-5">
							{getDisplayCondidacy().map((candidacy) => (
								<div className="col-12 py-2" key={candidacy._id}>
									<div className="card card-test  p-3 shadow-sm">
										<div className="row flex d-flex align-items-center">
											<div className="img-condidat col-md-3 ">
												{candidacy.offre.user.pic ? (
													<img
														src={candidacy.offre.user.pic}
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
											</div>
											<div className="col-md-5">
												<h4 style={{ color: "#Cf0000" }}>{candidacy.offre.titre}
												</h4>
												<p className="my-3">
													{candidacy.offre.description.length > 90
														? candidacy.offre.description.substring(0, 90) +
														"..."
														: candidacy.offre.description}
												</p>

												<div className="d-flex flex flexiMe">
													<p className="me-4">
														<i className="bi bi-clock"></i>{" "}
														{formatDateDifference(candidacy.offre.created_at)}
													</p>{" "}
													<span className="me-4 ">
														<i className="bi bi-geo-alt "></i>{" "}
														{candidacy.offre.user.adresseC}
													</span>
													<p>
														<i className="bi bi-building"></i>{" "}
														{candidacy.offre.user.name}
													</p>
												</div>

												<div>
													<div>
														{candidacy.status === "Accepté" && (
															<span className="badge bg-success">
																{candidacy.status}
															</span>
														)}
														{candidacy.status === "Refusé" && (
															<span className="badge bg-danger">
																{candidacy.status}
															</span>
														)}
														{candidacy.status === "en attend" && (
															<span className="badge bg-warning">
																{candidacy.status}
															</span>
														)}
														{candidacy.status !== "Accepté" &&
															candidacy.status !== "Refusé" &&
															candidacy.status !== "en attend" && (
																<span className="badge bg-info">
																	{candidacy.status}
																</span>
															)}
													</div>
												</div>
											</div>
											<div className="col text-start mb-5">
												<Link
													to={`/condidat/mesoffres/details/${candidacy._id}`}
													className="btn btnVoir"
												>
													Voir plus
												</Link>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-center card card-body my-3">
							Vous n'avez soumis aucune candidature pour le moment
						</p>
					)}
				</div>
			</section>
			{condidacy.length > 0 && itemsPerPage > 4 && (
				<div className="pagination-container pagination-containerpl text-center">
					<ReactPaginate
						previousLabel={"previous"}
						nextLabel={"next"}
						breakLabel={"..."}
						breakClassName={"break-me"}
						pageCount={pageCount}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={handlePageClick}
						containerClassName={"pagination"}
						activeClassName={"active"}
						previousClassName={"page-item"}
						nextClassName={"page-item"}
						breakLinkClassName={"page-link"}
						pageClassName={"page-item"}
						pageLinkClassName={"page-link"}
						previousLinkClassName={"page-link"}
						nextLinkClassName={"page-link"}
					/>
				</div>
			)}
		</div>
	);
};

export default MesoffreCondidat;
