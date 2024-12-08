import { useSelector } from "react-redux";
import "./Filaccu.css";

export default function Leftsidebar() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;





  return (
    <>
      <div className="col-md-3 ">
        <div className="card-acculeft">
          <div className="card-body ">
<div className="d-flex flex">

<img
              src={userInfo && userInfo.pic}
              alt="Profile"
              style={{
                width: "70px", // Set the width
                height: "70px", // Set the height
                borderRadius: "50%", // Make it circular
                marginRight: "0", 
                marginLeft:"12px"
                
                // Add margin to separate from the logout button
              }}
            />

            <div className="h4 mx-2 mt-3">@ {userInfo.name}</div>

</div>
           
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <div className="h6 text-muted">Email</div>
              <div className="h5">{userInfo.email}</div>
            </li>
            <li className="list-group-item">
              <div className="h6 text-muted">Adresse</div>
              <div className="h5">Tunis</div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
