import { Link } from "react-router-dom";

const AccesDenied = () => {
	return (
		<>
			<div className="container-form">
				<div className="img">
					<img
						src="https://i.postimg.cc/BZNnRd5X/the-Team-2.png"
						alt="Not found"
					/>
				</div>
				<div className="login-content">
					<h2 className="title">
					Access Denied 						<Link to="/">
							<input type="submit" className="bttn" value="Go Home" />
						</Link>
					</h2>
				</div>
			</div>
		</>
	);
};

export default AccesDenied;
