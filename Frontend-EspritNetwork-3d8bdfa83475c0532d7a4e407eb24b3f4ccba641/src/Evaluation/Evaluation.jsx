import { Link } from "react-router-dom";
import "./Evaluation.css";
import { Navbar } from "../Home/Navbar";

export function Evaluation() {
	return (
		<>
			<Navbar />
			{/* ======= Section d'Évaluation ======= */}
			<section id="faq" className="faq section-bg py-5 mt-5 ">
				<div className="container" data-aos="fade-up ">
					<div className="section-title py-5">
						<h2 className="text-black">Évaluation des candidats</h2>
						<p>
							Vous êtes sur le point de créer des tests en ligne pour évaluer
							vos candidats. Vous pouvez choisir parmi différentes méthodes de
							création :
						</p>
					</div>

					<div className="faq-list">
						<ul>
							<li data-aos="fade-up" data-aos-delay={100}>
								<i className="bx bx-help-circle icon-help" />
								<a
									data-bs-toggle="collapse"
									className="collapse"
									data-bs-target="#faq-list-1"
								>
									Création personnalisée de tests
									<i className="bx bx-chevron-down icon-show" />
									<i className="bx bx-chevron-up icon-close" />
								</a>
								<div
									id="faq-list-1"
									className="collapse "
									data-bs-parent=".faq-list"
								>
									<div className="py-4 d-flex justify-content-center">
										<Link
											to="test/create"
											className="btn btn-outline-success mx-3 "
										>
											Créer un test sur mesure
										</Link>{" "}
										<Link
											to="test/CreateAutomatically"
											className="btn btn-outline-success mx-3 "
										>
											Créer automatiquement
										</Link>
										<Link
											to="test/lister"
											className="btn btn-outline-secondary"
										>
											Voir la liste des tests
										</Link>
									</div>
								</div>
							</li>
							<li data-aos="fade-up" data-aos-delay={200}>
								<i className="bx bx-help-circle icon-help" />
								<a
									data-bs-toggle="collapse"
									data-bs-target="#faq-list-2"
									className="collapsed"
								>
									Utilisation de banques de questions
									<i className="bx bx-chevron-down icon-show" />
									<i className="bx bx-chevron-up icon-close" />
								</a>
								<div
									id="faq-list-2"
									className="collapse"
									data-bs-parent=".faq-list"
								>
									<div className="py-4 d-flex justify-content-center">
										<Link
											to="question/create"
											className="btn btn-outline-success mx-3 "
										>
											Créer une banque de questions
										</Link>
										<Link
											to="question/import"
											className="btn btn-outline-success mx-3 "
										>
											Importer des questions
										</Link>
										<Link
											to="question/lister"
											className="btn btn-outline-secondary"
										>
											Voir la liste des questions
										</Link>
									</div>
								</div>
							</li>

							<li data-aos="fade-up" data-aos-delay={300}>
								<i className="bx bx-help-circle icon-help" />
								<a
									data-bs-toggle="collapse"
									data-bs-target="#faq-list-4"
									className="collapsed"
								>
									Consultation des évaluations
									<i className="bx bx-chevron-down icon-show" />
									<i className="bx bx-chevron-up icon-close" />
								</a>
								<div
									id="faq-list-4"
									className="collapse"
									data-bs-parent=".faq-list"
								>
									<div className="py-4 d-flex justify-content-center">
										<Link
											to="test/results"
											className="btn btn-outline-success mx-3 "
										>
											Voir les résultats des tests
										</Link>
										<Link
											to="assessments/assessmentPage"
											className="btn btn-outline-secondary"
										>
											Voir mes évaluations
										</Link>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</section>
			{/*  =======  Fin de la Section d'Évaluation  =======  */}
		</>
	);
}
