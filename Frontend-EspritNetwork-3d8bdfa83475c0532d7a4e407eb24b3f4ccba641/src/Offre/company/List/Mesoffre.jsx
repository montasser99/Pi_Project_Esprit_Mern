import { useEffect, useState } from "react";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import ReactPaginate from "react-paginate";
import "../../Offre.css";
import OffersList from "./OffersList";
import FilterComponent from "../../filterComponent";
import { useNavigate } from "react-router-dom";

const Mesoffre = () => {
	// Assuming userInfo is saved in localStorage
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo1 = JSON.parse(userInfoString);
	var userId = userInfo1._id;
	const { toastData, clearToastData } = useAppContext();
	const [offers, setOffers] = useState([]);
	const [filterOptions, setFilterOptions] = useState({
		typeoffre: [],
		competence: [],
		typecontrat: [],
		langue: [],
		experience: [],
	});

	const [pageLoaded, setPageLoaded] = useState(false); 

	const [showFilter, setShowFilter] = useState(true);
	const handleToggleFilter = () => {
		setShowFilter(!showFilter);
	};

	const [initialTypeOffreCounts, setInitialTypeOffreCounts] = useState([]);
	const [initialTypeContratCounts, setInitialTypeContratCounts] = useState([]);
	const [initialCompetenceCounts, setInitialCompetenceCounts] = useState([]);
	const [initialLangueCounts, setInitialLangueCounts] = useState([]);
	const [initialExperienceCounts, setInitialExperienceCounts] = useState([]);

	const [pageNumber, setPageNumber] = useState(0);
	const itemsPerPage = 3;

	const handlePageClick = ({ selected }) => {
		setPageNumber(selected);
	};
	const navigate = useNavigate();
	const handleStatistiqueClick = () => {
		navigate("/statistique-offre");
	};

	const [filteredOffers, setFilteredOffers] = useState([]);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`		http://localhost:3000/offre/getbyidUser/${userId}`
			);
			setOffers(response.data);
			const initialTypeOffreCounts = countOffersByCategory(
				"typeoffre",
				response.data
			);
			const initialTypeContratCounts = countOffersByCategory(
				"typecontrat",
				response.data
			);
			const initialCompetenceCounts = countOffersByCategory(
				"competence",
				response.data
			);
			const initialLangueCounts = countOffersByCategory(
				"langue",
				response.data
			);
			const initialExperienceCounts = countOffersByCategory(
				"experience",
				response.data
			);

			setInitialTypeOffreCounts(initialTypeOffreCounts);
			setInitialTypeContratCounts(initialTypeContratCounts);
			setInitialCompetenceCounts(initialCompetenceCounts);
			setInitialLangueCounts(initialLangueCounts);
			setInitialExperienceCounts(initialExperienceCounts);

			setPageLoaded(true);
		} catch (error) {
			console.error("Error fetching offers:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [pageLoaded]);

	const countOffersByCategory = (field) => {
		const countMap = {};

		// Initialiser le compteur pour chaque valeur de catégorie
		extractUniqueValues(field).forEach((value) => {
			countMap[value] = offers.filter((offer) =>
				offer[field].toLowerCase().includes(value.toLowerCase())
			).length;
		});

		return countMap;
	};

	const handleFilterChange = (field, value) => {
		setFilterOptions((prevFilterOptions) => {
			const updatedValues = prevFilterOptions[field].includes(value)
				? prevFilterOptions[field].filter((v) => v !== value)
				: [...prevFilterOptions[field], value];

			return {
				...prevFilterOptions,
				[field]: updatedValues,
			};
		});
		setPageNumber(0); // Réinitialiser la page à la première page lorsqu'un filtre est modifié
	};

	// Fonction pour extraire les valeurs uniques d'une catégorie
	const extractUniqueValues = (field) => {
		if (
			field === "typeoffre" ||
			field === "typecontrat" ||
			field === "competence" ||
			field === "langue" ||
			field === "experience"
		) {
			return Array.from(
				new Set(
					offers.flatMap((offer) => offer[field].toLowerCase().split(","))
				)
			)
				.map((value) => value.trim())
				.filter((value) => value !== "");
		} else {
			return Array.from(new Set(offers.map((offer) => offer[field])))
				.map((value) => value.trim())
				.filter((value) => value !== "");
		}
	};

	useEffect(() => {
		const updateFilteredOffers = () => {
			const filteredOffers = offers.filter((offer) => {
				return Object.keys(filterOptions).every((field) => {
					if (filterOptions[field].length > 0) {
						return filterOptions[field].some((filterValue) =>
							Array.isArray(offer[field])
								? offer[field].some((offerValue) =>
										offerValue.toLowerCase().includes(filterValue.toLowerCase())
								  )
								: offer[field].toLowerCase().includes(filterValue.toLowerCase())
						);
					}
					return true;
				});
			});

			setFilteredOffers(filteredOffers);
		};

		updateFilteredOffers();
	}, [offers, filterOptions]);

	const displayOffers = filteredOffers.slice(
		pageNumber * itemsPerPage,
		(pageNumber + 1) * itemsPerPage
	);

	const pageCount = Math.ceil(filteredOffers.length / itemsPerPage);

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

	return (
		<div>
			<Toaster />
			<section id="services" className="section" data-aos="fade-up">
				<div className="container">
					<div className="section-title ">
						<h2 className="text-black">Liste de Mes Offres</h2>
					</div>
					<div className="row" style={{ marginTop: "-50px" }}>
						{/* Conditionally render the filter button on mobile */}
						<div className="text-center d-block d-md-none">
							{" "}
							{/* Only visible on mobile */}
							<button
								className="btn btn-outline-dark mt-3 mb-2"
								onClick={handleToggleFilter}
							>
								{showFilter ? "Masquer le filtre" : "Afficher le filtre"}
							</button>
						</div>

						{/* Conditionally render the filter component based on showFilter state */}
						{showFilter && (
							<FilterComponent
								filterOptions={filterOptions}
								handleFilterChange={handleFilterChange}
								counts={{
									initialTypeOffreCounts,
									initialTypeContratCounts,
									initialCompetenceCounts,
									initialLangueCounts,
									initialExperienceCounts,
								}}
							/>
						)}

						<div className="col-8 py-5">
							<>
								<OffersList offers={displayOffers} fetchData={fetchData} />
								{filteredOffers.length > itemsPerPage && (
									<ReactPaginate
										previousLabel={"previous"}
										nextLabel={"next"}
										breakLabel={"..."}
										breakClassName={"break-me"}
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
										pageCount={pageCount}
									/>
								)}
							</>
						</div>
						<button
							className="btn btn-dark w-25"
							onClick={handleStatistiqueClick}
						>
							Statistique
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Mesoffre;
