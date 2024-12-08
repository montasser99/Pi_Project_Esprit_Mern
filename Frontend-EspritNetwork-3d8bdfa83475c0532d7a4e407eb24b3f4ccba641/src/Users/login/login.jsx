import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { login } from "../../Redux/Actions/userActions";
import Message from "../../LoadingError/Error";
import Loading from "../../LoadingError/Loading";
import "./LoginPage.css";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

export const Login = () => {
	let [searchParams] = useSearchParams();
	const [email, setEmail] = useState(searchParams.get("email") || "");
	const name = searchParams.get("name");
	const secret = searchParams.get("secret");

	const [password, setPassword] = useState("");
	const [captchaValidated, setCaptchaValidated] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const redirect = window.location.search
		? window.location.search.split("=")[1]
		: "/";

	const userLogin = useSelector((state) => state.userLogin);
	const { error, loading, userInfo } = userLogin;

	useEffect(() => {
		if (userInfo && !error) {
			navigate(redirect);
		}
	}, [userInfo, error, navigate, redirect]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (!email || !password) {
			// Utilisation de SweetAlert2 pour afficher un message d'erreur si les champs sont vides
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Veuillez remplir tous les champs.',
			});
			return;
		}
		if (captchaValidated) {
			dispatch(login(email, password));
		} else {
			// Utilisation de SweetAlert2 pour afficher un message d'erreur
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Veuillez valider le captcha.',
			});
		}
	};
	const redirectToGoogleAuth = () => {
		window.location.href = "http://localhost:3000/auth/google";
	};

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const email = queryParams.get("email");
		const name = queryParams.get("name");
		const secret = queryParams.get("secret");
		if (email && name && secret) {
			localStorage.setItem("user", JSON.stringify({ email, name, secret }));
		}
	}, [email, name, secret]);

	function onChange(value) {
		console.log("Captcha value:", value);
		setCaptchaValidated(true);
	}

	return (
		<>
			<div className="wave" alt="wave"></div>
			<div className="container-form">
				<div className="img">
					<img
						src="https://i.postimg.cc/9QH7zNTB/undraw-two-factor-authentication-namy.png"
						alt="logo"
					/>
				</div>
				<div className="login-content">
					<form onSubmit={submitHandler}>
						<h2 className="title">Bienvenue</h2>
						{error && <Message variant="alert-danger">{error}</Message>}
						{loading && <Loading />}
						<div className="input-div one">
							<div className="i">
								<i className="fas fa-user"></i>
							</div>
							<div className="div">
								<input
									type="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
								<i className="fas fa-lock"></i>
							</div>
							<div className="div">
								<input
									type="password"
									placeholder="Mot de passe"
									className="input"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<ReCAPTCHA
							sitekey="6LcF_4opAAAAABC5dxW3EiH2FobRpLOUkYD2hvwS"
							onChange={onChange}
						/>
						<input type="submit" className="bttn" value="Connexion" />
						<Button
							leftIcon={
								<img
									src="https://i.postimg.cc/fLNq3jdv/icons8-logo-google-240.png"
									alt="Google Icon"
									style={{ width: "24px", height: "24px" }}
								/>
							}
							onClick={redirectToGoogleAuth}
							bg="#F7F7F7"
							className="btn btn-outline-secondary"
						>
Connexion avec Google						</Button>
						<br />
						<br />
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<NavLink
								to={redirect ? `/index?redirect=${redirect}` : "/index"}
								style={{
									textDecoration: "none",
									color: "#000",
									transition: "color 0.3s ease",
									fontWeight: "bold",
									display: "inline-block",
									width: "150px",
									height: "40px",
									lineHeight: "40px",
									borderRadius: "5px",
									textAlign: "center",
									background: "#F7F7F7",
								}}
							>
								Mot de passe oublié
							</NavLink>
							<Link
								to={redirect ? `/register?redirect=${redirect}` : "/register"}
								style={{
									textDecoration: "none",
									color: "#000",
									transition: "color 0.3s ease",
									fontWeight: "bold",
									display: "inline-block",
									width: "150px",
									height: "40px",
									lineHeight: "40px",
									borderRadius: "5px",
									textAlign: "center",
									background: "#F7F7F7",
								}}
							>
Créer un compte							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;
