// Filter.jsx

import React from "react";

const FilterComponent = ({ filterOptions, handleFilterChange, counts }) => {
	return (
		<div className="col-lg-3 my-3 py-5 ">
			<div className="card crd bg-light border border-danger">
				<div className="card-body">
					<h4 className="card-title text-dark text-center mb-4">Filtrer</h4>

					<ul className="list-group">
						<li className="list-group">
							<h5>Type offre</h5>
							{Object.keys(counts.initialTypeOffreCounts).length > 0 ? (
								<>
									{Object.keys(counts.initialTypeOffreCounts).length > 4 ? (
										<div className="scrollbar scrollbar-pink bordered-pink thin">
											<div className="force-overflow">
												{Object.keys(counts.initialTypeOffreCounts).map(
													(value) => {
														const count = counts.initialTypeOffreCounts[value];
														const isChecked =
															filterOptions.typeoffre.includes(value);
														return (
															<div
																key={value}
																className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
															>
																<div
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	{value.charAt(0).toUpperCase() +
																		value.slice(1)}
																	<span
																		style={{
																			opacity: 0.5,
																			color: "gray",
																			marginLeft: "5px",
																		}}
																	>
																		({count})
																	</span>
																</div>
																<input
																	type="checkbox"
																	className="form-check-input"
																	value={value}
																	checked={isChecked}
																	onChange={(e) =>
																		handleFilterChange("typeoffre", value)
																	}
																/>
															</div>
														);
													}
												)}
											</div>
										</div>
									) : (
										Object.keys(counts.initialTypeOffreCounts).map((value) => {
											const count = counts.initialTypeOffreCounts[value];
											const isChecked = filterOptions.typeoffre.includes(value);
											return (
												<div
													key={value}
													className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
												>
													<div
														style={{ display: "flex", alignItems: "center" }}
													>
														{value.charAt(0).toUpperCase() + value.slice(1)}
														<span
															style={{
																opacity: 0.5,
																color: "gray",
																marginLeft: "5px",
															}}
														>
															({count})
														</span>
													</div>
													<input
														type="checkbox"
														className="form-check-input"
														value={value}
														checked={isChecked}
														onChange={(e) =>
															handleFilterChange("typeoffre", value)
														}
													/>
												</div>
											);
										})
									)}
								</>
							) : (
								<p style={{ color: "gray" }}>Aucune option disponible.</p>
							)}
							<hr />
						</li>
					</ul>

					<ul className="list-group">
						<li className="list-group">
							<h5>Type contrat</h5>
							{Object.keys(counts.initialTypeContratCounts).length > 0 ? (
								<>
									{Object.keys(counts.initialTypeContratCounts).length > 4 ? (
										<div className="scrollbar scrollbar-pink bordered-pink thin">
											<div className="force-overflow">
												{Object.entries(counts.initialTypeContratCounts).map(
													([value, count]) => {
														const isChecked =
															filterOptions.typecontrat.includes(value);
														return (
															<div
																key={value}
																className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
															>
																<div
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	{value.charAt(0).toUpperCase() +
																		value.slice(1)}
																	<span
																		style={{
																			opacity: 0.5,
																			color: "gray",
																			marginLeft: "5px",
																		}}
																	>
																		({count})
																	</span>
																</div>
																<input
																	type="checkbox"
																	className="form-check-input"
																	value={value}
																	checked={isChecked}
																	onChange={(e) =>
																		handleFilterChange("typecontrat", value)
																	}
																/>
															</div>
														);
													}
												)}
											</div>
										</div>
									) : (
										Object.entries(counts.initialTypeContratCounts).map(
											([value, count]) => {
												const isChecked =
													filterOptions.typecontrat.includes(value);
												return (
													<div
														key={value}
														className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
													>
														<div
															style={{ display: "flex", alignItems: "center" }}
														>
															{value.charAt(0).toUpperCase() + value.slice(1)}
															<span
																style={{
																	opacity: 0.5,
																	color: "gray",
																	marginLeft: "5px",
																}}
															>
																({count})
															</span>
														</div>
														<input
															type="checkbox"
															className="form-check-input"
															value={value}
															checked={isChecked}
															onChange={(e) =>
																handleFilterChange("typecontrat", value)
															}
														/>
													</div>
												);
											}
										)
									)}
								</>
							) : (
								<p style={{ color: "gray" }}>Aucune option disponible.</p>
							)}
							<hr />
						</li>
					</ul>

					<ul className="list-group">
						<li className="list-group">
							<h5>Expérience</h5>
							{Object.keys(counts.initialExperienceCounts).length > 0 ? (
								<>
									{Object.keys(counts.initialExperienceCounts).length > 4 ? (
										<div className="scrollbar scrollbar-pink bordered-pink thin">
											<div className="force-overflow">
												{Object.entries(counts.initialExperienceCounts).map(
													([value, count]) => {
														const isChecked =
															filterOptions.experience.includes(value);
														return (
															<div
																key={value}
																className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
															>
																<div
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	{value.charAt(0).toUpperCase() +
																		value.slice(1) +
																		" ans"}
																	<span
																		style={{
																			opacity: 0.5,
																			color: "gray",
																			marginLeft: "5px",
																		}}
																	>
																		({count})
																	</span>
																</div>
																<input
																	type="checkbox"
																	className="form-check-input"
																	value={value}
																	checked={isChecked}
																	onChange={(e) =>
																		handleFilterChange("experience", value)
																	}
																/>
															</div>
														);
													}
												)}
											</div>
										</div>
									) : (
										Object.entries(counts.initialExperienceCounts).map(
											([value, count]) => {
												const isChecked =
													filterOptions.experience.includes(value);
												return (
													<div
														key={value}
														className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
													>
														<div
															style={{ display: "flex", alignItems: "center" }}
														>
															{value.charAt(0).toUpperCase() +
																value.slice(1) +
																" ans"}
															<span
																style={{
																	opacity: 0.5,
																	color: "gray",
																	marginLeft: "5px",
																}}
															>
																({count})
															</span>
														</div>
														<input
															type="checkbox"
															className="form-check-input"
															value={value}
															checked={isChecked}
															onChange={(e) =>
																handleFilterChange("experience", value)
															}
														/>
													</div>
												);
											}
										)
									)}
								</>
							) : (
								<p style={{ color: "gray" }}>Aucune option disponible.</p>
							)}
							<hr />
						</li>
					</ul>

					{/* Compétence */}
					<ul className="list-group">
						<li className="list-group">
							<h5>Compétence</h5>
							{Object.keys(counts.initialCompetenceCounts).length > 0 ? (
								<>
									{Object.keys(counts.initialCompetenceCounts).length > 4 ? (
										<div className="scrollbar scrollbar-pink bordered-pink thin">
											<div className="force-overflow">
												{Object.entries(counts.initialCompetenceCounts).map(
													([value, count]) => {
														const isChecked =
															filterOptions.competence.includes(value);
														return (
															<div
																key={value}
																className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
															>
																<div
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	{value.charAt(0).toUpperCase() +
																		value.slice(1)}
																	<span
																		style={{
																			opacity: 0.5,
																			color: "gray",
																			marginLeft: "5px",
																		}}
																	>
																		({count})
																	</span>
																</div>
																<input
																	type="checkbox"
																	className="form-check-input"
																	value={value}
																	checked={isChecked}
																	onChange={(e) =>
																		handleFilterChange("competence", value)
																	}
																/>
															</div>
														);
													}
												)}
											</div>
										</div>
									) : (
										Object.entries(counts.initialCompetenceCounts).map(
											([value, count]) => {
												const isChecked =
													filterOptions.competence.includes(value);
												return (
													<div
														key={value}
														className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
													>
														<div
															style={{ display: "flex", alignItems: "center" }}
														>
															{value.charAt(0).toUpperCase() + value.slice(1)}
															<span
																style={{
																	opacity: 0.5,
																	color: "gray",
																	marginLeft: "5px",
																}}
															>
																({count})
															</span>
														</div>
														<input
															type="checkbox"
															className="form-check-input"
															value={value}
															checked={isChecked}
															onChange={(e) =>
																handleFilterChange("competence", value)
															}
														/>
													</div>
												);
											}
										)
									)}
								</>
							) : (
								<p style={{ color: "gray" }}>Aucune option disponible.</p>
							)}
							<hr />
						</li>
					</ul>

					{/* Langue */}
					<ul className="list-group">
						<li className="list-group">
							<h5>Langue</h5>
							{Object.keys(counts.initialLangueCounts).length > 0 ? (
								<>
									{Object.keys(counts.initialLangueCounts).length > 4 ? (
										<div className="scrollbar scrollbar-pink bordered-pink thin">
											<div className="force-overflow">
												{Object.entries(counts.initialLangueCounts).map(
													([value, count]) => {
														const isChecked =
															filterOptions.langue.includes(value);
														return (
															<div
																key={value}
																className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
															>
																<div
																	style={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	{value.charAt(0).toUpperCase() +
																		value.slice(1)}
																	<span
																		style={{
																			opacity: 0.5,
																			color: "gray",
																			marginLeft: "5px",
																		}}
																	>
																		({count})
																	</span>
																</div>
																<input
																	type="checkbox"
																	className="form-check-input"
																	value={value}
																	checked={isChecked}
																	onChange={(e) =>
																		handleFilterChange("langue", value)
																	}
																/>
															</div>
														);
													}
												)}
											</div>
										</div>
									) : (
										Object.entries(counts.initialLangueCounts).map(
											([value, count]) => {
												const isChecked = filterOptions.langue.includes(value);
												return (
													<div
														key={value}
														className="list-group-item list-group-item-me d-flex justify-content-between align-items-center"
													>
														<div
															style={{ display: "flex", alignItems: "center" }}
														>
															{value.charAt(0).toUpperCase() + value.slice(1)}
															<span
																style={{
																	opacity: 0.5,
																	color: "gray",
																	marginLeft: "5px",
																}}
															>
																({count})
															</span>
														</div>
														<input
															type="checkbox"
															className="form-check-input"
															value={value}
															checked={isChecked}
															onChange={(e) =>
																handleFilterChange("langue", value)
															}
														/>
													</div>
												);
											}
										)
									)}
								</>
							) : (
								<p style={{ color: "gray" }}>Aucune option disponible.</p>
							)}
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default FilterComponent;
