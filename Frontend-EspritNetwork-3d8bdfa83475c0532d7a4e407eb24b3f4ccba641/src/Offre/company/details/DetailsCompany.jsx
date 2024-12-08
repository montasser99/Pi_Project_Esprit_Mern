import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BiMap } from 'react-icons/bi';
import "../../DetailsMesOffres.css";
import espritNetwork from "../../../assets/logo-network.png";
const DetailsCompany = () => {
    const [offre, setOffre] = useState({});
    const [adresseC, setAdresseC] = useState("");
    const { idoffre } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/offre/getbyId/${idoffre}`
                );

                setOffre(response.data);
                
                setAdresseC(response.data.user.adresseC)
            } catch (error) {
                console.error("Error fetching offre data:", error);
            }
        };

        fetchData();
    }, [idoffre]);

    const formatDateDifference = (date) => {
        const currentDate = new Date();
        const postDate = new Date(date);
        const timeDifference = currentDate - postDate;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `Il'y a ${days}  ${days === 1 ? "jour" : "jours"}`;
        } else if (hours > 0) {
            return `Il'y a ${hours} ${hours === 1 ? "heure" : "heures"} `;
        } else if (minutes > 0) {
            return `Il'y a ${minutes} ${minutes === 1 ? "minute" : "minutes"} `;
        } else {
            return "Maintenant";
        }
    };
    const formatExpirationDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('tn-TN', options);
        return formattedDate;
    };

    return (
        <div className="design">
            <section id="services" className="section py-5" data-aos="fade-up">
                <div className="details-container details-container11 py-5 ">
                    <div className="section-title py-5">
                        <h2 className="text-black">Analyse détaillée de mon offre</h2>
                    </div>
                    <div className="card carddd position-relative">
                        <div className="card-title text-white p-2" style={{ backgroundColor: "#000", position: "absolute", top: -40, left: 0, right: 0 }}>
                            Informations sur l'offre
                        </div>
                        <div className="d-flex flex-column flex-md-row align-items-start" style={{ marginTop: "40px" }}>

                            {offre.user && offre.user.pic ? (
                                <img
                                    src={offre.user.pic}
                                    className="card-img-top rounded-top "
                                    style={{
                                        width: "20%",
                                        display: "block",
                                        borderRadius: "10px 10px 0 0",
                                    }}
                                />
                            ) : (
                                <img
                                    src={espritNetwork} 
                                    alt="Image de société"
                                    className="img-fluid"
                                    style={{ maxWidth: "200px" }}
                                />
                            )}

                            <div className="ms-3 row w-100 ">
                                <div className="col-md-6 mb-3">
                                    <div>
                                        <h2>{offre?.titre}</h2>
                                    </div>
                                    <div>
                                        {adresseC ? (
                                            <>
                                                <BiMap size={20} />
                                                {adresseC}
                                            </>
                                        ) : (
                                            <p>L'adresse n'existe pas.</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="bg-green">
                                            <i className="bi bi-clock ms-1"></i>{" "}
                                            {formatDateDifference(offre.created_at)}</p>
                                    </div>
                                    <div className="competence-container">
                                        <h5>Compétence:</h5>
                                        <div className="competence-list">
                                            {offre?.competence?.split(',').map((comp, index) => (
                                                <div key={index} className="competence-item">
                                                    {comp.trim()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-md-1">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div>
                                                <h5>Type de contrat</h5>
                                                <p>{offre?.typecontrat}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div>
                                                <h5>Salaire</h5>
                                                {offre?.salaire ? (
                                                    <p>{offre.salaire} dt</p>
                                                ) : (
                                                    <p>Non spécifié</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div>
                                                <h5>Langue</h5>
                                                {offre?.langue ? (
                                                    <p>{offre?.langue}</p>
                                                ) : (
                                                    <p>Non spécifié</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div>
                                                <h5>Expérience</h5>
                                                {offre?.experience ? (
                                                    <p>{offre.experience} ans</p>
                                                ) : (
                                                    <p>Non spécifié</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-7">
                                            <div>
                                                <h5>Date d'expiration : </h5>
                                                <p className="ml-2">
                                                    {offre.dateExpiration ? (
                                                        formatExpirationDate(offre.dateExpiration)
                                                    ) : (
                                                        "Non spécifié"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <hr className="mt-3" style={{ backgroundColor: "gray", height: "1px", border: "none" }} />

                                <div className="col-12 mt-3">
                                    <h5>Description</h5>
                                    <p>{offre?.description} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DetailsCompany;
