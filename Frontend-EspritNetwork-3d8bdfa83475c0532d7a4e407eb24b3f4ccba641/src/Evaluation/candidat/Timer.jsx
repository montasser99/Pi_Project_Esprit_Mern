import { Component } from "react";

class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ch: props.duree,
			timer: null,
		};
	}

	componentDidMount() {
		const { ch } = this.state;
		let timeLeft = ch * 60;

		const timer = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft--;
				const minutes = Math.floor(timeLeft / 60);
				const seconds = timeLeft % 60;
				this.setState({
					ch: `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`,
				});
			} else {
				clearInterval(this.state.timer);
			}
		}, 1000);

		this.setState({ timer });
	}

	componentWillUnmount() {
		clearInterval(this.state.timer);
	}

	render() {
		const { ch } = this.state;

		return (
			<div style={{ backgroundColor: "#fff" }}>
				<div className=" py-3 mx-5 flex d-flex justify-content-between ">
					<h2 className="text-danger">Esprit NetWork</h2>
					<h1>
						<span className="badge text-danger">00:{ch}</span>
					</h1>
				</div>
			</div>
		);
	}
}

export default Timer;
