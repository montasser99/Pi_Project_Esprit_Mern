import PropTypes from 'prop-types';
import './PrintResume.css';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import { MdFileDownload, MdLocationOn} from 'react-icons/md';
import { FaEnvelope, FaGithub, FaLinkedin, FaPaintBrush, FaPhoneAlt } from 'react-icons/fa';

export function PrintPdfResume({ cvData }) {
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [colorcv, setColor] = useState('#f5f2f2');
  const handleColorChange = (newColorcv) => {
    setColor(newColorcv || '#f5f2f2');
  };

  const handlePrintResume = () => {
    setIsGenerating(true);
    const options = {
      margin: 0, 
      filename: `${cvData.contact.nom} ${cvData.contact.prenom} Resume EspritNetwork.pdf`,
      html2canvas: { scale: 2 }, 
    };
    html2pdf().set(options).from(document.getElementById('printable-resume')).save();
  
    setIsGenerating(false);
  };


  return (
    <div className="print-resume-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='color-container mb-4 ' >
        <input className="input-style"  type="color" value={colorcv} onChange={(e) => handleColorChange(e.target.value)}  /><span className="color-label " ><FaPaintBrush className="iconbrush" />Choisissez votre couleur préférée</span>
      </div>
      <section className="main-section printcvcontainer" id="printable-resume">
        <div className="left-part" style={{backgroundColor: colorcv }}>
          <div className="picpr-container">
            <img src={cvData.contact.imageResume} className="rounded-imgrp img-fluid"  /> 
          </div>

          <div className="contact-container">
            <h2 className="title">Contact</h2>
            <div className="contact-list">
            <FaEnvelope className="contact-icon " />
              <div className="contact-text">
                {cvData.contact?.email}<br />
              </div>
            </div>

            <div className="contact-list">
            <FaPhoneAlt className="contact-icon " />
              <div className="contact-text">
                {cvData.contact?.telephone }<br />
              </div>
            </div>

            <div className="contact-list">
            <MdLocationOn className="contact-icon " />
              <div className="contact-text">
                {cvData.contact?.adresse }<br />
              </div>
            </div>

            <div className="contact-list">
            <FaGithub className="contact-icon " />
              <div className="contact-text">
                {cvData.contact?.lienGit}<br />
              </div>
            </div>

            <div className="contact-list">
            <FaLinkedin className="contact-icon " />
              <div className="contact-text">
                {cvData.contact?.lienLinkedIn}<br />
              </div>
            </div>
          </div>

          <div className="competence-container">
            <h2 className="title">COMPETENCES</h2>
            <div className="row">
                {cvData.competences.map((competence, index) => (
                  <div className="col-4" key={index}>
                    <p className="cv-section-content">{competence}</p>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="langue-container">
            <h2 className="title">langue</h2>
            <div className="col">
              {cvData.langues.map((langue, index) => (
                <div className="col-5 mb-2" key={index}>
                  <li className="cv-section-content">{langue}</li>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-part">
          <div className="banner">
            <h1 className="firstname">{cvData.contact?.nom } {cvData.contact?.prenom }</h1>
            <p className="position">{cvData.contact?.titreProfil}</p>
          </div>
          <div className="profil ">
            <p className="profil-text">{cvData.biographie}</p>
          </div>

          <div className="pro-container ">
            <h2 className="title text-left">PARCOURS PROFESSIONNELS</h2>
            <div className="col-11">
              {cvData.parcoursProfessionnels.map((experience, index) => (
                <div key={index}>
                  <div className="pro">
                    <div className="job-date">
                      <p className="job">{experience.poste}</p>
                      {experience.dateDebut && experience.dateFin ? `${experience.dateDebut.substring(0,10)} jusqu'à ${experience.dateFin.substring(0,10)}` :
                      experience.dateDebut ? `${experience.dateDebut.substring(0,10)} jusqu'à présent` :
                      experience.dateFin ? `jusqu'à ${experience.dateFin.substring(0,10)}` : "Dates non spécifiées"}<br />
                    </div>
                    <h2 className="company-name">{experience.entreprise}</h2>
                    <p className="pro-text">{experience.description}</p>
                  </div>
                  {index !== cvData.parcoursProfessionnels.length - 1 && <hr />}
                </div>
              ))}
            </div>
          </div>

          <div className="acad-container ">
            <h2 className="title text-left">EXPÉRIENCES ACADÉMIQUES</h2>
            <div className="col-11">
              {cvData.parcoursAcademiques.map((experience, index) => (            
                <div key={index}>
                  <div className="acad">
                    <div className="job-date">
                      <p className="job">{experience.diplome}</p>
                      {experience.dateDebut && experience.dateFin ? `${experience.dateDebut.substring(0,10)} jusqu'à ${experience.dateFin.substring(0,10)}` :
                      experience.dateDebut ? `${experience.dateDebut.substring(0,10)} jusqu'à présent` :
                      experience.dateFin ? `jusqu'à ${experience.dateFin.substring(0,10)}` : "Dates non spécifiées"}<br />
                    </div>
                    <h2 className="company-name">{experience.etablissement}</h2>
                  </div>
                  {index !== cvData.parcoursAcademiques.length - 1 && <hr />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {isHovered && (
        <div className="print-buttonrp-container-fullsize d-flex justify-content-center">
          <button className="print-buttonrp small-button" onClick={handlePrintResume} disabled={isGenerating}>
            <MdFileDownload className="mx-2 teleg-icon" />
            {isGenerating ? 'Génération en cours...' : 'Télécharger'}
          </button>
        </div>
      )}
    </div>
  );
}

PrintPdfResume.propTypes = {
  cvData: PropTypes.shape({
    contact: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      prenom: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      telephone: PropTypes.string.isRequired,
      adresse: PropTypes.string.isRequired,
      lienGit: PropTypes.string.isRequired,
      lienLinkedIn: PropTypes.string.isRequired,
      titreProfil: PropTypes.string.isRequired,
      imageResume: PropTypes.string.isRequired,
    }).isRequired,
    biographie: PropTypes.string,
    parcoursProfessionnels: PropTypes.arrayOf(
      PropTypes.shape({
        poste: PropTypes.string.isRequired,
        entreprise: PropTypes.string.isRequired,
        dateDebut: PropTypes.string,
        dateFin: PropTypes.string,
        description: PropTypes.string,
      })
    ).isRequired,
    parcoursAcademiques: PropTypes.arrayOf(
      PropTypes.shape({
        diplome: PropTypes.string.isRequired,
        etablissement: PropTypes.string.isRequired,
        dateDebut: PropTypes.string,
        dateFin: PropTypes.string,
      })
    ).isRequired,
    competences: PropTypes.arrayOf(PropTypes.string).isRequired,
    langues: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};