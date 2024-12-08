import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { USER_LOGIN_SUCCESS } from "../Redux/Constants/UserContants";
import { useNavigate } from "react-router-dom";
import Chatbot from "../Chatbot/Chatbot";

export function Home() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const emailFromParams = queryParams.get("email");
		const nameFromParams = queryParams.get("name");
		const secretFromParams = queryParams.get("secret");

		const userData = localStorage.getItem("user");
		if (userData) {
			const { email, name, secret } = JSON.parse(userData);
			setUserDataAndRedirect(email, name, secret);
		} else if (emailFromParams && nameFromParams && secretFromParams) {
			localStorage.setItem(
				"user",
				JSON.stringify({
					email: emailFromParams,
					name: nameFromParams,
					secret: secretFromParams,
				})
			); // Utilisation de localStorage
			setUserDataAndRedirect(emailFromParams, nameFromParams, secretFromParams);
		}
	}, [dispatch, navigate]);

	const setUserDataAndRedirect = (email, name, secret) => {
		dispatch({ type: USER_LOGIN_SUCCESS, payload: { email, name, secret } });
		navigate("/");
	};
	return (
		<>
			<main id="main">
				<Chatbot />
				{/* ======= Hero Section ======= */}
				<section id="hero" className="d-flex align-items-center">
					<div className="container">
						<div className="row">
							<div
								className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
								data-aos="fade-up"
								data-aos-delay={100}
							>
								<h1>Bienvenue sur Esprit Network</h1>
								<h2>connectez-vous à votre avenir avec Esprit Network</h2>
								<div className="d-flex justify-content-center justify-content-lg-start">
									<a href="#about" className="btn-get-started scrollto">
										Commencer
									</a>
								</div>
							</div>
							<div
								className="col-lg-6 order-1 order-lg-2 hero-img"
								data-aos="zoom-in"
								data-aos-delay={200}
							>
								<img
									src="https://onesbenrhaime.github.io/assets/img/hero.png"
									className="img-fluid animated"
									alt
								/>
							</div>
						</div>
					</div>
				</section>
				{/* End Hero */}
				{/* ======= Clients Section ======= */}
				<section id="clients" className="clients section-bg">
					<div className="container">
						<div className="row" data-aos="zoom-in">
							<div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
								<img
									src="https://onesbenrhaime.github.io/assets/img/clients/Print-Logo.png"
									className="img-fluid"
									alt=""
								/>
							</div>
							<div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
								<img
									src="https://onesbenrhaime.github.io/assets/img/clients/TT.png"
									className="img-fluid"
									alt=""
								/>
							</div>
							<div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
								<img
									src="https://onesbenrhaime.github.io/assets/img/clients/STIA.png"
									className="img-fluid"
									alt=""
								/>
							</div>
							<div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
								<img
									src="https://onesbenrhaime.github.io/assets/img/clients/client-4.png"
									className="img-fluid"
									alt=""
								/>
							</div>
							<div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
								<img
									src="https://onesbenrhaime.github.io/assets/img/clients/client-5.png"
									className="img-fluid"
									alt=""
								/>
							</div>
							<div className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center">
								<img
									src="https://onesbenrhaime.github.io/assets/img/clients/client-3.png"
									className="img-fluid"
									alt=""
								/>
							</div>
						</div>
					</div>
				</section>
				{/* End Cliens Section */}
				{/* ======= About Us Section ======= */}
				<section id="about" className="about">
					<div className="container" data-aos="fade-up">
						<div className="section-title">
							<h2 className="text-black">« Qui Sommes-Nous ? » </h2>
						</div>
						<div className="row content">
							<div className="col-lg-6">
								<ul>
									<li>
										<i className="ri-check-double-line" />
										Bienvenue sur EspritNetwork, la plateforme dédiée au réseau
										Esprit . Notre objectif est de connecter les étudiants de
										l&apos;université Esprit avec les entreprises et la
										communauté Esprit au sein d&apos;un réseau de communication
										dynamique. Que vous représentiez une entreprise, un ancien
										élève ou un enseignant, notre plateforme vous offre la
										possibilité de publier des offres de stage, des opportunités
										demploi et bien plus encore.
									</li>
									<li className="mt-4">
										<i className="ri-check-double-line " />
										Les étudiants peuvent créer leur propre CV directement sur
										la plateforme gratuitement. Cela simplifie considérablement
										le processus de recrutement et de sélection des candidats.
										De la création du CV à la passation des tests et à
										l&apos;acceptation finale, chaque étape est conçue pour être
										fluide et efficace, offrant une expérience optimale à toutes
										les parties impliquées.
									</li>
								</ul>
							</div>
							<div className="col-lg-6 pt-4 pt-lg-0">
								<ul>
									<li>
										<i className="ri-check-double-line" />
										Rejoignez-nous dès aujourd hui pour faire partie de cette
										communauté passionnante où les opportunités ne cessent de
										croître. EspritNetwork est votre passerelle vers un avenir
										professionnel prometteur, où les possibilités sont aussi
										vastes que votre ambition.
									</li>
								</ul>
								<a href="#why-us" className="btn-learn-more">
									Explorer
								</a>
							</div>
						</div>
					</div>
				</section>
				{/* End About Us Section */}
				{/* ======= Why Us Section ======= */}
				<section id="why-us" className="why-us section-bg">
					<div className="container-fluid" data-aos="fade-up">
						<div className="row">
							<div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch  order-2 order-lg-1">
								<h2 style={{ color: "#cf0000" }}>Comment Ça Fonctionne ?</h2>
								<div className="content">
									<h3 className="text-black mx-5">
										<strong>Pour Les Entreprises</strong>
									</h3>
								</div>
								<div className="accordion-list">
									<ul>
										<li>
											<a
												data-bs-toggle="collapse"
												className="collapse"
												data-bs-target="#accordion-list-1"
											>
												La publication des offres d emploi rapidement grâce à
												l&apos;utilisation de l&apos;intelligence artificielle.
											</a>
										</li>
										<li>
											<a
												data-bs-toggle="collapse"
												className="collapse"
												data-bs-target="#accordion-list-1"
											>
												Simplifie la sélection des candidats en filtrant
												automatiquement les candidatures selon les critères
												prédéfinis.
											</a>
										</li>
										<li>
											<a
												data-bs-toggle="collapse"
												className="collapse"
												data-bs-target="#accordion-list-1"
											>
												La création des tests et l’organisation des entretiens
												avec les candidats, accélérant ainsi le processus de
												recrutement et supprimant les contraintes logistiques.
											</a>
										</li>
									</ul>
								</div>
							</div>
							<div
								className="col-lg-5 align-items-stretch order-1 order-lg-2 img"
								style={{
									backgroundImage:
										'url("https://onesbenrhaime.github.io/assets/img/esprit-unv.jpeg")',
								}}
								data-aos="zoom-in"
								data-aos-delay={150}
							>
								&nbsp;
							</div>
						</div>
					</div>
					<hr />
					<div className="container-fluid" data-aos="fade-up">
						<div className="row about">
							<div
								className="col-lg-5 align-items-stretch order-2 order-lg-1 img"
								style={{
									backgroundImage:
										'url("https://onesbenrhaime.github.io/assets/img/esprit-unv.jpeg")',
								}}
								data-aos="zoom-in"
								data-aos-delay={150}
							>
								&nbsp;
							</div>
							<div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch  order-1 order-lg-2">
								<div className="content">
									<h3 className="text-black mx-5">
										<strong>Pour Les Candidats</strong>
									</h3>
								</div>
								<div className="accordion-list">
									<ul>
										<li>
											<a
												data-bs-toggle="collapse"
												className="collapse"
												data-bs-target="#accordion-list-1"
											>
												La possibilité de générer rapidement des CV
												professionnels en ligne
											</a>
										</li>

										<li>
											<a
												data-bs-toggle="collapse"
												className="collapse"
												data-bs-target="#accordion-list-1"
											>
												Facilite la recherche et la postulation à des offres
												correspondant à leurs compétences et à leurs intérêts
												grâce à une fonction de recherche avancée par
												localisation et compétence
											</a>
										</li>

										<li>
											<a
												data-bs-toggle="collapse"
												className="collapse"
												data-bs-target="#accordion-list-1"
											>
												La possibilité de participation à des tests en ligne
												personnalisés directement sur notre plateforme{" "}
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* End Why Us Section */}
				{/* ======= Team Section ======= */}
				<section id="team" className="team section-bg">
					<div className="container" data-aos="fade-up">
						<div className="section-title">
							<h2 className="text-black">Presentation De L&apos;équipe</h2>
							<p>
								Nous sommes l&apos;équipe Elite Coders, une équipe de
								développement passionnée qui a fourni des solutions innovantes
								pour répondre aux besoins de nos clients et partenaires. Notre
								objectif principal était de créer une application qui offre des
								expériences utilisateur exceptionnelles tout en optimisant
								l&apos;efficacité et la productivité.
							</p>
						</div>
						<div className="row">
							<div
								className="col-lg-6 "
								data-aos="zoom-in"
								data-aos-delay={100}
							>
								<div className="member d-flex align-items-start">
									<div className="pic">
										<img
											src="https://onesbenrhaime.github.io/assets/img/team/Montassar.png"
											className="img-fluid"
											alt=""
										/>
									</div>
									<div className="member-info">
										<h4>Benouirane Montasser</h4>
										<span>Elève ingénieur</span>
										<p>Responsable du module gestion des offres</p>
										<div className="social">
											<a href>
												<i className="ri-twitter-fill" />
											</a>
											<a href>
												<i className="ri-facebook-fill" />
											</a>
											<a href>
												<i className="ri-instagram-fill" />
											</a>
											<a href>
												<i className="ri-linkedin-box-fill" />
											</a>
										</div>
									</div>
								</div>
							</div>

							<div
								className="col-lg-6 mt-4 mt-lg-0"
								data-aos="zoom-in"
								data-aos-delay={200}
							>
								<div className="member d-flex align-items-start">
									<div className="pic">
										<img
											src="https://onesbenrhaime.github.io/assets/img/team/Ahmed.png"
											className="img-fluid"
											alt=""
										/>
									</div>
									<div className="member-info">
										<h4>Jemai Ahmed</h4>
										<span>Elève ingénieur</span>
										<p>Responsable du module User</p>
										<div className="social">
											<a href>
												<i className="ri-twitter-fill" />
											</a>
											<a href>
												<i className="ri-facebook-fill" />
											</a>
											<a href>
												<i className="ri-instagram-fill" />
											</a>
											<a href>
												<i className="ri-linkedin-box-fill" />
											</a>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-lg-6 mt-4"
								data-aos="zoom-in"
								data-aos-delay={300}
							>
								<div className="member d-flex align-items-start">
									<div className="pic">
										<img
											src="https://onesbenrhaime.github.io/assets/img/team/Ones.png"
											className="img-fluid"
											alt=""
										/>
									</div>
									<div className="member-info">
										<h4>Ben Rhaime Ones</h4>
										<span>Elève ingénieur</span>
										<p>Responsable du module Evaluation</p>
										<div className="social">
											<a href>
												<i className="ri-twitter-fill" />
											</a>
											<a href>
												<i className="ri-facebook-fill" />
											</a>
											<a href>
												<i className="ri-instagram-fill" />
											</a>
											<a href>
												<i className="ri-linkedin-box-fill" />
											</a>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-lg-6 mt-4 "
								data-aos="zoom-in"
								data-aos-delay={300}
							>
								<div className="member d-flex align-items-start">
									<div className="pic">
										<img
											src="https://onesbenrhaime.github.io/assets/img/team/Eya.png"
											className="img-fluid"
											alt=""
										/>
									</div>
									<div className="member-info">
										<h4>Mechergui Eya</h4>
										<span>Elève ingénieur</span>
										<p>Responsable du module Resume et gestion de CV</p>
										<div className="social">
											<a href>
												<i className="ri-twitter-fill" />
											</a>
											<a href>
												<i className="ri-facebook-fill" />
											</a>
											<a href>
												<i className="ri-instagram-fill" />
											</a>
											<a href>
												<i className="ri-linkedin-box-fill" />
											</a>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-lg-6 mt-4"
								data-aos="zoom-in"
								data-aos-delay={400}
							>
								<div className="member d-flex align-items-start">
									<div className="pic">
										<img
											src="https://onesbenrhaime.github.io/assets/img/team/Salah.png"
											className="img-fluid"
											alt=""
										/>
									</div>
									<div className="member-info">
										<h4>Marabou Salah</h4>
										<span>Elève ingénieur</span>
										<p>Responsable du module Selection des candidats</p>
										<div className="social">
											<a href>
												<i className="ri-twitter-fill" />
											</a>
											<a href>
												<i className="ri-facebook-fill" />
											</a>
											<a href>
												<i className="ri-instagram-fill" />
											</a>
											<a href>
												<i className="ri-linkedin-box-fill" />
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* End Team Section */}
			</main>
		</>
	);
}