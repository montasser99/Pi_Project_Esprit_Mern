import "../Selection.css";
const CardCollection = ({
	title,
	membersCount,
	onAddMember,
	onDeleteCollection,
}) => {
	return (
		<div className="services icon-box mx-3 ">
			<div className="collection-header">
				<h4>{title}</h4>
				<div className="collection-icons">
					<span onClick={onAddMember} className="mx-4">
						<i className="fas fa-plus"></i>
					</span>
					<span onClick={onDeleteCollection}>
						<i className="fas fa-trash"></i>
					</span>
				</div>
			</div>
			<p>{`${membersCount} ${membersCount === 1 ? "member" : "members"}`}</p>
		</div>
	);
};
export default CardCollection;
