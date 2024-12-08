export function TestCard(props) {
	const test = props.test;
	return (
		<>
			<div className="card card-test ms-5 p-3">
				<div className="flex d-flex justify-content-between">
					<h4>
						Test.
						<span style={{ color: "#Cf0000" }}> {test.technologie} </span>
					</h4>
					<h4>
						<i className=" btn btn-outline-success fas fa-eye"></i>
						<button
							className="btn btn-outline"
							type="button"
							onClick={() => props.deleteTest(test._id)}
						>
							<i className="btn btn-outline-danger fas fa-trash  mx-3"></i>
						</button>
						<i className="btn btn-outline-secondary fas fa-edit"></i>
					</h4>
				</div>

				<h4 className=" ms-2">
					<strong style={{ color: "#800" }}>{test.domaine}.</strong>
					<strong style={{ color: "#527edb" }}>{test.categorie}</strong>
				</h4>
				<p>{test.description}</p>
				{/* <div className="details">
				<span>Date: {test.date}</span>
				<span>Score: {test.score}</span>
			</div> */}
			</div>
		</>
	);
}
