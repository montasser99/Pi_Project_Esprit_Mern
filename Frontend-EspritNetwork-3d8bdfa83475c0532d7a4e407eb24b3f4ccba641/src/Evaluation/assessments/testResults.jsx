import { useEffect, useState } from "react";
import "ldrs/ring";
import "ldrs/newtonsCradle";
import "../Evaluation.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { Navbar } from "../../Home/Navbar";
export function TestResults() {
	const [tests, setTests] = useState([]);
	const [resulat, setResulat] = useState([]);
	const [offres, setOffres] = useState([]);
	const [searchloading, setSearchLoading] = useState(true);
	const [resultatloading, setResultatLoading] = useState(true);

	useEffect(() => {
		const getTests = async () => {
			await axios
				.get("http://localhost:3000/test/getResultTests")
				.then((res) => {
					console.log(res.data);
					setResulat(res.data);
					let of = [];
					let t = [];
					for (let i = 0; i < res.data.length; i++) {
						console.log(res.data[i].offre);
						of.push(res.data[i].offre);
						t.push(res.data[i].test);
					}
					setOffres(of);
					setTests(t);
					setSearchLoading(false);
					setResultatLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setSearchLoading(false);
					setResultatLoading(false);
				});
		};
		getTests();
	}, []);
	const navigate = useNavigate();
	return (
		<>
			<Navbar />
			<section id="faq" className="faq section-bg py-5 ">
				<div className="section-title pt-5  mt-5">
					<h2>Résultats des tests </h2>
				</div>
				<div className="mx-5 ">
					<div className="row ">
						{searchloading ? (
							<div className="d-flex justify-content-center py-5 ">
								<div className="py-5">
									<l-newtons-cradle
										size="180"
										speed="1.1"
										color="#cf0000"
									></l-newtons-cradle>
								</div>
							</div>
						) : (
							<div className="row flex d-flex justify-content-end ">
								<select className="col-3 mx-2 black-hover">
									<option value="">Selectioner une offre</option>
									{offres.map((offre, index) => {
										return (
											<option key={index} value={offre._id}>
												{offre.titre}
											</option>
										);
									})}
								</select>
								<select className="col-3 mx-2 black-hover">
									<option value="">Selectioner un Test</option>
									{tests.map((test, index) => {
										return (
											<option key={index} value={test._id}>
												{test.technologie}
											</option>
										);
									})}
								</select>

								<button className="col-1 btn btn-danger py-1" type="button">
									Search
								</button>
							</div>
						)}
						{resultatloading ? (
							<div className="d-flex justify-content-center py-5 ">
								<div className="py-5">
									<l-newtons-cradle
										size="180"
										speed="1.1"
										color="#cf0000"
									></l-newtons-cradle>
								</div>
							</div>
						) : (
							<div className="col-12 py-5">
								<div className="contact px-2 pt-2 pb-2">
									<div className="table-responsive">
										<table className="table table-hover mb-0">
											<thead>
												<tr>
													<th className="text-uppercase text-black ms-4">
														Offre Title
													</th>
													<th className="text-uppercase text-black ms-4">
														Date publication
													</th>
													<th className="text-uppercase text-black ms-4">
														NOM Prénom
													</th>

													<th className="text-uppercase text-black ms-4">
														Email
													</th>
													<th className="text-uppercase text-black ms-4">
														Tests
													</th>
													<th className="text-uppercase text-black ms-4">
														Score
													</th>
													<th className="text-uppercase text-black ms-4">
														Etat
													</th>
													{/* <th className="text-uppercase text-black ms-4">
														ACTIONS
													</th> */}
												</tr>
											</thead>
											<tbody>
												{resulat.map((item, index) => (
													<tr
														key={index}
														onClick={() =>
															navigate(
																`/evalution/test/candidatRapport/${item.idCandidat}/${item.idOffre}`
															)
														}
													>
														<td>
															<p className="text-black">{item.offre.titre}</p>
														</td>
														<td>
															<p className="text-black">
																{item.offre.created_at}
															</p>
														</td>
														<td>
															<p className="text-black">{item.candidat.name}</p>
														</td>

														<td>
															<p className="text-black">
																{item.candidat.email}
															</p>
														</td>
														<td>
															<p className="text-black">
																{item.test.technologie}
															</p>
														</td>
														<td>
															<p className="text-black">
																<span className="text-black ">
																	{item.score} %
																</span>
															</p>
														</td>
														<td>
															<p className="text-black">
																{item.etat ? (
																	<span className="badge bg-success">
																		Passed
																	</span>
																) : (
																	<span className="badge bg-info">
																		Not yet passed
																	</span>
																)}
															</p>
														</td>
														{/* <td>
															<button
																className="btn btn-outline-secondary "
																type="button"
															>
																<i className="fa-regular fa-paper-plane"></i>{" "}
															</button>{" "}
															<button
																className="btn btn-outline-secondary"
																type="button"
															>
																<i className=" fa-solid fa-handshake"></i>
															</button>
														</td> */}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
