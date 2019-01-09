import React, { Component } from 'react';

import Host from './Host';

class Team extends Component{
	constructor(props) {
    	super(props);
    	this.state = {
    		"hosts": []
    	}
  	}

	componentDidMount() {
    	fetch('http://127.0.0.1:3001/hosts')
      		.then(response => response.json())
      		.then(data => this.setState({hosts: data}));
  	}

  	createHost(host) {
  		return (<Host hostname={host.hostname} ip={host.ip} openPorts={host.openPorts} key={host._id} />);
  	}

  	createHosts(hosts) {
  		return hosts.map(this.createHost);
  	}

	render() {
		return (
			<div className="teamContainer shadow p-3 mb-5 bg-white rounded card">
				<h1 class="card-title">{this.props.name}</h1>
				<h2 class="card-subtitle">{this.props.range}</h2>
				{this.createHosts(this.state.hosts)}
				<br/>
			</div>
		);
	}

}
export default Team;