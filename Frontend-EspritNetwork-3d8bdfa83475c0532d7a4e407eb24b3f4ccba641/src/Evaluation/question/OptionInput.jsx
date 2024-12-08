export function OptionInput({ option, onChange, onRemove, onToggleCorrect }) {
	return (
		<li className="d-flex align-items-center">
			<input
				type="text"
				className="form-control"
				value={option.option}
				onChange={onChange}
			/>
			<span type="button" onClick={onRemove}>
				<i className="fas fa-trash mx-3"></i>
			</span>{" "}
			<span type="button" onClick={onToggleCorrect}>
				<i className={`fas fa-check${option.isCorrect ? " checked" : ""}`}></i>
			</span>
		</li>
	);
}
