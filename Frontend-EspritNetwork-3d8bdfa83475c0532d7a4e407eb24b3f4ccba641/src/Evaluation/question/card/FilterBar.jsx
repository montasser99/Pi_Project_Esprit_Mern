import { BsSearch } from "react-icons/bs";

const FilterBar = ({ onFilterChange }) => {
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		onFilterChange(name, value);
	};

	return (
		<div className="d-flex flex-row">
			<div className="container">
				<div className="row">
					<div className="d-flex flex-row">
						<div className="input-group ">
							<span className="input-group-text">
								<BsSearch />
							</span>
							<input
								type="text"
								className="form-control mx-2 py-2 red-hover"
								placeholder="Search candidates "
								style={{ height: "50px", width: "600px" }}
								onChange={(e) => onFilterChange("search", e.target.value)}
							/>
							<select
								className="form-select mx-2 py-1 red-hover"
								name="domaine"
								onChange={handleFilterChange}
							>
								<option value="">Global</option>
								<option value="Web">Web</option>
								<option value="Logiciel">Logiciel</option>
								{/* Ajoutez d'autres domaines au besoin */}
							</select>

							<select
								className="form-select mx-2 py-1 red-hover"
								name="categorie"
								onChange={handleFilterChange}
							>
								<option value="">All</option>
								<option value="Frontend">Frontend</option>
								<option value="Backend">Backend</option>
								{/* Ajoutez d'autres catégories au besoin */}
							</select>

							<button className="btn btn-danger py-1" type="button">
								Search
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterBar;
