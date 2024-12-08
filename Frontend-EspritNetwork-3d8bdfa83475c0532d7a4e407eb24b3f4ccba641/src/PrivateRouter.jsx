import PropTypes from "prop-types";
import { Navigate , Route  } from "react-router-dom";

function PrivateRouter({ children, allowedRoles }) {
  // Récupérer le token depuis le stockage local
  const token = window.localStorage.getItem("userInfo");

  // Si le token n'est pas défini ou s'il est vide, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Extraire le rôle du token
  const userRole = JSON.parse(token).role;

  // Si le rôle de l'utilisateur n'est pas autorisé, rediriger vers la page d'erreur d'autorisation
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Si l'utilisateur est authentifié et a le bon rôle, rendre les enfants
  return children;
}

PrivateRouter.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRouter;
