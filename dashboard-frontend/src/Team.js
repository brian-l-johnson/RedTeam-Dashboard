import React, { Component } from 'react';

import Host from './Host';

class Team extends Component{
	constructor(props) {
    	super(props);
    	this.state = {
			"hosts": [],
			"team": {}
		}
		if(typeof(this.props.match) !== 'undefined') {
			this.state.id = this.props.match.params.id;
		}
		else {
			this.state.id = this.props.id;
		}
  	}

	componentDidMount() {
		this.teamInterval = setInterval(() => fetch('http://127.0.0.1:3001/teams/'+this.state.id)
		.then(response => response.json())
		.then(data => this.setState({team: data})),5000);


    	this.hostsInterval = setInterval(() => fetch('http://127.0.0.1:3001/hosts/team/'+this.state.id)
      		.then(response => response.json())
      		.then(data => this.setState({hosts: data})), 5000);
	}
	componentWillUnmount() {
		clearInterval(this.teamInterval);
		clearInterval(this.hostsInterval);
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
				<h1 className="card-title">Name: {this.state.team.name}</h1>
				<h2 className="card-subtitle">Range: {this.state.team.range}</h2>
				<br/>
				{
					this.state.hosts.map(host => (
						<Host hostname={host.hostname} ip={host.ip} openPorts={host.openPorts} key={host._id} />	
					))
				}
			</div>
		);
	}

}
export default Team;