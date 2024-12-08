import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import "../Selection.css";


export function Edit(){
  const [titleError, setTitleError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);

    const [collection, setCollection] = useState(null);
    const navigate = useNavigate();

	const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const { id } = useParams();
    useEffect(() => {
        const fetchCollection = async () => {
          try {
            const response = await axios.get(
              `http://localhost:3000/collection/getbyid/${id}`
            );
            setCollection(response.data);
            setTitre(response.data.titre);
            setDescription(response.data.description);
            setImage(response.data.image)
          } catch (error) {
            console.error("Error fetching collection:", error);
          }
        };
    
        fetchCollection();
      }, [id]);


      const handleTitleChange = (event) => {
        setTitre(event.target.value);
        setTitleError("");
      };
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const imageData = reader.result; 
          setImage(imageData);
        };
        
        reader.readAsDataURL(file);
        };

    
      const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        setDescriptionError("");

      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (!titre || !description ) {
          if (!titre) setTitleError(true);
          if (!description) setDescriptionError(true);
          
          return;
        }
        
    
        try {
          await axios.put(`http://localhost:3000/collection/update/${id}`, {
            titre,
            description,
            image,
          });
    
          console.log("Collection updated successfully");
          toast.success('modifié avec succès!');
          navigate("/short");
          // Perform any necessary actions after updating the collection
    
        } catch (error) {
          console.error("Error updating collection:", error);
        }
      };
    
      if (!collection) {
        return <div>Loading collection...</div>;
      }
    
     
        
        
        return (
    <>
      <section
      id="contact"
      className="contact py-5 align-items-start"
      style={{ marginTop: "0px" }}
    >
        <div className="title">
          <h2>Modifier collection</h2>
        </div>

        <div className="row justify-content-center">
        <div className="col-md-9">
          <form className="form-ajout" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Titre:
              </label>
              <input
                type="text"
                className={`form-control ${titleError ? 'is-invalid' : ''}`}
                id="title"
                value={titre}
                onChange={handleTitleChange}
              />
              {titleError && <div className="invalid-feedback">Le titre est requis.</div>}
              
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Description:
              </label>
              <textarea
                className={`form-control ${descriptionError ? 'is-invalid' : ''}`}
                id="content"
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
              {descriptionError && <div className="invalid-feedback">La description est requise.</div>}
              
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image:
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              
            </div>

            <div className="mb-3">
              <button className="btn btn-dark" onClick={handleSubmit}>
                Enregistrer
              </button>
            </div>
          </form>
        </div>
        </div>
      </section>
    </>
  );
}