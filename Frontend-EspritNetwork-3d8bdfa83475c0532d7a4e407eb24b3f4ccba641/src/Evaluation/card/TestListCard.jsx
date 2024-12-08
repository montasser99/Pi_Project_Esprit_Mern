import { TestCard } from "./TestCard";

export function TestListCard({ tests }) {
	return (
		<div className="row">
			<div className="col-3 py-3">
				<p className="n-title">Résultats</p>
			</div>
			<div className="col-9 py-3">
				<hr />
			</div>
			{tests.map((test, index) => (
				<div key={index} className="col-12 py-2">
					<TestCard {...test} />
				</div>
			))}
		</div>
	);
}
