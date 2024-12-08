import "../Selection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { BsSearch } from "react-icons/bs";

export function Shortlist() {
	const [collections, setCollections] = useState([]);
	const [titre, setTitre] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState(null);
	const [titleError, setTitleError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearchTermChange = (event) => {
		setSearchTerm(event.target.value);
	};
	const filteredCollections = collections.filter((collection) =>
		collection.titre.toLowerCase().includes(searchTerm.toLowerCase())
	);

	handleSearchTermChange;

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			const imageData = reader.result;
			setImage(imageData);
		};

		reader.readAsDataURL(file);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!titre || !description) {
			if (!titre) setTitleError(true);
			if (!description) setDescriptionError(true);

			return;
		}
		try {
			const formData = new FormData();
			formData.append("titre", titre);
			formData.append("description", description);
			formData.append("image", image);

			const response = await axios.post(
				"http://localhost:3000/collection/add",
				formData,
				{ headers: { "Content-Type": "application/json" } }
			);

			console.log("Collection added successfully", response.data);
			toast.success("Ajoutée avec succès!");

			setTitre("");
			setDescription("");
			setImage(null);

			const updatedCollections = await axios.get(
				"http://localhost:3000/collection/getAll"
			);
			setCollections(updatedCollections.data);
			closeModal();
		} catch (error) {
			console.error("Error adding collection:", error);
		}
	};

	useEffect(() => {
		const getCollections = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/collection/getAll"
				);
				setCollections(response.data);
			} catch (error) {
				console.error("Error fetching collections:", error);
			}
		};

		getCollections();
	}, []);
	const handleDelete = async (collectionId) => {
		// Afficher le message de confirmation
		Swal.fire({
			title: "Es-tu sûr?",
			text: "Vous ne pourrez pas revenir en arrière !",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "black",
			cancelButtonColor: "#d33",
			confirmButtonText: "Oui, supprimez-le !",
			cancelButtonText: "Annuler",
		}).then((result) => {
			if (result.isConfirmed) {
				deleteCollection(collectionId);
			}
		});
	};

	const deleteCollection = async (collectionId) => {
		try {
			await axios.delete(
				`http://localhost:3000/collection/delete/${collectionId}`
			);
			setCollections((prevCollections) =>
				prevCollections.filter((collection) => collection.id !== collectionId)
			);

			toast.success("Supprimée avec succès!");
			const updatedCollections = await axios.get(
				"http://localhost:3000/collection/getAll"
			);
			setCollections(updatedCollections.data);
		} catch (error) {
			console.error("Error deleting collection:", error);
		}
	};

	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setTitre("");
		setDescription("");
		setImage(null);
		setTitleError(false);
		setDescriptionError(false);
		setIsModalOpen(false);
	};

	return (
		<>
			<main id="main">
				<ToastContainer />
				<div className="mt-5" style={{ transform: "translateY(30%)" }}>
					<div className="title">
						<h2>Toutes les collections</h2>
					</div>
					<div
						className="input-group py-1 mb-3"
						style={{ maxWidth: "800px", transform: "translateX(50%)" }}
					>
						<span className="input-group-text">
							<BsSearch />
						</span>
						<input
							type="text"
							className="form-control"
							placeholder="Search candidates by name"
							value={searchTerm}
							onChange={handleSearchTermChange}
						/>

						<button className="btn btn-danger" type="button">
							Search
						</button>
					</div>
				</div>
				<section
					id="team"
					className="team section-bg"
					style={{ transform: "translateY(10%)" }}
				>
					<div className="row justify-content-center">
						{filteredCollections.map((collection, index) => (
							<div
								className="col-lg-4"
								key={collection.id}
								data-aos="zoom-in"
								data-aos-delay="100"
							>
								<div
									className="member d-flex align-items-start"
									style={{
										width: "80%",
										borderTop: "2px solid rgb(198, 1, 1)",
										borderBottom: "2px solid rgb(198, 1, 1)",
									}}
								>
									<Link
										to={`/selection/${collection._id}?name=${collection.titre}`}
										className="collection-link"
									>
										<div className="pic">
											{collection.image ? (
												<img
													src={collection.image}
													className="img-fluid"
													alt=""
													onError={(e) => {
														e.target.onerror = null;
														e.target.src =
															"../../public/assets/img/team/holder.jpg";
													}}
												/>
											) : (
												<img
													src="../../public/assets/img/team/holder.jpg"
													className="img-fluid"
													alt=""
												/>
											)}
										</div>
									</Link>

									<div className="member-info">
										<h3 style={{ color: "#322c2c" }}>{collection.titre}</h3>
										<p>{collection.description}</p>
										<div className="social">
											<a href="/selection">
												<img
													src="../../public/assets/img/team/team-1.jpg"
													alt="Candidat 1"
													className="candidate-img"
												/>
											</a>

											<a href="/selection">
												<img
													src="../../public/assets/img/team/team-4.jpg"
													className="candidate-img"
												/>
											</a>
										</div>
									</div>

									<div className="trash-icon">
										<FontAwesomeIcon
											icon={faTrashAlt}
											color="red"
											onClick={() => handleDelete(collection._id)}
										/>
									</div>
								</div>
							</div>
						))}

						<div className="col-lg-4" data-aos="zoom-in" data-aos-delay="100">
							<div
								className="member d-flex align-items-start"
								style={{ width: "80%" }}
							>
								<div className="placeholder-info">
									<h4 style={{ color: "#322c2c" }}>Ajouter une collection</h4>
									<div className="placeholder-icon">
										<a
											className="mx-3 "
											data-bs-toggle="modal"
											data-bs-target="#verticalycentered"
										>
											<FontAwesomeIcon
												icon={faPlus}
												color="#322c2c"
												size="8x"
												onClick={openModal}
											/>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className="modal fade" id="verticalycentered" tabIndex={-1}>
					<div className="modal-dialog modal-lg modal-dialog-centered">
						<div className="modal-content ">
							<h2 className="modal-title d-flex justify-content-center pt-3 ">
								Ajouter collection
							</h2>
							<section id="contact" className="contact  py-5">
								<div className=" d-flex flex-row">
									<form className="form-ajout" onSubmit={handleSubmit}>
										<div className="mb-3">
											<label htmlFor="title" className="form-label">
												Titre:
											</label>
											<input
												type="text"
												className={`form-control ${
													titleError ? "is-invalid" : ""
												}`}
												id="title"
												value={titre}
												onChange={(e) => {
													setTitre(e.target.value);
													setTitleError(false);
												}}
											/>
											{titleError && (
												<div className="invalid-feedback">
													Le titre est requis.
												</div>
											)}
										</div>
										<div className="mb-3">
											<label htmlFor="content" className="form-label">
												Description:
											</label>
											<textarea
												className={`form-control ${
													descriptionError ? "is-invalid" : ""
												}`}
												id="content"
												value={description}
												onChange={(e) => {
													setDescription(e.target.value);
													setDescriptionError(false);
												}}
											></textarea>
											{descriptionError && (
												<div className="invalid-feedback">
													La description est requise.
												</div>
											)}
										</div>
										<div className="mb-3">
											<label htmlFor="image" className="form-label">
												Image:
											</label>
											<input
												type="file"
												className="form-control"
												id="image"
												accept="image/*"
												onChange={handleImageChange}
											/>
										</div>
										<div className="modal-footer">
											<button
												type="button"
												className="btn btn-dark"
												data-bs-dismiss="modal"
											>
												Annuler
											</button>
											<button className="btn btn-dark" onClick={handleSubmit}>
												Enregistrer
											</button>
										</div>
									</form>
								</div>
							</section>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
