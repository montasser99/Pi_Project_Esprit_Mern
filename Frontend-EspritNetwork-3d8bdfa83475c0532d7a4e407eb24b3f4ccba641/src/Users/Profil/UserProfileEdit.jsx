import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../Redux/Actions/userActions";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, Typography } from "@material-ui/core";
import { QRCode } from "react-qr-code";

const UserProfileEdit = () => {
    const [showImageCard, setShowImageCard] = useState(false);
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const [name, setName] = useState(userInfo?.name || "");
    const [email, setEmail] = useState(userInfo?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(userInfo?.pic || ""); // Ajouter un état pour l'image
    const [role, setRole] = useState(userInfo?.role || ""); // Ajouter le rôle dans l'état initial
    const [oldPassword, setOldPassword] = useState("");

    const userData = {
        name: name,
        email: email,
    };
  
    const qrCodeData = JSON.stringify(userData);

    const submitHandler = (e) => {
        e.preventDefault();
        // Vérifier si les mots de passe sont définis et correspondent
        if (password && confirmPassword && password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Passwords do not match!",
            });
        } else {
            dispatch(updateUserProfile({ id: userInfo?._id, name, email, password })).then(
                (response) => {
                    if (response && response.error) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Failed to update profile!",
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: "Profile updated successfully!",
                            timer: 90000 // Fermer automatiquement après 2 secondes
                        });
                    }
                }
            );
        }
    };

    const [isHovered, setIsHovered] = useState(false);
    const handleImageClick = () => {
        setShowImageCard(true);
    };

    const handleCloseCard = () => {
        setShowImageCard(false);
    };

    return (
        <>
            <div className="container-form">
                <div className="img w-100">
                    <img src="https://i.postimg.cc/htzBHD0W/handball-11.png" alt="Profile" />
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <h2>QR Code</h2>
                        <QRCode value={qrCodeData} size={200} style={{ width: "200px", height: "200px" }} />
                    </div>
                </div>
                <div className="login-content">
                    <form className="row form-container" onSubmit={submitHandler}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div>
                                    
                                </div>
                                <h1 className="title" style={{ color: "#cf0000" }}>Changer Votre Mot de Passe</h1>
                            </div>
                        </div>
                       
                        <Card style={{ width: "100%" }}>
                            <CardContent>
                                <div className="input-div pass">
                                    <div className="i">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <div className="div">
                                        <input
                                            type="password"
                                            placeholder="changer password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ color: "#12AC72" }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card style={{ width: "100%" }}>
                            <CardContent>
                                <div className="input-div pass">
                                    <div className="i">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <div className="div">
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            style={{ color: "#12AC72" }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <button
    type="submit"
    className="btn btn-primary"
    style={{
        backgroundColor: "#4A9C7D", // Noir
        color: "#ffffff", // Blanc
        transition: "transform 0.3s ease",
        cursor: "pointer",
        outline: "none",
    }}
    onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
    }}
>
    <FontAwesomeIcon icon={faUserEdit} /> Mettre à jour le profil
</button>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "20px",
                                padding: "20px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <img
                                src={userInfo && userInfo.pic}
                                alt="Profile"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    marginRight: "20px",
                                    border: "2px solid #007bff",
                                    padding: "2px",
                                    cursor: "pointer",
                                }}
                                onClick={handleImageClick}
                            />
                            <div>
                            <p style={{ margin: 0, fontSize: "16px", color: "#495057" }}>
    Dernière connexion :{" "}
    {userInfo && userInfo.previousLogin
        ? new Date(userInfo.previousLogin).toLocaleString()
        : "Never"}<br/>
 
</p>

                            </div>
                        </div>
                        {showImageCard && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <Card style={{ maxWidth: "300px" }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            Profile Image
                                        </Typography>
                                        <img
                                            src={userInfo && userInfo.pic }
                                            alt="Profile"
                                            style={{
                                                width: "100%",
                                                borderRadius: "8px",
                                                marginTop: "10px",
                                            }}
                                        />
                                        <button onClick={handleCloseCard}>Close</button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserProfileEdit;
