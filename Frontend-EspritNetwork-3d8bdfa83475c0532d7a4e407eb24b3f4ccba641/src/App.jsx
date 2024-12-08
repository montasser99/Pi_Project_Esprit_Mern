import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import { Navbar } from "./Home/Navbar";
import { Tests } from "./Evaluation/candidat/Tests";
import AjouterOffre from "./Offre/company/add/AjouterOffre";
import { Create } from "./Evaluation/company/Create";
import { ListTests } from "./Evaluation/company/ListTests";
import { PassTest } from "./Evaluation/candidat/PassTest";
import { Footer } from "./Home/Footer";
import { Home } from "./Home/Home.jsx";
import NotFound from "./Home/NotFound.jsx";

import { Evaluation } from "./Evaluation/Evaluation.jsx";
import { ListeQ } from "./Evaluation/question/ListeQ.jsx";
import { CreateQ } from "./Evaluation/question/CreateQ.jsx";
import { Candidates } from "./Selection/candidates/Candidates.jsx";
import Mesoffre from "./Offre/company/List/Mesoffre.jsx";
import ModifierOffre from "./Offre/company/Edit/ModifierOffre.jsx";
import Offres from "./Offre/candidat/Offres.jsx";
import Apply from "./Offre/candidat/Apply.jsx";
import { DashboardTest } from "./Evaluation/candidat/DashboardTest.jsx";

import RegisterCompany from "./Users/Register/RegisterCompany.jsx";
import EmailVerify from "./Users/EmailVerify/EmailVerify.jsx";
import PasswordReset from "./Users/ForgetPassword/PasswordReset.jsx";
import ForgetPassword from "./Users/ForgetPassword/ForgetPassword.jsx";
import { Login } from "./Users/login/login.jsx";

import ModifierResume from "./Resume/ModifierResume/ModifierResume.jsx";
import ContactForm from "./Resume/ModifierResume/ContactForm.jsx";
import BiographieForm from "./Resume/ModifierResume/BiographieForm.jsx";
import LanguesForm from "./Resume/ModifierResume/LanguesForm.jsx";
import CompetencesForm from "./Resume/ModifierResume/CompetencesForm.jsx";
import ParcoursAcaForm from "./Resume/ModifierResume/ParcoursAcaForm.jsx";
import ParcoursProForm from "./Resume/ModifierResume/ParcoursProForm.jsx";
import { Resume } from "./Resume/Resume.jsx";
import { CreateAutoTest } from "./Evaluation/company/CreateAutoTest.jsx";
import { AppProvider } from "./Offre/context/AppContext.jsx";
import MesoffreCondidat from "./Offre/candidat/MesoffreCondidat.jsx";
import DetailsMesOffres from "./Offre/candidat/DetailsMesOffres.jsx";
import DetailsCompany from "./Offre/company/details/DetailsCompany.jsx";
import DetailsAllOffer from "./Offre/candidat/DetailsAllOffer.jsx";
import { ImportQs } from "./Evaluation/question/ImportQs.jsx";
import MesArchives from "./Offre/company/archive/MesArchives.jsx";
import { Collection } from "./Selection/shortList/collection.jsx";
import { Shortlist } from "./Selection/shortList/Shortlist.jsx";
import { Edit } from "./Selection/shortList/EditCollection.jsx";
import { TestDetails } from "./Evaluation/candidat/TestDetails.jsx";
import { EditQ } from "./Evaluation/question/EditQ.jsx";
import { SeeTest } from "./Evaluation/company/SeeTest.jsx";
import { EditTest } from "./Evaluation/company/EditTest.jsx";
import StatistiqueOffre from "./Offre/StatistiqueOffre.jsx";
import EmailForm from "./Selection/candidates/EmailForm.jsx";
import { Myassessments } from "./Evaluation/assessments/myAssessments.jsx";
import { AssessmentCandidates } from "./Evaluation/assessments/assessmentCandidates.jsx";
import { CandidatRapport } from "./Evaluation/assessments/candidatRapport.jsx";
import { MesTests } from "./Evaluation/candidat/MesTests.jsx";
import { TestResults } from "./Evaluation/assessments/testResults.jsx";
import RegisterStudent from "./Users/Register/RegisterStudent.jsx";
import RegisterAlumni from "./Users/Register/RegisterAlumni.jsx";
import RegisterTeacher from "./Users/Register/RegisterTeacher.jsx";
import RegisterEsprit from "./Users/Register/RegisterEsprit.jsx";
import Register from "./Users/Register/Register.jsx";
import AccesDenied from "./Home/accesdenied.jsx";
import PrivateRouter from "./PrivateRouter.jsx";
import UserProfileEdit from "./Users/Profil/UserProfileEdit.jsx";
import MeetingScheduler from "./Offre/Calendar/Calendrier.jsx";
import ChatbotAi from "./Offre/chatbotAi.jsx";
import Leftsidebar from "./Filactualiteevent/Leftsidebar.jsx";
import Maincontent from "./Filactualiteevent/Maincontent.jsx";

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

function AppContent() {
	const location = useLocation();
	const hideNavbar =
		location.pathname.startsWith("/evalution/test/passTest/") ||
		location.pathname.startsWith("/evalution/test/questionTest/");

	
	return (
		<AppProvider>
			{hideNavbar ? (
				<div className="d-flex flex-column min-vh-100">
					<div className="flex-grow-1">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/evalution">
								<Route index element={<Evaluation />} />
								<Route path="test">
									<Route
										path="passTest/:id"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<PassTest />
											</PrivateRouter>
										}
									/>
									<Route
										path="questionTest/:id"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<PassTest />
											</PrivateRouter>
										}
									/>
								</Route>
							</Route>
						</Routes>
					</div>
				</div>
			) : (
				<div className="d-flex flex-column min-vh-100">
					<Navbar /> {/* Render Navbar here if not hidden */}
					<div className="flex-grow-1">
						<Routes>
							<Route path="/" element={<Home />} />
							{/* Route  Module Evalution */}
							<Route path="/evalution">
								<Route index element={<Evaluation />} />
								<Route path="test">
									<Route
										index
										path="create"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<Create />
											</PrivateRouter>
										}
									/>
									<Route
										index
										path="update/:id"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<EditTest />
											</PrivateRouter>
										}
									/>
									<Route
										index
										path="eye/:id"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<SeeTest />
											</PrivateRouter>
										}
									/>
									<Route
										path="question/:idQ"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<SeeTest />
											</PrivateRouter>
										}
									/>

									<Route
										path="CreateAutomatically"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<CreateAutoTest />
											</PrivateRouter>
										}
									/>
									<Route
										index
										path="results"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<TestResults />
											</PrivateRouter>
										}
									/>
									{/* <Route
											index
											path="candidatRapport"
											element={<CandidatRapport />}
										/>{" "} */}
									<Route
										path="candidatRapport/:idCandidat/:idOffre"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<CandidatRapport />
											</PrivateRouter>
										}
									/>
									<Route
										path="lister"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<ListTests />
											</PrivateRouter>
										}
									/>
									{/* Condidat  */}
									<Route
										path="mestests"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<Tests />
											</PrivateRouter>
										}
									/>
									<Route
										path="mestestss"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<MesTests />
											</PrivateRouter>
										}
									/>
									<Route
										path="passTest/:id"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<PassTest />
											</PrivateRouter>
										}
									/>
									{/* <Route
										path="questionTest/:id"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<PassTest />
											</PrivateRouter>
										}
									/>*/}
									<Route
										path="testDetails/:id"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<TestDetails />
											</PrivateRouter>
										}
									/>
									<Route
										path="dashboardTest"
										element={
											<PrivateRouter allowedRoles={["alumni", "student"]}>
												<DashboardTest />
											</PrivateRouter>
										}
									/>
								</Route>
								<Route path="question">
									<Route
										index
										path="create"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<CreateQ />
											</PrivateRouter>
										}
									/>
									<Route
										index
										path="update/:id"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<EditQ />
											</PrivateRouter>
										}
									/>
									<Route
										index
										path="import"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<ImportQs />
											</PrivateRouter>
										}
									/>
									<Route
										path="lister"
										element={
											<PrivateRouter allowedRoles={["company", "ADMIN"]}>
												<ListeQ />
											</PrivateRouter>
										}
									/>
								</Route>

								<Route path="assessments">
									<Route path="assessmentPage" element={<Myassessments />} />
									<Route
										path="assessmentCandidates/:id"
										element={<AssessmentCandidates />}
									/>
								</Route>
							</Route>
						
							{/*  Planification    */}
							{/* End  Route  Module Evalution   */}
							{/* Start Route Module Offres */}
							{/* Start Route Module Offres */}
							{/*routes of offres company*/}
							<Route
								path="/ajouter-offre"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<AjouterOffre />
									</PrivateRouter>
								}
							/>{" "}
							
							<Route
								path="/mesoffre"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<Mesoffre />
									</PrivateRouter>
								}
							/>
							<Route
								path="/modifieroffre/:id"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<ModifierOffre />
									</PrivateRouter>
								}
							/>
							<Route
								path="/mesarchives"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<MesArchives />
									</PrivateRouter>
								}
							/>
							{/*routes of offres All*/}
							<Route
								path="/offres"
								element={
									<PrivateRouter allowedRoles={["alumni", "student", "ADMIN"]}>
										<Offres />
									</PrivateRouter>
								}
							/>
							{/*routes of offres condidat*/}
							<Route
								path="/postuler/:idoffre/:iduser"
								element={
									<PrivateRouter allowedRoles={["alumni", "student", "ADMIN"]}>
										<Apply />
									</PrivateRouter>
								}
							/>
							<Route
								path="/condidat/mesoffres"
								element={
									<PrivateRouter allowedRoles={["alumni", "student", "ADMIN"]}>
										<MesoffreCondidat />
									</PrivateRouter>
								}
							/>
							<Route
								path="/condidat/mesoffres/details/:idcondidacy"
								element={
									<PrivateRouter allowedRoles={["alumni", "student"]}>
										<DetailsMesOffres />
									</PrivateRouter>
								}
							/>
							{/*details of condidat*/}
							<Route
								path="/company/details/:idoffre"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<DetailsCompany />
									</PrivateRouter>
								}
							/>
							<Route
								path="/condidat/alloffres/details/:idoffre"
								element={
									<PrivateRouter allowedRoles={["alumni", "student"]}>
										<DetailsAllOffer />
									</PrivateRouter>
								}
							/>
							{/*details of calendar offre*/}
							<Route path="/calendrier" element={<MeetingScheduler />} />
							{/*statistique of offre*/}
							<Route path="/statistique-offre" element={<StatistiqueOffre />} />


							<Route path="/chatbotIA" element={<ChatbotAi  />} />

							{/* End Route Module Offres */}
							{/* End Route Module Offres */}
							{/* Resum Route  */}
							<Route
								path="/resume"
								element={
									<PrivateRouter
										allowedRoles={["company", "alumni", "student", "ADMIN"]}
									>
										<Resume />
									</PrivateRouter>
								}
							/>
							<Route
								path="/resume/:id"
								element={
									<PrivateRouter
										allowedRoles={["company", "alumni", "student", "ADMIN"]}
									>
										<Resume />
									</PrivateRouter>
								}
							/>
							<Route
								path="/resume/modifiercv"
								element={
									<PrivateRouter allowedRoles={["alumni", "student", "ADMIN"]}>
										<ModifierResume />
									</PrivateRouter>
								}
							>
								<Route path="contact" element={<ContactForm />} />
								<Route path="biographie" element={<BiographieForm />} />
								<Route path="parcourspro" element={<ParcoursProForm />} />
								<Route path="parcoursacad" element={<ParcoursAcaForm />} />
								<Route path="competences" element={<CompetencesForm />} />
								<Route path="langues" element={<LanguesForm />} />
							</Route>
							{/* Resum Route  */}
							{/* Start Route Module User */}
							<Route path="/register" element={<Register />} />
							<Route path="/login" element={<Login />} />
							<Route path="/RegisterStudent" element={<RegisterStudent />} />
							<Route path="/RegisterComapany" element={<RegisterCompany />} />
							<Route path="/RegisterAlumni" element={<RegisterAlumni />} />
							<Route path="/RegisterTeacherr" element={<RegisterTeacher />} />
							<Route path="/RegisterEspr" element={<RegisterEsprit />} />
							<Route path="/activate/:token" element={<EmailVerify />} />
							<Route path="/PasswordReset/:token" element={<PasswordReset />} />
							<Route path="/index" element={<ForgetPassword />} />
							<Route
								path="/UserProfil"
								element={
									<PrivateRouter
										allowedRoles={[
											"ADMIN",
											"student",
											"alumni",
											"esprit_staff",
											"teacher",
											"company",
										]}
									>
										<UserProfileEdit />
									</PrivateRouter>
								}
							/>
							{/* End Route Module User */}
							{/* Start Route Module Selection */}
							<Route
								path="/short"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<Shortlist />
									</PrivateRouter>
								}
							/>
							<Route
								path="/condidates/:id"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<Candidates />
									</PrivateRouter>
								}
							/>
							<Route
								path="/selection/:id"
								element={
									<PrivateRouter allowedRoles={["company", "ADMIN"]}>
										<Collection />
									</PrivateRouter>
								}
							/>
							<Route
								path="/collection/edit/:id"
								element={
									<PrivateRouter allowedRoles={["company"]}>
										<Edit />
									</PrivateRouter>
								}
							/>
							<Route
								path="/Email/:id"
								element={
									<PrivateRouter allowedRoles={["company"]}>
										<EmailForm />
									</PrivateRouter>
								}
							/>
							< Route
								path="/Evenement"
								element={
									<PrivateRouter
										allowedRoles={["company", "alumni", "student", "ADMIN"]}
									>
                                   <Leftsidebar />
                                   <Maincontent />
								</PrivateRouter>
								}
							/>
							{/* End Route Module Selection */}
							{/* Route for handling 404 */}
							<Route path="*" element={<NotFound />} />
							<Route path="unauthorized" element={<AccesDenied />} />
						</Routes>
					</div>
					<Footer />
				</div>
			)}
		</AppProvider>
	);
}

export default App;
