import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


import Port from './Port';
import Comments from './Comments';
import PortTable from './PortTable';

class Host extends Component{
	createPort(port) {
		return (<Port port={port.port} protocol={port.protocol} service={port.service} key={port._id}/>);
	}
	createPorts(ports) {
		return ports.map(this.createPort);
	}
	handleClick(ip, event) {
		event.stopPropagation();
		this.props.history.push("/Host/"+ip);
	}

	render() {
		return (
			<div className="hostContainer card" onClick={this.handleClick.bind(this, this.props.ip)}>
				<h5 className="card-title">{this.props.ip}</h5>
				<h5 className="card-subtitle">{this.props.hostname}</h5>
				{
					(this.props.comments.length > 0) && <i className="fas fa-comment"></i>
				}
				
				{
					(this.props.openPorts.length > 0) && <PortTable openPorts={this.props.openPorts} ip={this.props.ip} summary={this.props.summary}/>
				}
				{
					!this.props.summary && <Comments commentArray={this.props.comments} commentType="hosts" scope={this.props.ip} />
				}
			</div>
		);
	}

}
export default withRouter(Host);