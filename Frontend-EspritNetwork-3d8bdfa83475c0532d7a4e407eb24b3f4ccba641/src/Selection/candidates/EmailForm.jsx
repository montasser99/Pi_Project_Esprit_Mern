import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "../Selection.css";
import { Link } from "react-router-dom";

const EmailForm = () => {
	const [recipient, setRecipient] = useState("");
	const [subject, setSubject] = useState("");
	const [text, setText] = useState("");
	const [recipientError, setRecipientError] = useState(false);
	const [subjectError, setSubjectError] = useState(false);
	const [textError, setTextError] = useState(false);

	const queryParams = new URLSearchParams(location.search);
	const email = queryParams.get("email");

	useEffect(() => {
		// Remplir automatiquement le champ "Destinataire" avec l'e-mail de l'URL
		if (email) {
			setRecipient(email);
		}
	}, [email]);

	const handleRecipientChange = (e) => {
		setRecipient(e.target.value);
	};

	const handleSubjectChange = (e) => {
		setSubject(e.target.value);
	};

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	const validateForm = () => {
		let isValid = true;
		if (!recipient) {
			setRecipientError(true);
			isValid = false;
		}
		if (!subject) {
			setSubjectError(true);
			isValid = false;
		}
		if (!text) {
			setTextError(true);
			isValid = false;
		}
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!recipient || !subject || !text) {
			if (!recipient) setRecipientError(true);
			if (!subject) setSubjectError(true);
			if (!text) setTextError(true);

			return;
		}

		const htmlContent = `
      <body>
          <table width="100%">
              <tr>
                  <td style="padding: 20px 0; background-color: #000000">
                      <a
                          target="_blank"
                          style="
                              text-decoration: none;
                              color: #fff;
                              display: flex;
                              align-items: start;
                              justify-content: start;
                          "
                      >
                          <img src="https://i.postimg.cc/qR5fh0QH/logo-network.png"
                          width="70px" height="70px" alt="Esprit Network auto" style="display:
                          block; border: 0 ; padding: 10px;" />
                          <h1>Esprit Network</h1>
                      </a>
                  </td>
              </tr>
              <tr style="background: #fff">
                  <td style="padding: 20px">
                  <p>${text.replace(/\n\r?/g, "<br/>")}<br/>
                          <a>@L’équipe Esprit Network</a>
                      </p>
                  </td>
              </tr>
          </table>
      </body>
  `;

		const response = await fetch("http://localhost:3000/send-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				recipient: recipient,
				subject: subject,
				html: htmlContent,
			}),
		});

		if (response.ok) {
			console.log("E-mail envoyé avec succès");
			toast.success("E-mail envoyé avec succès");

			// Réinitialiser les champs du formulaire après l'envoi réussi

			setSubject("");
			setText("");
			handleCloseModal();
		} else {
			console.error("Erreur lors de l'envoi de l'e-mail");
		}
	};

	const handleFormSubmit = (e) => {
		e.preventDefault(); // Assurez-vous que e.preventDefault() est appelé au début de la fonction
		if (validateForm()) {
			handleSubmit(e); // Assurez-vous de passer l'événement e à la fonction handleSubmit
			setRecipient("");
			setSubject("");
			setText("");
		}
	};

	return (
		<>
			{/* ======= Selection Section ======= */}
			<ToastContainer />
			<section
				id="contact"
				className="contact py-5 align-items-start"
				style={{ marginTop: "40px" }}
			>
				<div className="title">
					<h2>
						Envoyer un Email <i class="bi bi-envelope-at"></i>
					</h2>
				</div>

				<div className="row justify-content-center">
					<div className="col-md-9"></div>
					<Form
						onSubmit={handleFormSubmit}
						className="form-ajout"
						style={{ maxWidth: "1000px" }}
					>
						<Form.Group controlId="recipient">
							<div className="mb-3">
								<strong>
									<Form.Label>Destinataire</Form.Label>
								</strong>
								<Form.Control
									className={`form-control ${
										recipientError ? "is-invalid" : ""
									}`}
									type="email"
									placeholder="Entrez l'e-mail du destinataire"
									value={email}
									onChange={handleRecipientChange}
								/>
								{recipientError && (
									<div className="invalid-feedback">
										Le destinataire est requis.
									</div>
								)}
							</div>
						</Form.Group>

						<Form.Group controlId="subject">
							<div className="mb-3">
								<strong>
									<Form.Label>Sujet</Form.Label>
								</strong>
								<Form.Control
									className={`form-control ${subjectError ? "is-invalid" : ""}`}
									type="text"
									placeholder="Entrez le sujet de l'e-mail"
									value={subject}
									onChange={handleSubjectChange}
								/>
								{subjectError && (
									<div className="invalid-feedback">Le sujet est requis.</div>
								)}
							</div>
						</Form.Group>

						<Form.Group controlId="text">
							<div className="mb-3">
								<strong>
									<Form.Label>Contenu</Form.Label>
								</strong>
								<Form.Control
									className={`form-control ${textError ? "is-invalid" : ""}`}
									as="textarea"
									rows={3}
									placeholder="Entrez le contenu de l'e-mail"
									value={text}
									onChange={handleTextChange}
								/>
								{textError && (
									<div className="invalid-feedback">
										Le contexte est requis.
									</div>
								)}
							</div>
						</Form.Group>

						<div className="mt-3">
							<button className="btn btn-dark mx-2" onClick={handleSubmit}>
								Envoyer
							</button>
						</div>
					</Form>
				</div>
			</section>
		</>
	);
};

export default EmailForm;
