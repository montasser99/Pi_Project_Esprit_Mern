import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../../LoadingError/Error";
import Loading from "../../LoadingError/Loading";
import { register } from "../../Redux/Actions/userActions";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { RiLoginCircleLine } from "react-icons/ri";


const RegisterCompany = ({ location, history }) => {
	window.scrollTo(0, 0);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setCPassword] = useState("");
	const [adresseC, setAdresseC] = useState("");

	const dispatch = useDispatch();
	const redirect =
		location && location.search ? location.search.split("=")[1] : "/";

	const userRegister = useSelector((state) => state.userRegister);
	const { error, loading, success } = userRegister;
	const [pic, setPic] = useState(null);

    const handlePicChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const imageData = reader.result;
            setPic(imageData);
        };

        reader.readAsDataURL(file);
    };

	


	const submitHandler = (e) => {
		e.preventDefault();
		// Vérifier si tous les champs sont remplis
		if (!name || !email || !password || !confirmPassword || !pic)  {
			// Utilisation de SweetAlert pour afficher un message d'erreur
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Veuillez remplir tous les champs!',
			});
			return; // Arrêter le traitement
		}
		// Appeler la fonction de dispatch seulement si tous les champs sont remplis
		dispatch(register(name, email, adresseC,  password, confirmPassword , pic));
	};
	
	return (
		<>
			<div className="container-form">
				<div className="img w-100">
					<img src="https://i.postimg.cc/R0YKQGrt/handball-16.png" />
				</div>
				<div className="login-content">
					<form onSubmit={submitHandler}>
					<h1 className="title" style={{ color: '#cf0000', fontSize: '24px' }}>
					Creer votre compte  <br></br> <FontAwesomeIcon icon={faUser} /> Company
                        </h1>						{error && <Message variant="alert-danger">{error}</Message>}
						{success && (
        Swal.fire({
            title: 'Success!',
            text: ' veulliez attendre La comfirmation de votre compte ',
            imageUrl: 'https://i.postimg.cc/8chrbRgv/undraw-Mobile-payments-re-7udl.png',
            imageAlt: 'Success Image',
            confirmButtonText: 'OK',
           
        })
    )}{" "}
						{loading && <Loading />}
						<div className="input-div one">
							<div className="i">
								<i className="fas fa-envelope"></i>
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
								<i className="fas fa-user"></i>
							</div>
							<div className="div">
								<input
									type="text"
									placeholder="Votre nom"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						</div>
						<div className="input-div pass">
							<div className="i">
							<i class="fas fa-map-marker-alt"></i>
							</div>
							<div className="div">
								<input
									type="text"
									placeholder=" Votre adresse"
									value={adresseC}
									onChange={(e) => setAdresseC(e.target.value)}
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
									placeholder=" Votre mot de passe "
									value={password}
									onChange={(e) => setPassword(e.target.value)}
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
									placeholder="Confirmer  le mot de passe "
									value={confirmPassword}
									onChange={(e) => setCPassword(e.target.value)}
								/>
							</div>
						</div>
						<div className="input-div pass">
                            <div className="i">
                                <i className="fas fa-image"></i>
                            </div>
                            <div className="div">
                                <input
                                    type="file"
                                    placeholder="Choose your image"
                                    className="form-control"
                                    id="image"
                                    accept="image/*"
                                    onChange={handlePicChange}
                                />
                            </div>
                        </div>
                        <div className="profile-pic-container">
                            {pic && <img src={pic} alt="Profile" className="profile-pic" />}
                        </div>
						
						<input type="submit" className="bttn" value="S'Inscrire" />
						<Link
  to={redirect ? `/login?redirect=${redirect}` : "/login"}
  style={{
    display: "inline-block",
    padding: "10px 20px",
    color: "#000",
    textDecoration: "none",
    borderRadius: "5px",
    border: "2px solid #000",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#000";
    e.target.style.color = "#fff";
    e.target.style.borderColor = "#000";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#000";
    e.target.style.borderColor = "#000";
  }}
>
  <RiLoginCircleLine size={20} style={{ marginRight: "8px" }} />
  Connectez-vous à votre compte
</Link>

					</form>
				</div>
			</div>
		</>
	);
};

export default RegisterCompany;
