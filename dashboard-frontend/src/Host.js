import React, { Component } from 'react';

import Port from './Port';
import Comments from './Comments';

class Host extends Component{
	createPort(port) {
		return (<Port port={port.port} protocol={port.protocol} service={port.service} key={port._id}/>);
	}
	createPorts(ports) {
		return ports.map(this.createPort);
	}

	render() {
		return (
			<div className="hostContainer card">
				<h5 className="card-title">{this.props.ip}</h5>
				<h5 className="card-subtitle">{this.props.hostname}</h5>
				{
					(this.props.comments.length > 0) && <i className="fas fa-comment"></i>
				}
				
				{this.createPorts(this.props.openPorts)}
				{
					!this.props.summary && <Comments commentArray={this.props.comments} commentType="hosts" scope={this.props.ip} />
				}
			</div>
		);
	}

}
export default Host;