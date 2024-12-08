import "./Filaccu.css";
 import espritNetwork from "../assets/defauttt.jpg";

export default function Affichepub({ event }) {

  
  return (
    <>
     <div className="card gedf-cardcentre">
       <div className="hederfeed ">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-date"><i className="fa fa-clock-o"></i> {event.date.substring(0, 10)}</p>
        </div>
        <p className="event-description">{event.description}</p>
        <p className="event-location">{event.location}</p>
        <p className="event-organizer"> {event.organizer}</p>
        {event.imageBase64 ? (
    <img src={event.imageBase64} className="event-image" />
  ) : (
    <img src={espritNetwork} alt="Logo Esprit Network" className="event-image" />
  )}
      <div>
    </div>


</div>

    </>
  );
}
