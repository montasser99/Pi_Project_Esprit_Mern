import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<>
			<div className="container-form">
				<div className="img">
					<img
						src="https://i.postimg.cc/sDSXBrqn/ESperance-MEDIA-4.png"
						alt="Not found"
					/>
				</div>
				<div className="login-content">
					<h2 className="title">
						Not Found
						<Link to="/">
							<input type="submit" className="bttn" value="Go Home" />
						</Link>
					</h2>
				</div>
			</div>
		</>
	);
};

export default NotFound;
