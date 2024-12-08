import { useState } from "react";
import { Link } from "react-router-dom";
import ContactForm from "./ContactForm";
import BiographieForm from "./BiographieForm";
import ParcoursProForm from "./ParcoursProForm";
import ParcoursAcaForm from "./ParcoursAcaForm";
import CompetencesForm from "./CompetencesForm";
import LanguesForm from "./LanguesForm";
import './ModifierResume.css'; 
import { Toaster } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const ModifierResume = () => {
    const [activeForm, setActiveForm] = useState(null);

    const handleFormClick = (formName) => {
        setActiveForm(formName);
    };

    return (
        <div>
            <div className="section-title black-text" data-aos="fade-up">
                <div className="d-flex align-items-center justify-content-between ">
                    <Link to="/resume" className="btn btn-retourcv"> <FaArrowLeft className="retour-icon" /> Retour</Link>
                    <h2 className="black-text " >Modifier Votre CV</h2>
                    <div><Toaster /></div>
                </div>
            </div>

            <div className="container" style={{ marginTop: "-20px" }} data-aos="fade-up">
                <div className="card shadow mb-5">
                    <div className="card-body link d-flex flex-wrap  justify-content-evenly  col-lg-12  ">
                        <Link to="/resume/modifiercv/contact" className={`lienupdate ${activeForm === 'contact' ? 'active' : ''}`} onClick={() => handleFormClick('contact')}>
                            CONTACT
                        </Link>
                        <Link to="/resume/modifiercv/biographie" className={`lienupdate ${activeForm === 'biographie' ? 'active' : ''}`} onClick={() => handleFormClick('biographie')}>
                            BIOGRAPHIE
                        </Link>
                        <Link to="/resume/modifiercv/parcourspro" className={`lienupdate ${activeForm === 'parcoursPro' ? 'active' : ''}`} onClick={() => handleFormClick('parcoursPro')}>
                            PARCOURS PROFESSIONNELS
                        </Link>
                        <Link to="/resume/modifiercv/parcoursacad" className={`lienupdate ${activeForm === 'parcoursAca' ? 'active' : ''}`} onClick={() => handleFormClick('parcoursAca')}>
                            PARCOURS ACADÉMIQUES
                        </Link>
                        <Link to="/resume/modifiercv/competences" className={`lienupdate ${activeForm === 'competences' ? 'active' : ''}`} onClick={() => handleFormClick('competences')}>
                            COMPÉTENCES
                        </Link>
                        <Link to="/resume/modifiercv/langues" className={`lienupdate ${activeForm === 'langues' ? 'active' : ''}`} onClick={() => handleFormClick('langues')}>
                            LANGUES
                        </Link>
                    </div>
                </div>
            </div>
            {activeForm === 'contact' && <ContactForm />}
            {activeForm === 'biographie' && <BiographieForm />}
            {activeForm === 'parcoursPro' && <ParcoursProForm />}
            {activeForm === 'parcoursAca' && <ParcoursAcaForm />}
            {activeForm === 'competences' && <CompetencesForm />}
            {activeForm === 'langues' && <LanguesForm />}
        </div>
         
        
    );
};

export default ModifierResume;