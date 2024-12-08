import { useState } from "react";
import axios from "axios";
import Message from "../../LoadingError/Error"; // Assurez-vous que le chemin d'importation est correct

const ForgetPassword = () => {
	const [email, setEmail] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `http://localhost:3000/api/users/password-reset`;
			const { data } = await axios.post(url, { email });
			setMsg(data.message); // Mettre à jour l'état msg avec le message de succès
			setError(""); // Effacer toute erreur précédente
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message); // Mettre à jour l'état error avec le message d'erreur
				setMsg(""); // Effacer tout message de succès précédent
			}
		}
	};

	return (
		<>
			<div className="container-form">
				<div className="img">
					<img
						src="https://i.postimg.cc/Z52KJP8y/ESperance-MEDIA-6.png"
						alt="Forgot password"
					/>
				</div>
				<div className="login-content">
					<form onSubmit={handleSubmit}>
					<h2 className="title" style={{ display: "inline" }}>Mot de passe oublié</h2>






{error && <Message variant="alert-danger">{error}</Message>}
						{msg && <Message variant="alert-success">{msg}</Message>}
						<div className="input-div pass">
							<div className="i">
								<i className="fas fa-lock"></i>
							</div>
							<div className="div">
								<input
									type="email"
									placeholder="Email"
									className="input"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						<input type="submit" className="bttn" value="Envoyer" />
					</form>
				</div>
			</div>
		</>
	);
};

export default ForgetPassword;
