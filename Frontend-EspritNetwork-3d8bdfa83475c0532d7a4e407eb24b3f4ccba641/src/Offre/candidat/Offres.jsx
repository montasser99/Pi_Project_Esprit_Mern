import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../Offre.css";
import OffersList from "./OffersList";
import FilterComponent from "../filterComponent";
import { useSelector } from "react-redux";

const Offres = () => {
	const [offers, setOffers] = useState([]);
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;
	const [userAddress] = useState(userInfo.adresseC);


	const [filterOptions, setFilterOptions] = useState({
		typeoffre: [],
		competence: [],
		typecontrat: [],
		langue: [],
		experience: [],
	});
	const [pageLoaded, setPageLoaded] = useState(false); 

	const apiKey =
		"AtL9AIZCzKARqxrYW_72bgOmobLAWPfkJMxT0AuJZVqhFGBOORjdSiVg2Wvnn0Qp";

	const [initialTypeOffreCounts, setInitialTypeOffreCounts] = useState([]);
	const [initialTypeContratCounts, setInitialTypeContratCounts] = useState([]);
	const [initialCompetenceCounts, setInitialCompetenceCounts] = useState([]);
	const [initialLangueCounts, setInitialLangueCounts] = useState([]);
	const [initialExperienceCounts, setInitialExperienceCounts] = useState([]);

	const [pageNumber, setPageNumber] = useState(0);
	const [itemsPerPage, setitemsPerPage] = useState(3);

	const [showFilter, setShowFilter] = useState(true);
	const handleToggleFilter = () => {
		setShowFilter(!showFilter);
	};

	const handlePageClick = ({ selected }) => {
		setPageNumber(selected);
	};

	const [filteredOffersCount, setFilteredOffersCount] = useState(0);
	const [filteredOffers, setFilteredOffers] = useState([]);

	const [selectedSortOption, setSelectedSortOption] = useState("");
	const handleSortChange = (e) => {
		setSelectedSortOption(e.target.value);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost:3000/offre/getAll");
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

		fetchData();
	}, [pageLoaded]);

	const countOffersByCategory = (field) => {
		const countMap = {};

		extractUniqueValues(field).forEach((value) => {
			countMap[value] = offers.filter((offer) =>
				offer[field].toLowerCase().includes(value.toLowerCase())
			).length;
		});

		return countMap;
	};

	const handleFilterChange = (category, value) => {
		setFilterOptions((prevFilterOptions) => {
			const updatedValues = prevFilterOptions[category].includes(value)
				? prevFilterOptions[category].filter((v) => v !== value)
				: [...prevFilterOptions[category], value];

			return {
				...prevFilterOptions,
				[category]: updatedValues,
			};
		});
		setPageNumber(0); 
	};

	useEffect(() => {
		const updateInitialCounts = () => {
			const newInitialTypeOffreCounts = countOffersByCategory(
				"typeoffre",
				filteredOffers
			);
			const newInitialTypeContratCounts = countOffersByCategory(
				"typecontrat",
				filteredOffers
			);
			const newInitialCompetenceCounts = countOffersByCategory(
				"competence",
				filteredOffers
			);
			const newInitialLangueCounts = countOffersByCategory(
				"langue",
				filteredOffers
			);
			const newInitialExperienceCounts = countOffersByCategory(
				"experience",
				filteredOffers
			);

			setInitialTypeOffreCounts(newInitialTypeOffreCounts);
			setInitialTypeContratCounts(newInitialTypeContratCounts);
			setInitialCompetenceCounts(newInitialCompetenceCounts);
			setInitialLangueCounts(newInitialLangueCounts);
			setInitialExperienceCounts(newInitialExperienceCounts);
		};

		updateInitialCounts();
	}, [filteredOffers]);

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
			setFilteredOffersCount(filteredOffers.length);
		};

		updateFilteredOffers();
	}, [offers, filterOptions]);

	useEffect(() => {
		const sortOffers = () => {
			let sortedOffers = [...offers]; 

			if (selectedSortOption === "Date d'expiration (croissant)") {
				sortedOffers.sort(
					(a, b) => new Date(a.dateExpiration) - new Date(b.dateExpiration)
				);
			} else if (selectedSortOption === "Date d'expiration (décroissant)") {
				sortedOffers.sort((a, b) => {
					const dateA = new Date(a.dateExpiration);
					const dateB = new Date(b.dateExpiration);

					const isTodayA = dateA.toDateString() === new Date().toDateString();
					const isTodayB = dateB.toDateString() === new Date().toDateString();

					if (isTodayA && !isTodayB) {
						return 1;
					} else if (!isTodayA && isTodayB) {
						return -1;
					}

					return dateB - dateA;
				});
			} else if (selectedSortOption === "Date de publication (décroissant)") {
				sortedOffers.sort(
					(a, b) => new Date(a.created_at) - new Date(b.created_at)
				);
			} else if (selectedSortOption === "Date de publication (croissant)") {
				sortedOffers.sort(
					(a, b) => new Date(b.created_at) - new Date(a.created_at)
				);
			}

			return sortedOffers;
		};

		const sortedOffers = sortOffers();
		setFilteredOffers(sortedOffers);
	}, [selectedSortOption, offers]);

	const [viewType, setViewType] = useState("biborder"); 

	const handleViewTypeChange = (type) => {
		setViewType(type === "grid" ? "grid" : "biborder");
	};

	useEffect(() => {
		if (viewType === "grid") {
			setitemsPerPage(6);
		} else {
			setitemsPerPage(3);
		}
	}, [viewType]);

	const displayOffers = filteredOffers.slice(
		pageNumber * itemsPerPage,
		(pageNumber + 1) * itemsPerPage
	);

	const pageCount = Math.ceil(filteredOffers.length / itemsPerPage);

	const calculateDistance = async () => {
		if (filteredOffers.length > 0 && userAddress) {
		try {
			const userGeocodingUrl = `http://dev.virtualearth.net/REST/v1/Locations?query=${encodeURIComponent(userAddress)}&key=${apiKey}`;
			const userResponse = await axios.get(userGeocodingUrl);
			const userLocation =
				userResponse.data.resourceSets[0].resources[0].point.coordinates;

			const sorted = await Promise.all(
				filteredOffers.map(async (offer) => {
					const offerAddress = offer.user.adresseC;
					const offerGeocodingUrl = `http://dev.virtualearth.net/REST/v1/Locations?query=${encodeURIComponent(
						offerAddress
					)}&key=${apiKey}`;
					const offerResponse = await axios.get(offerGeocodingUrl);
					const offerLocation =
						offerResponse.data.resourceSets[0].resources[0].point.coordinates;
					const distance = Math.sqrt(
						Math.pow(offerLocation[0] - userLocation[0], 2) +
							Math.pow(offerLocation[1] - userLocation[1], 2)
					);

					return { ...offer, distance };
				})
			);

			sorted.sort((a, b) => a.distance - b.distance);

			setFilteredOffers(sorted);
		} catch (error) {
			console.error("Error calculating distance:", error);
		}
	}
	};

	useEffect(() => {
		if (selectedSortOption === 'closest') {
		  calculateDistance();
		}
	  }, [selectedSortOption]);
	  
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 767) {
				setViewType("grid");
			}
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div>
			<section id="services" className="section " data-aos="fade-up">
				<div className="container">
					<div className="row d-flex flex-row align-items-center card">
						<div
							className="col d-flex flex-row d-none d-md-flex"
							style={{ marginLeft: "170px" }}
						>
							<div
								className="mx-0"
								onClick={() => handleViewTypeChange("biborder")}
							>
								<i
									className="bi bi-border-width"
									style={{
										fontSize: "27px",
										color: viewType === "biborder" ? "black" : "gray",
										cursor: "pointer",
									}}
								></i>
							</div>
							<div
								className="mx-2"
								onClick={() => handleViewTypeChange("grid")}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									className="bi bi-grid-3x3-gap-fill"
									viewBox="0 0 16 16"
									style={{
										fontSize: "24px",
										marginTop: "8px",
										color: viewType === "grid" ? "black" : "gray",
										cursor: "pointer",
									}}
								>
									<path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
								</svg>
							</div>
						</div>

						<div className="col annonce-counter">
							<p className="text-center">{`Il y a ${filteredOffersCount} annonces disponibles.`}</p>
						</div>
						<div
							className="col input-group d-flex justify-content-center"
							style={{ marginRight: "10px" }}
						>
							<select
								className="form-select mx-2 py-1 red-hover small-select"
								name="categorie"
								onChange={handleSortChange}
							>
								<option value="">Trier par</option>
								<option value="closest">
									L'emplacement le plus proche de votre localisation
								</option>
								<option value="Date d'expiration (croissant)">
									Date d'expiration (croissant)
								</option>
								<option value="Date d'expiration (décroissant)">
									Date d'expiration (décroissant)
								</option>
								<option value="Date de publication (croissant)">
									Date de publication (croissant)
								</option>
								<option value="Date de publication (décroissant)">
									Date de publication (décroissant)
								</option>
							</select>
						</div>
					</div>

					<div className="row">
						<div className="text-center d-block d-md-none">
							{" "}
							<button
								className="btn btn-outline-primary mt-3 mb-2"
								onClick={handleToggleFilter}
							>
								{showFilter ? "Masquer le filtre" : "Afficher le filtre"}
							</button>
						</div>

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

						<div className={"col-9 py-5"}>
							<OffersList offers={displayOffers} viewType={viewType} />
							{filteredOffers.length > itemsPerPage && (
								<div className="pagination-container text-center">
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
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Offres;
