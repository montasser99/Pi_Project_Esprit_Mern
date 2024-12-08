import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const EmailVerify = () => {
	const [setValidUrl] = useState(false);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `http://localhost:3000/api/users/verify/${param.token}`;
				const { data } = await axios.post(url);
				console.log(data);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	return (
		<>
			<div className={styles.container}>
				<img
					src="https://i.postimg.cc/hv2hMctL/undraw-Mail-sent-re-0ofv-1.png"
					style={{ width: "300px" }}
				/>

				<h1>Email vérifié avec succès</h1>
				<Link to="/login">
					<button className="btn btn-danger ">Connectez-vous à votre compte</button>
				</Link>
			</div>
		</>
	);
};

export default EmailVerify;
