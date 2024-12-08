import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import "./Filaccu.css";

export default function Rightsidebar() {
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    fetchEventCount();
  }, []);

  const fetchEventCount = async () => {
    try {
      const response = await axios.get("http://localhost:3000/evenement/count"); 
      setEventCount(response.data.count);
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre d'événements:", error);
    }
  };

  return (
    <>
      <div className="col-md-3 ">
        <div className="card gedf-card">
        <div className="card-body d-flex flex-column align-items-center">
          <p className="title-cardcount">
              Evenement
            </p>
            <h5 className="coutevenement text-danger">{eventCount}</h5>
            <p className="title-cardright ">
              Postes Sur Esprit Network
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
