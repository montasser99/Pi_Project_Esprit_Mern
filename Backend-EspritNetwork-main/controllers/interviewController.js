const Interview = require("../models/interview");
const { authorize, createSpace } = require("../meet");
const { get } = require("mongoose");
const User = require("../models/user");
const Condidacy = require("../models/condidacy");
const nodemailer = require("nodemailer");
const Offre = require("../models/offre");
const { updateStatusCandidacy } = require("./condidacyController");
const GMAIL_USER = "orangedigitalcentretest@gmail.com";
const GMAIL_PSW = "ylwvzbilzvcceuoa";

async function PlanifierEntretienEnLigne(req, res) {
	try {
		const { date, idCandidat, idOffre } = req.body;
		// Authorize and create meeting space
		const authClient = await authorize();
		const link = await createSpace(authClient);

		// Save meeting link to the database
		const data = { date, idCandidat, idOffre, link };

		const interview = new Interview(data);
		await interview.save();

		//***** Alert  with mail to the candidat */
		//find by id le user
		const candidat = await User.findById(idCandidat);
		const offre = await Offre.findById(idOffre);
		const email = candidat.email;

		/****update candidacy status */
		await Condidacy.findOneAndUpdate(
			{ user: idCandidat, offre: idOffre },
			{ $set: { status: "Invité pour un entretien" } },
			{ new: true }
		);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: GMAIL_USER,
			to: email,
			subject: `Invitation pour un entretien`,
			html: `		<body>
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
					<p style="margin: 2; font-size: 14px; color: #000000">
						Bonjour ${candidat.name},<br /><br />
						Suite à votre candidature por l'offre
						<strong> ${offre.titre} </strong>, vous avez été présélectionné pour
						passer un entretien en ligne.<br />
						Veuillez
						<a href="${link}" style="color: #2cb543; text-decoration: underline"
							>cliquer ici pour rejoindre le meeting</a
						>. Le <strong style="color: #cf0000"> ${interview.date}</strong>.
						<br />	<br />
						Bonne chance!<br /><br />
						L’équipe Esprit Network
					</p>
				</td>
			</tr>
		</table>
	               </body>`,
		});
		// if (info) {
		// 	console.log(info);
		// } else {
		// 	console.log("err");
		// }
		res
			.status(201)
			.json({ message: "interview added successfully", interview });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
async function PlanifierEntretienAubureau(req, res) {
	console.log("PlanifierEntretienAubureau");
	try {
		const { date, idCandidat, idOffre } = req.body;

		const link = "*********";

		// Save meeting link to the database
		const data = { date, idCandidat, idOffre, link };
		console.log("data ", data);
		const interview = new Interview(data);
		await interview.save();
		/****update candidacy status */
		await Condidacy.findOneAndUpdate(
			{ user: idCandidat, offre: idOffre },
			{ $set: { status: "Invité pour un entretien" } },
			{ new: true }
		);
		//***** Alert  with mail to the candidat */
		const candidat = await User.findById(idCandidat);
		const offre = await Offre.findById(idOffre);
		const email = candidat.email;
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: GMAIL_USER,
			to: email,
			subject: "Invitation pour un entretien",
			html: `		<body>
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
					<p style="margin: 2; font-size: 14px; color: #000000">
						  Bonjour ${candidat.name},<br /><br />
                    Suite à votre candidature pour l'offre <strong>${offre.titre}</strong>, vous avez été présélectionné pour passer un entretien dans nos bureau le <strong>${date}</strong> <br /> 
                    Nous restons à votre disposition pour toute information complémentaire. <br/>N'hésitez pas à nous contacter par email à l'adresse <a href="mailto:contact@espritnetwork.com" style="color: #2cb543; text-decoration: underline;">contact@espritnetwork.com</a> ou par téléphone au +123456789.<br /><br />
                    Cordialement,<br />
                    L’équipe Esprit Network
					</p>
				</td>
			</tr>
		</table>
	</body>`,
		});
		/* if (info) {
			console.log(info);
		} else {
			console.log("err");
		} */
		res
			.status(201)
			.json({ message: "interview added successfully", interview });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
async function EnovyerMaildAcceptation(req, res) {
	try {
		const { idCandidat, idOffre } = req.body;
		console.log("idCandidat", idCandidat);
		console.log("idOffre", idOffre);
		const candidat = await User.findById(idCandidat);
		const offre = await Offre.findById(idOffre);
		// Update candidacy status

		const updatedCandidacy = await Condidacy.findOneAndUpdate(
			{ user: idCandidat, offre: idOffre },
			{ $set: { status: "Accepté" } },
			{ new: true }
		);

		console.log("Updated Candidacy:", updatedCandidacy); // Log updated document

		if (updatedCandidacy) {
			console.log("Updated Candidacy:", updatedCandidacy);
		} else {
			console.log(
				"No document found to update with the provided query parameters."
			);
		}
		const email = candidat.email;
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: GMAIL_USER,
			to: email,
			subject: `Statut de votre candidature pour l'offre ${offre.titre}`,
			html: `		<body>
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
                <p style="margin: 2; font-size: 14px; color: #000000">
                    Bonjour ${candidat.name},<br /><br />
					Nous sommes ravis de vous informer que votre candidature pour le poste de <strong> ${offre.titre} </strong>a été retenue ! Nous sommes convaincus que vous avez les compétences et l'expérience nécessaires pour contribuer à notre équipe et nous sommes impatients de vous rencontrer en personne.<br /><br />
                    N'hésitez pas à nous contacter pour toute information complémentaire ou toute clarification supplémentaire.  Nous sommes là pour vous aider dans cette nouvelle étape de votre carrière. <br/> <br />
                    Nous avons hâte de vous accueillir dans notre équipe et de travailler ensemble pour atteindre nos objectifs communs. <br /><br /> <br />
                   Cordialement, <br /><br />
                    L’équipe Esprit Network
                </p>
            </td>
        </tr>
    </table>
</body>`,
		});
		// if (info) {
		// 	console.log(info);
		// } else {
		// 	console.log("err");
		// }
		res.status(201).json({ message: "statut de candidature à ete modifié " });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
async function EnovyerMailRefuse(req, res) {
	try {
		const { idCandidat, idOffre } = req.body;
		console.log("idCandidat", idCandidat);
		console.log("idOffre", idOffre);
		const candidat = await User.findById(idCandidat);
		const offre = await Offre.findById(idOffre);

		/****update candidacy status */
		await Condidacy.findOneAndUpdate(
			{ user: idCandidat, offre: idOffre },
			{ $set: { status: "Refusé" } },
			{ new: true }
		);

		const email = candidat.email;
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: GMAIL_USER,
				pass: GMAIL_PSW,
			},
		});
		let info = await transporter.sendMail({
			from: GMAIL_USER,
			to: email,
			subject: `Statut de votre candidature pour l'offre ${offre.titre}`,
			html: `		<body>
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
					 <p style="margin: 2; font-size: 14px; color: #000000;">
                    Bonjour ${candidat.name},<br /><br />
                    Nous regrettons de vous informer que votre candidature pour le poste de  <strong>${offre.titre} </strong> n'a pas été retenue.
					 <br/> Nous vous remercions pour l'intérêt que vous avez porté à notre entreprise et pour le temps que vous avez consacré à postuler pour ce poste.
					 <br /><br />
                    N'hésitez pas à nous contacter pour toute information complémentaire ou toute clarification supplémentaire.	<br /><br />
                    Nous vous souhaitons beaucoup de succès dans vos recherches futures et nous vous remercions encore une fois pour votre candidature.<br /><br />
                    Cordialement,<br />
                    L’équipe Esprit Network
                </p>
				</td>
			</tr>
		</table>
	</body>`,
		});
		// if (info) {
		// 	console.log(info);
		// } else {
		// 	console.log("err");
		// }
		res.status(201).json({ message: "statut de candidature à ete modifié " });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

async function SendMAilPourPassTest(candidat) {
	try {
		console.log("candidat", candidat);
		if (candidat != null) {
			/****update candidacy status */

			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: GMAIL_USER,
					pass: GMAIL_PSW,
				},
			});
			let info = await transporter.sendMail({
				from: GMAIL_USER,
				to: candidat.email,
				subject: `Invitation pour passer un test technique`,
				html: `	<body>
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
					<p style="margin: 2; font-size: 14px; color: #000000">
						Bonjour ${candidat.name},<br /><br />
						Suite à votre candidature vous avez été présélectionné pour
						passer un <strong>Test Technique  en ligne</strong>.<br />
						Veuillez connecter à votre espace candidat pour passer le test. <br />
						Le test est composé de questions à choix unique  , pour plus d'information consulter votre espace  dans la rebrique <strong>Evaluation</strong> <br />
						<br />	<br />
						Bonne chance!<br /><br />
						L’équipe Esprit Network
					</p>
				</td>
			</tr>
		</table>
	               </body>`,
			});
			if (info) {
				console.log(info);
				return true;
			} else {
				console.log("err");
				return false;
			}
		}
	} catch (err) {
		console.log({ error: "Internal Server Error" });
	}
}

module.exports = {
	PlanifierEntretienEnLigne,
	PlanifierEntretienAubureau,
	EnovyerMailRefuse,
	EnovyerMaildAcceptation,
	SendMAilPourPassTest,
};
