import React from "react";

export default class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		const q = this.state.value + ' site:blog.andrewshell.org';
		const url = "https://duckduckgo.com/?q=" + encodeURIComponent(q);
		window.location.href = url;
		event.preventDefault();
	}

	render() {
		return (
			<form
				className="m-4 flex w-auto"
				onSubmit={this.handleSubmit}
			>
				<input
					type="text"
					name="q"
					className="flex-grow rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-500 bg-white"
					value={ this.state.value }
					onChange={ this.handleChange }
				/>
				<button
					type="submit"
					className="flex-none px-8 rounded-r-lg bg-green-700 text-white font-bold p-4 uppercase border-green-900 border-t border-b border-r"
				>Search</button>
			</form>
		);
	}
}
