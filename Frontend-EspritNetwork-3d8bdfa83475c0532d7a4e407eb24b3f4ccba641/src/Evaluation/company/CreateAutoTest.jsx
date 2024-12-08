import { useEffect, useState } from "react";
import "../Evaluation.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Navbar } from "../../Home/Navbar";
import Swal from "sweetalert2";

export function CreateAutoTest() {
	const navigate = useNavigate();
	const [test, setTest] = useState({
		domaine: "",
		categorie: "",
		technologie: "",
		duree: "",
		nbQN1: "",
		nbQN2: "",
		nbQN3: "",
		questions: [],
		description: "",
	});

	const [technologies, setTechnologies] = useState([]);
	const [domaines, setDomaines] = useState([]);
	const handleTestChange = (e) => {
		setTest({ ...test, [e.target.name]: e.target.value });
	};
	const handleAddTest = (e) => {
		console.log("adddd");
		e.preventDefault();
		// Check if any attribute in test or questions is empty
		if (test.domaine == "" || test.description == "" ||  test.nbQN1 == "" ||  test.nbQN2 == "" ||  test.nbQN3 == "") {
			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: 'Veuillez remplir tous les champs pour ajouter un test !',
			});
			return;
		}

		axios
			.post(`http://localhost:3000/test/addAutomatic`, {
				...test,
			})
			.then((response) => {
				console.log(response.data);
				if(response.data.message==="Probléme lors de la création du test"){
					toast.error("Probléme lors de la création du test !!", {
						duration: 2500,
					});
				}else{
				toast.success("Test ajouté avec succès !!", {
					duration: 2500,
				});
			}
			})
			.catch((err) => {
				console.log(err.response.data.message);
			});
	};
	useEffect(() => {
		axios.get("http://localhost:3000/domaine/getAll").then((response) => {
			setDomaines(response.data);
		});
		axios.get("http://localhost:3000/competence/getAll").then((response) => {
			setTechnologies(response.data);
			console.log("Technologies : ", response.data);
		});
	}, []);
	return (
		<>
			<div>
				<Navbar />
				<section id="contact" className="contact  py-5">
					<div className="container py-5" data-aos="fade-up ">
						<div className="section-title py-3">
							<h2 className="text-black">Génération automatique de tests </h2>
						</div>
						<div className="row">
							<Toaster />
							<div className="col-lg-12 mt-5 mt-lg-0 d-flex align-items-stretch">
								<form className="form-ajout">
									<div className="row">
										<div className="col-6">
											<div className="form-group ">
												<label> Domaine </label>
												<input
													className="form-control"
													list="domaine"
													name="domaine"
													onChange={(e) => {
														handleTestChange(e);
													}}
												/>

												<datalist id="domaine">
													{domaines.map((item, index) => (
														<option value={item.name} key={index}></option>
													))}
												</datalist>
											</div>
										</div>
										<div className="col-6">
											<div className="form-group ">
												<label> Catégorie </label>
												<select
													className="form-select"
													name="categorie"
													onChange={(e) => {
														handleTestChange(e);
													}}
												>
													<option>Autre</option>
													<option>Backend</option>
													<option>Frontend</option>
												</select>
											</div>
										</div>
										<div className="col-6">
											<label className="py-2">Durée</label>
											<input
												type="numbre"
												className="form-control"
												placeholder="Durée en minutes"
												name="duree"
												onChange={handleTestChange}
											/>
										</div>
										<div className="col-6">
											<div className="form-group ">
												<label> Technologies </label>
												<input
													className="form-control"
													list="technologie"
													name="technologie"
													onChange={(e) => {
														handleTestChange(e);
													}}
												/>

												<datalist id="technologie">
													{technologies.map((item, index) => (
														<option value={item.name} key={index}></option>
													))}
												</datalist>
											</div>
										</div>
									</div>

									<div className="row">
										<div className="col-4 ">
											<div className="form-group ">
												<label>Nombre des questions Niveau 1</label>
												<input
													type="number"
													className="form-control"
													placeholder="Nombre des questions Niveau 1"
													name="nbQN1"
													value={test.nbQN1}
													onChange={handleTestChange}
												/>
											</div>
										</div>
										<div className="col-4 ">
											<div className="form-group ">
												<label>Nombre des questions Niveau 2</label>
												<input
													type="number"
													className="form-control"
													placeholder="Nombre des questions Niveau 2"
													name="nbQN2"
													value={test.nbQN2}
													onChange={handleTestChange}
												/>
											</div>
										</div>
										<div className="col-4 ">
											<div className="form-group ">
												<label>Nombre des questions Niveau 3</label>
												<input
													type="number"
													className="form-control"
													placeholder="Nombre des questions Niveau 3"
													name="nbQN3"
													value={test.nbQN3}
													onChange={handleTestChange}
												/>
											</div>
										</div>
									</div>
									<div className="col">
										<label className="">Description</label>

										<textarea
											className=" form-control textarea "
											placeholder="ajouter une description "
											name="description"
											onChange={handleTestChange}
										/>
									</div>

									<hr />

									<div className="d-flex justify-content-end ">
										<button
											type="reset"
											className="btn mx-2"
											style={{
												color: "white",
												backgroundColor: "#cf0000",
											}}
											onClick={() => navigate("/evalution")}
										>
											Annuler
										</button>
										<button
											type="button"
											className="btn btn-outline-success "
											onClick={handleAddTest}
										>
											Enregistrer
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
