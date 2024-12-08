import { useEffect, useState } from "react";
import { Navbar } from "../../Home/Navbar";
import axios from "axios";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router";
import Timer from "./Timer";
import firebase from "../FirebaseConfig";
import "firebase/storage";
export function PassTest() {
	const id = JSON.parse(localStorage.getItem("idTest"));
	var userInfoString = localStorage.getItem("userInfo");
	var userInfo = JSON.parse(userInfoString);
	var userId = userInfo._id;
	const idCandidat = userId;
	const navigate = useNavigate();
	const [questions, setQuestions] = useState([]);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [response, setResponse] = useState([]);
	const [check, setCheck] = useState("");
	const [selectedResponse, setSelectedResponse] = useState("");
	const [test, setTest] = useState({
		domaine: "",
		categorie: "",
		technologie: "",
		duree: 0,
		niveau: "",
		questions: [],
		description: "",
	});
	const [urlVideo, setUrlVideo] = useState("");
	/***anti cheating */
	const [antiCheating, setAntiCheating] = useState({
		autorisationCamera: false,
		autorisationMicro: false,
		autorisationFullScreen: false,
		sourisDansFenetre: true,
		typeApapreil: "",
		urlVideo: "",
	});
	const [deviceInfo, setDeviceInfo] = useState({});
	const [cameraActivated, setCameraActivated] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isMouseInsideWindow, setIsMouseInsideWindow] = useState(true);

	const [mediaStreamObj, setMediaStreamObj] = useState(null);
	const [mediaRecorder, setMediaRecorder] = useState(null);
	const [chunks, setChunks] = useState([]);

	const startRecording = () => {
		let constraintObj = {
			audio: false,
			video: {
				facingMode: "user",
				width: { ideal: 200 },
			},
		};

		navigator.mediaDevices
			.getUserMedia(constraintObj)
			.then((mediaStreamObj) => {
				let video = document.querySelector("video");
				if ("srcObject" in video) {
					video.srcObject = mediaStreamObj;
				} else {
					video.src = window.URL.createObjectURL(mediaStreamObj);
				}

				video.onloadedmetadata = function () {
					video.play();
				};

				let newMediaRecorder = new MediaRecorder(mediaStreamObj);

				newMediaRecorder.ondataavailable = (ev) => {
					setChunks((prevChunks) => [...prevChunks, ev.data]);
				};

				setMediaStreamObj(mediaStreamObj);
				setMediaRecorder(newMediaRecorder);

				newMediaRecorder.start();
			})
			.catch((err) => {
				console.log(err.name, err.message);
			});
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
			mediaStreamObj.getTracks().forEach((track) => track.stop());

			let blob = new Blob(chunks, { type: "video/mp4;" });
			let storageRef = firebase
				.storage()
				.ref()
				.child("recordings/" + new Date().toISOString() + ".mp4");

			storageRef
				.put(blob)
				.then(() => {
					console.log("Recording uploaded successfully!");
				})
				.catch((error) => {
					console.error("Error uploading recording:", error);
				});

			setMediaStreamObj(null);
			setMediaRecorder(null);
			setChunks([]);
		}
	};

	useEffect(() => {
		const handleMouseEnter = () => {
			setIsMouseInsideWindow(true);
			setAntiCheating((prevState) => ({
				...prevState,
				sourisDansFenetre: true,
			}));
		};

		const handleMouseLeave = () => {
			setIsMouseInsideWindow(false);
			setAntiCheating((prevState) => ({
				...prevState,
				sourisDansFenetre: false,
			}));
		};

		window.addEventListener("mouseenter", handleMouseEnter);
		window.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			window.removeEventListener("mouseenter", handleMouseEnter);
			window.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, []);

	useEffect(() => {
		requestCameraAccess();
		document.addEventListener("fullscreenchange", handleFullScreenChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullScreenChange);
		};
	}, []);
	const requestCameraAccess = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (stream) {
				setCameraActivated(true);
				setAntiCheating((prevState) => ({
					...prevState,
					autorisationCamera: true,
				}));
			} else {
				setAntiCheating((prevState) => ({
					...prevState,
					autorisationCamera: false,
				}));
			}
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	const handleFullScreenChange = () => {
		setIsFullScreen(document.fullscreenElement !== null);
	};

	const handleOptionSelect = (option) => {
		setCheck(option);
		setSelectedResponse(option);
	};

	const navigateToQuestion = (questionId) => {
		navigate(`/evalution/test/questionTest/${questionId}`);
	};
	const nextQuestion = async () => {
		if (check !== "") {
			const newResponse = {
				idQuestion: questions[count]._id,
				reponse: check,
			};
			setResponse((prevResponse) => [...prevResponse, newResponse]);
			setAntiCheating({
				...antiCheating,
				cameraActivated: cameraActivated,
				isFullScreen: isFullScreen,
				isMouseInsideWindow: isMouseInsideWindow,
				typeApapreil: deviceInfo,
			});

			const nextQuestionIndex = count + 1;

			if (nextQuestionIndex < questions.length) {
				setCount(nextQuestionIndex);
				navigateToQuestion(questions[nextQuestionIndex]._id);
			}
		}
	};

	const sendResponse = async () => {
		try {
			console.log("sqsdqd", antiCheating);
			const data = {
				idCandidat: idCandidat,
				idTest: id,
				reponses: response,
				antiCheating: antiCheating,
			};
			await axios
				.put(`http://localhost:3000/test/passTest`, data)
				.then((response) => {
					console.log("Response from backend:", response);
					stopRecording();
				})
				.catch((error) => {
					console.error("Error sending response:", error);
				});
		} catch (error) {
			console.log("Error sending response:", error.message);
		}
		document.exitFullscreen();
		navigate("/evalution/test/mestestss");
	};

	useEffect(() => {
		const device = isMobile ? "Mobile Device" : "Desktop Device";
		setDeviceInfo(device);
	}, []);

	useEffect(() => {
		axios
			.get(`http://localhost:3000/test/getbyid/${id}`)
			.then((response) => {
				console.log("Test fetched:", response.data);
				setTest(response.data);
				setQuestions(response.data.questions);

				setLoading(false);
			})
			.catch((error) => {
				console.log("Error fetching test:", error.message);
				setLoading(false);
			});
	}, [id]);

	useEffect(() => {
		console.log("Response updated:", response);
	}, [response]);

	const toggleFullScreen = () => {
		const elem = document.documentElement;
		if (!document.fullscreenElement) {
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
				startRecording();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	};

	return (
		<>
			<div>
				{loading ? (
					<div className="position-relative" style={{ marginTop: "15rem" }}>
						<div className="position-absolute top-50 start-50 translate-middle">
							<div className="spinner-border  spinner-border-lg" role="status">
								<span className="visually-hidden">
									<div className="loading">Loading</div>
								</span>
							</div>
						</div>
					</div>
				) : (
					<div>
						{cameraActivated && isFullScreen ? (
							<>
								<div className="section-bg">
									<Timer duree={test.duree} />
									<div className="container py-4 ">
										<div className="flex d-flex justify-content-between">
											<p>Device Detected : {deviceInfo}</p>
											<div>
												<video></video>
											</div>
										</div>
										<div className="row" style={{ backgroundColor: "#fff" }}>
											<div className="row p-4">
												<div className="d-flex justify-content-end align-items-end w-100">
													<button
														className="btn btn-secondary "
														onClick={nextQuestion}
													>
														Suivant
													</button>
												</div>
											</div>
											<div className="question">
												<div className="form-check">
													<h2>
														Question N° {count + 1} /{questions.length}{" "}
													</h2>
													<div className="col">
														<p>{questions[count].titre}</p>
													</div>
													<div className="options py-3">
														<div className="col">
															{questions[count].options.map((item, index) => (
																<div className="row-4" key={index}>
																	<div className="card">
																		<div className="card-body">
																			<input
																				type="radio"
																				onClick={() =>
																					handleOptionSelect(item.option)
																				}
																				onChange={() => {
																					setCheck(item.option);
																				}}
																				checked={
																					selectedResponse === item.option
																				}
																			/>
																			<p className="card-text">
																				<code>{item.option}</code>
																			</p>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												</div>
											</div>

											<div className="d-flex justify-content-end  py-1 ">
												<button
													className="btn btn-danger w-25"
													onClick={sendResponse}
												>
													Envoyer
												</button>
											</div>
										</div>
										<div
											className="row"
											style={{ backgroundColor: "#fff" }}
										></div>
									</div>
								</div>
							</>
						) : (
							<>
								<Navbar />
								<section id="contact" className="contact section-bg py-5  mt-5">
									<section
										id="portfolio-details"
										className="portfolio-details  py-5"
									>
										<div className="section-title ">
											<h2>Passage du Quiz</h2>
										</div>

										<div className="row">
											<div className="container">
												<div className="justify-content-center">
													<div className=" mt-8 flex d-flex  justify-content-center">
														<div className="portfolio-info">
															<h3 className="text-danger">Il Faut Que : </h3>
															<ul>
																<li>
																	<i className="fas fa-check mx-4"></i> Veuillez
																	autoriser l&apos;utilisation de votre
																	caméra/webcam
																</li>
																<li>
																	<i className="fas fa-check mx-4"></i> Ne
																	quittez pas le mode plein écran.
																</li>
																<li className="py-2 flex d-flex justify-content-center">
																	<button
																		type="button"
																		className="col-4 btn btn-outline-success"
																		onClick={() => {
																			toggleFullScreen();
																			startRecording();
																		}}
																	>
																		Commencer
																	</button>{" "}
																</li>{" "}
															</ul>
														</div>
													</div>
												</div>
											</div>
										</div>
									</section>
								</section>
							</>
						)}
					</div>
				)}
			</div>
		</>
	);
}
