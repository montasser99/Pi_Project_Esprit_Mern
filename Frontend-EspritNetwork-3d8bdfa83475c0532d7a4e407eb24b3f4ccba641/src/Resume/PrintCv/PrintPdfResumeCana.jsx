import PropTypes from 'prop-types';
import './PrintPdfResumeCana.css';
import { MdFileDownload, MdLocationOn } from 'react-icons/md';
import { FaEnvelope, FaGithub, FaLinkedin, FaPaintBrush, FaPhoneAlt } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export function PrintPdfResumeCana({ cvData}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [colorcvcana, setColorcana] = useState('#f5f2f2');
  const handleColorChangecana = (newColorcvcana) => {
    setColorcana(newColorcvcana || '#f5f2f2');

  };
  //Font Size 
  const [fontSize, setFontSize] = useState(16); 
  
  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 10 ? prevSize - 1 : prevSize));
  };

  const handlePrintResumecana = () => {
    setIsGenerating(true);
    const options = {
      margin: 0, 
      filename: `${cvData.contact.nom} ${cvData.contact.prenom} Resume Canadien EspritNetwork.pdf`,
      html2canvas: { scale: 2 }, 
    };
    html2pdf().set(options).from(document.getElementById('printable-resumecana')).save();
  
    setIsGenerating(false);
  };
  






  

  return (
  <div className="print-resume-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
    <div className='color-container mb-4 ' >
      <input className="input-style"  type="color" value={colorcvcana} onChange={(e) => handleColorChangecana(e.target.value)}  /><span className="color-label " ><FaPaintBrush className="iconbrush" />Choisissez votre couleur préférée</span>
      <button className="font-size-button increase " onClick={increaseFontSize}>A+</button>
      <button className="font-size-button decrease " onClick={decreaseFontSize}>A-</button>
      <span className="police-label ">Changer la taille de la police </span>
    </div>
    <div className="custom-cv-container-canadian">
      <section className="canadien custom-cv-main-section-canadian" id="printable-resumecana" style={{ fontSize: `${fontSize}px` }}>
        <div className="info-container">
          <div className="info-header">
            <h1 className="full-name-canadian">{cvData.contact?.nom} {cvData.contact?.prenom} </h1><br />
            <h6 className="titre-canadien">{cvData.contact?.titreProfil}</h6>
            <div className="position-canadian">
              <div className="contact-info-canadian">
                <FaEnvelope className="contact-icon-canadian" />
                {cvData.contact?.email} 
              </div>
              <div className="contact-info-canadian">
                <FaPhoneAlt className="contact-icon-canadian" />
                {cvData.contact?.telephone}
              </div>
              <div className="contact-info-canadian">
                <MdLocationOn className="contact-icon-canadian" />
                {cvData.contact?.adresse}
              </div>
              <div className="contact-info-canadian">
                <FaGithub className="contact-icon-canadian" />
                {cvData.contact?.lienGit}
              </div>
              <div className="contact-info-canadian">
                <FaLinkedin className="contact-icon-canadian" />
                {cvData.contact?.lienLinkedIn}
              </div>
            </div>
          </div>
        </div>
        <div className="profile-info-canadian">
          <h2 className="section-title-canadian  mt-4" style={{backgroundColor: colorcvcana }}>Biographie</h2>
          <hr className='hr-canad'/>
          <p className="profile-text-canadian">{cvData.biographie}</p>
        </div>
        <div className="experience-container-canadian">
          <h2 className="section-title-canadian" style={{backgroundColor: colorcvcana }} >Parcours Professionnels</h2>
          <hr className='hr-canad'/>
          <div className="col-11-canadian">
            {cvData.parcoursProfessionnels.map((experience, index) => (
            <div key={index}>
              <div className="experience-canadian">
                <div className="job-date-canadian">
                  <p className="job-title-canadian">{experience.poste}</p>
                  {experience.dateDebut && experience.dateFin ? `${experience.dateDebut.substring(0, 10)} à ${experience.dateFin.substring(0, 10)}` :
                  experience.dateDebut ? `${experience.dateDebut.substring(0, 10)} à présent` :
                  experience.dateFin ? `jusqu'à ${experience.dateFin.substring(0, 10)}` : "Dates non spécifiées"}<br />
                </div>
                <h2 className="company-name-canadian">{experience.entreprise}</h2>
                <p className="experience-description-canadian">{experience.description}</p>
              </div>
                            {index !== cvData.parcoursProfessionnels.length - 1 }
            </div>
            ))}
          </div>
        </div>
        <div className="education-container-canadian">
          <h2 className="section-title-canadian "style={{backgroundColor: colorcvcana }}>Expériences Académiques</h2>
          <hr className='hr-canad'/>
          <div className="col-11-canadian">
            {cvData.parcoursAcademiques.map((experience, index) => (
            <div key={index}>
              <div className="education-canadian">
                <div className="job-date-canadian">
                  <p className="degree-canadian">{experience.diplome}</p>
                  {experience.dateDebut && experience.dateFin ? `${experience.dateDebut.substring(0, 10)} à ${experience.dateFin.substring(0, 10)}` :
                  experience.dateDebut ? `${experience.dateDebut.substring(0, 10)} à présent` :
                  experience.dateFin ? `jusqu'à ${experience.dateFin.substring(0, 10)}` : "Dates non spécifiées"}<br />
                </div>
                <h2 className="school-name-canadian">{experience.etablissement}</h2>
              </div>
              {index !== cvData.parcoursAcademiques.length - 1 && <hr />}
            </div>
            ))}
          </div>
          <div className="skills-container-canadian">
            <h2 className="section-title-canadian" style={{backgroundColor: colorcvcana }}>Compétences</h2>
            <hr className='hr-canad'/>
            <div className="row-canadian row">
              {cvData.competences.map((competence, index) => (
              <div className="col-4-canadian col-md-2" key={index}>
                <p className="cv-section-content-canadian">{competence}</p>
              </div>
              ))}
            </div>
          </div>
          <div className="language-container-canadian">
            <h2 className="section-title-canadian " style={{backgroundColor: colorcvcana }}>Langues</h2>
            <hr className='hr-canad'/>
            <div className="row-canadian row">
              {cvData.langues.map((langue, index) => (
              <div className="col-4-canadian col-md-2" key={index}>
                <p className="cv-section-content-canadian">{langue}</p>
              </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>

    {isHovered && (
    <div className="print-buttonrp-container-fullsize d-flex justify-content-center">
          <button className="print-buttonrp small-button" onClick={handlePrintResumecana} disabled={isGenerating}>
            <MdFileDownload className="mx-2 teleg-icon" />
            {isGenerating ? 'Génération en cours...' : 'Télécharger'}
          </button>
    </div>)}
  </div>
);
}

PrintPdfResumeCana.propTypes = {
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
