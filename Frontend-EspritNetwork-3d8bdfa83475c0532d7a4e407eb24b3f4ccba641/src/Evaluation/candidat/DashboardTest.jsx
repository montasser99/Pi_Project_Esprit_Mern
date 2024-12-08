import { Navbar } from "../../Home/Navbar";
import "../Evaluation.css";
export function DashboardTest() {
	return (
		<>
			
			<Navbar />
			<section id="team" className="team section-bg py-5 ">
				<div className="container py-5" data-aos="fade-up">
					<div className="section-title">
						<h2 className="text-black">Vos résultats des tests passés</h2>
						<p>
							Magnam dolores commodi suscipit. Necessitatibus eius consequatur
							ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
							quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
							Quia fugiat sit in iste officiis commodi quidem hic quas.
						</p>
					</div>
					<div className="row ">
						<div
							className="col-lg-6 mt-4"
							data-aos="zoom-in"
							data-aos-delay={100}
						>
							<div className="member d-flex align-items-start">
								<div style={{ fontSize: "4em", color: "green" }}>55%</div>
								<div className="member-info">
									<h4>Test React JS </h4>
									<span> Pour l&apos;offre : </span>
									<p>
										Explicabo voluptatem mollitia et repellat qui dolorum quasi
									</p>
								</div>
							</div>
						</div>{" "}
						<div
							className="col-lg-6 mt-4"
							data-aos="zoom-in"
							data-aos-delay={100}
						>
							<div className="member d-flex align-items-start">
								<div style={{ fontSize: "4em", color: "green" }}>55%</div>
								<div className="member-info">
									<h4>Test React JS </h4>
									<span> Pour l&apos;offre : </span>
									<p>
										Explicabo voluptatem mollitia et repellat qui dolorum quasi
									</p>
								</div>
							</div>
						</div>{" "}
						<div
							className="col-lg-6 mt-4"
							data-aos="zoom-in"
							data-aos-delay={100}
						>
							<div className="member d-flex align-items-start">
								<div style={{ fontSize: "4em", color: "green" }}>55%</div>
								<div className="member-info">
									<h4>Test React JS </h4>
									<span> Pour l&apos;offre : </span>
									<p>
										Explicabo voluptatem mollitia et repellat qui dolorum quasi
									</p>
								</div>
							</div>
						</div>{" "}
					</div>
				</div>
			</section>
		</>
	);
}
