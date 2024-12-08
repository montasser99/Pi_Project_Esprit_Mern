import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import "./Filaccu.css";import Rightsidebar   from "./Rightsidebar";
import Affichepub from "./affichepub";


export default function Maincontent() {

  const [events, setEvents] = useState([]);

  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [title, setTitle] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [date, setDate] = useState('');
  const [role, setRole] = useState('');


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setRole(user.role);
      console.log('user role ',user.role)
    }
  }, []);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleOrganizerChange = (event) => {
    setOrganizer(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      setImagePreview(e.target.result);
      const imageDataUrl = `data:image/jpeg;base64,${e.target.result.split(",")[1]}`;
      setImageBase64(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };
  

  useEffect(() => {
    axios.get('http://localhost:3000/evenement/getEvent')
      .then(response => {
        setEvents(response.data); 
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des événements :', error);
      });
  }, []); 
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/evenement/createevenement', {
        title,
        description,
        location,
        organizer,
        imageBase64,
        date, 

      });
      console.log('Événement publié avec succès :', response.data);
      toast.success("Événement publié avec succès", { autoClose: 3000 });
    } catch (error) {
      console.error('Erreur lors de la publication de l\'événement :', error);
      toast.error("Erreur lors de la publication de l'événement");
    }
  };
  return (
    <>
    <div className="section-title" style={{marginTop:"120px "}}>
						<h2 className="text-black">Evenement</h2>

					</div>
      {(role === 'admin' || role === 'company' || role === 'alumni' || role === 'teacher') && (

      <div className="col-md-6 gedf-main" >
        <div className="card gedf-cardd ">
          <div className="card-header">

            <ul
              className="nav nav-tabs card-header-tabs"
              id="myTab"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="posts-tab"
                  data-toggle="tab"
                  href="#posts"
                  role="tab"
                  aria-controls="posts"
                  aria-selected="true"
                >
                  <strong className="text-danger ">Publier Un Evenement </strong>
                </a>
              </li>
             
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="w-100">
          <div className="card-body">
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="posts"
                role="tabpanel"
                aria-labelledby="posts-tab"
              >
               <div className="row">
                <div className="form-group col-md-6">
                   <label htmlFor="title"><strong>Titre de l&apos;événement</strong></label>
                  <input type="text" className="form-control" id="title" required value={title} onChange={handleTitleChange} />
               </div>
               <div className="form-group col-md-6">
                  <label htmlFor="organizer"><strong>Organisateur de l&apos;événement</strong></label>
                    <input type="text" className="form-control" id="organizer" value={organizer} onChange={handleOrganizerChange} />
                </div>
              </div>
                <div className="form-group mt-2">
                  <label htmlFor="description"><strong>Description de l&apos;événement</strong></label>
                  <textarea className="form-control" id="description" rows={5} required value={description} onChange={handleDescriptionChange} />
                </div>

                <div className="form-group mt-2">
                  <label htmlFor="location"><strong>Lieu de l&apos;événement</strong></label>
                   <input type="text" className="form-control" id="location" value={location} onChange={handleLocationChange} />
                </div>

                <div className="form-group mt-2">
                   <label htmlFor="image"><strong>Image de l&apos;événement</strong></label>
                  <input type="file" className="form-control" id="image" accept="image/*" onChange={handleImageChange} />
                  {imagePreview &&
                  <div className="text-center mx-auto">
                   < img src={imagePreview} alt="Aperçu de l'image" style={{ maxWidth: '400px', marginTop: '10px' }} />
                   </div>
                    }
                </div>
              </div>
            </div>

            <div className="btn-toolbar justify-content-end mt-2">
              <div className="btn-group">
                <button type="submit" className="btn btn-danger">
                  Publier
                </button>
              </div>
            </div>
          </div>
          </form>
          <div><Toaster /></div>
        </div>
      </div>
)}
        <Rightsidebar />									
      <div className="fedd" style={{ marginTop: role === 'student' ? '700px' : '250px' }}>
  {events.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(event => (
    <Affichepub key={event._id} event={event} />
  ))}
</div>  
    </>
  );
}
