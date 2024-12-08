import { NavLink } from "react-router-dom";
import "../Evaluation.css";
export function FilterCard({ title, options, onFilterChange }) {
	const handleFilterChange = (value) => {
		onFilterChange(value);
	};

	return (
		<div className="py-1 n-card">
			<NavLink to="" className="filter-link">
				<h5 className="n-test">{title}</h5>
			</NavLink>
			<div className="py-2 n-card">
				<div className="card n-card">
					<div className="d-flex justify-content-start">
						<ul className="nav flex-column">
							{options.map((option) => (
								<li className="nav-link" key={option}>
									<NavLink
										to="#"
										className="filter-link"
										onClick={() => handleFilterChange(option)}
									>
										<h3 className="n-test">{option}</h3>
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
