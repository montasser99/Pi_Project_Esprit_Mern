export function Question({
	count,
	question,
	questions,
	setCount,
	navigateToQuestion,
}) {
	const nextQuestion = () => {
		const nextQuestionIndex = count + 1;
		if (nextQuestionIndex < questions.length) {
			setCount(nextQuestionIndex);
			navigateToQuestion(questions[nextQuestionIndex]._id);
		}
	};

	const previousQuestion = () => {
		const previousQuestionIndex = count - 1;
		if (previousQuestionIndex >= 0) {
			setCount(previousQuestionIndex);
			navigateToQuestion(questions[previousQuestionIndex]._id);
		}
	};

	return (
		<div className="question">
			<div className="form-check">
				<h2>Question N° {count + 1}</h2>
				<p>{question.titre}</p>
				<div className="options py-5">
					<div className="row">
						{question.options.map((item, index) => (
							<div className="col-4" key={index}>
								<div className="card">
									<div className="card-body">
										<input
											type="checkbox"
											checked={item.isCorrect ? true : false}
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
			<div className="row">
				<div className="d-flex justify-content-between align-items-end w-100">
					<button className="btn btn-secondary" onClick={previousQuestion}>
						Précédent
					</button>
					<button className="btn btn-secondary" onClick={nextQuestion}>
						Suivant
					</button>
				</div>
			</div>
		</div>
	);
}
