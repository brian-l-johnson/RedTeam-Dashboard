import React, { Component } from 'react';

import Port from './Port';



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
				<h5 class="card-title">{this.props.ip}</h5>
				<h5 class="card-subtitle">{this.props.hostname}</h5>
				
				{this.createPorts(this.props.openPorts)}
			</div>
		);
	}

}
export default Host;