import React, { Component } from 'react';

class Error extends Component{
	render() {
		return (
			<div className="alert alert-danger">
				Error: {this.props.message}
			</div>
		);
	}

}
export default Error;