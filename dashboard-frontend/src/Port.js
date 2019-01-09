import React, { Component } from 'react';

class Port extends Component{
	render() {
		return (
			<div className="portContainer">
				{this.props.port}/{this.props.protocol} : {this.props.service}
			</div>
		);
	}

}
export default Port;