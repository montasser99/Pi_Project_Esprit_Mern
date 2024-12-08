import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css"


const Register = () => {
    const [showRoles, setShowRoles] = useState(false);

    const handleButtonClick = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setShowRoles(true);
    };

    return (
        <>
            <div className="wave-container">
                <div className="wave-text">
                    <p>Bienvenue sur notre plateforme d'inscription.</p>
                </div>
            </div>
            <div className="container-form">
                <div className="img">
                    <img
                        src="https://i.postimg.cc/g0VR1ytX/handball-13.png"
                        alt="logo"
                    />
                </div>
                <div className="login-content">
                    <form>
                        <div className="button-options">
                            {/* Ajouter preventDefault() ici */}
                            <button className="bttn" onClick={handleButtonClick}>Créez votre compte</button>
                        </div>
                        {showRoles && (
                            <div className="role-cards">
                                <div className="role-group">
                                    <Link to="/RegisterStudent" className="role-card student">
                                        <div className="card-content">
                                            <h3>Étudiant</h3>
                                            <p>Inscrivez-vous en tant qu'étudiant.</p>
                                        </div>
                                    </Link>
                                    <Link to="/RegisterComapany" className="role-card company">
                                        <div className="card-content">
                                            <h3>Entreprise</h3>
                                            <p>Inscrivez votre entreprise.</p>
                                        </div>
                                    </Link>
                                    <Link to="/RegisterAlumni" className="role-card alumni">
                                        <div className="card-content">
                                            <h3>Ancien Élève</h3>
                                            <p>Rejoignez notre réseau d'anciens élèves.</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="role-group">
                                    <Link to="/RegisterEspr" className="role-card esprit-staff">
                                        <div className="card-content">
                                            <h3>Personnel Esprit</h3>
                                            <p>Personnel d'Esprit.</p>
                                        </div>
                                    </Link>
                                    <Link to="/RegisterTeacherr" className="role-card teacher">
                                        <div className="card-content">
                                            <h3>Enseignant</h3>
                                            <p>Inscrivez-vous en tant qu'enseignant.</p>
                                        </div>
                                    </Link>
                                    {/* Ajouter d'autres rôles ici si nécessaire */}
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
