import { useState } from "react";
import "../Evaluation.css";
import "./question.css";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export function ImportQs() {
	const [file, setFile] = useState();
	const navigate = useNavigate();
	const [fileName, setFileName] = useState("");
	const [question, setQuestion] = useState({
		domaine: "",
		categorie: "",
		technologie: "",
	});
	const { domaine, categorie, technologie, path } = question;

	const handleQuestionChange = (e) => {
		setQuestion({ ...question, [e.target.name]: e.target.value });
	};

	const saveFile = (e) => {
		setFile(e.target.files[0]);
		console.log(e.target.files[0]);
		setFileName(e.target.files[0].name);
	};

	const handleCreateQuestion = async () => {
		try {
			console.log("Question:", question);
			const formData = new FormData();
			formData.append("file", file);
			formData.append("fileName", fileName);
			formData.append("domaine", domaine);
			formData.append("categorie", categorie);
			formData.append("technologie", technologie);
			formData.append("path", path);

			const response = await axios.post(
				"http://localhost:3000/question/import",
				formData
			);

			console.log("Questions added successfully:", response.data);
			
			if(response.data.message==="Error uploading file"){
				toast.error("Error uploading file !!", {
					duration: 2500,
				});
			}else{
				toast.success("Questions importée avec succès !!", {
					duration: 2500,
				});
		    }
			
			// navigate("/evalution/question/lister");
		} catch (error) {
			console.error("Error adding question:", error);
		}
	};

	return (
		<div>
			<Toaster />
			<section id="contact" className="contact py-5">
				<div className="container py-5" data-aos="fade-up ">
					<div className="section-title py-5">
						<h2 className="text-black">
							Importer des questions
							<i className="bi bi-arrow-up-circle custom-icon mx-4"></i>
						</h2>
					</div>
					<div className="row">
						<div className="col-lg-12 mt-5 mt-lg-0 d-flex align-items-stretch">
							<form className="form-ajout">
								<div className="row">
									<div className="form-group col-md-4">
										<label>Domaine</label>
										<input
											type="text"
											className="form-control"
											name="domaine"
											value={domaine}
											onChange={handleQuestionChange}
										/>
									</div>
									<div className="form-group col-md-4">
										<label>Catégories </label>
										<input
											type="text"
											className="form-control"
											name="categorie"
											value={categorie}
											onChange={handleQuestionChange}
										/>
									</div>
									<div className="form-group col-md-4">
										<label>Techologie :</label>
										<input
											type="text"
											className="form-control"
											id="questionInput"
											name="technologie"
											value={technologie}
											onChange={handleQuestionChange}
										/>
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-12">
										<div className="d-flex flex-row">
											<label>Importer les questions :</label>
										</div>
										<div className="input-group mb-3">
											<input
												type="file"
												className="form-control"
												name="file" 
												accept=".xls, .xlsx" 
												onChange={saveFile}
											/>
										</div>
									</div>
								</div>
								<div className="d-flex justify-content-end">
									<button
										type="button"
										className="btn"
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
										className="btn mx-3"
										style={{
											color: "white",
											backgroundColor: "#37517e",
										}}
										onClick={handleCreateQuestion}
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
	);
}
