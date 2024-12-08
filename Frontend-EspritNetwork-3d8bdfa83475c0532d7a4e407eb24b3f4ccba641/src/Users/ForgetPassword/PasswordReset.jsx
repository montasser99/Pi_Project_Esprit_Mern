import { useEffect, useState, Fragment, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Message from "../../LoadingError/Error";

export const PasswordReset = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    function useQuery() {
        const { search } = useLocation();
        return useMemo(() => new URLSearchParams(search), [search]);
    }

    const params = useParams();
    const url = `http://localhost:3000/api/users/password-reset/${params.token}`;

    useEffect(() => {
        const verifyUrl = async () => {
            try {
                // await axios.get(url);
                setValidUrl(true);
            } catch (error) {
                setValidUrl(false);
            }
        };
        verifyUrl();
    }, [params, url]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier si les mots de passe correspondent
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        // Vérifier si le mot de passe respecte les critères
        if (!validatePassword(password)) {
            setError("Le mot de passe doit contenir au moins huit caractères, au moins un chiffre, une lettre majuscule, une lettre minuscule et un caractère spécial");
            return;
        }

        try {
            const { data } = await axios.post(url, { password });
            setMsg(data.message);
            setError("");
            window.location = "/login";
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
                setMsg("");
            }
        }
    };

    const validatePassword = (password) => {
        const patt = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        return patt.test(password);
    };

    return (
        <Fragment>
            {validUrl ? (
                <>
                    <div className="container-form">
                        <div className="img">
                            <img src="https://i.postimg.cc/mgfBqZBQ/ESperance-MEDIA-7.png" />
                        </div>
                        <div className="login-content">
                            <form onSubmit={handleSubmit}>
                                <h2 className="title" style={{ textAlign: "center" }}>RÉINITIALISER VOTRE MOT DE PASSE</h2>

								{error && <Message variant="alert-danger">{error}</Message>}


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

                                <div className="input-div pass">
                                    <div className="i">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <div className="div">
                                        <input
                                            type="password"
                                            placeholder="Confirmer le mot de passe"
                                            className="input"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <input type="submit" className="bttn" value="Envoyer" />
                            </form>
                        </div>
                    </div>
                </>
            ) : (
                <h1>404 Not Found</h1>
            )}
        </Fragment>
    );
};

export default PasswordReset;
