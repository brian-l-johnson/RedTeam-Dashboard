import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import Host from './Host';
import Comments from './Comments';

class Team extends Component{
	constructor(props) {
    	super(props);
    	this.state = {
			"hosts": [],
			"team": {"comments": []}
		}
		if(typeof(this.props.id) !== 'undefined') {
			this.state.id = this.props.id;
		}
		else {
			this.state.id = this.props.match.params.id;
		}
		if(typeof(this.props.summary !== 'undefined') && this.props.summary === true) {
			this.state.summary = true;
		}
		else {
			this.state.summary = false;
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
	
	handleClick(teamName) {
		console.log(teamName);
		this.props.history.push("/team/"+teamName);
	}


	render() {
		return (
			<div className="teamContainer shadow p-3 mb-5 bg-white rounded card" onClick={this.handleClick.bind(this, this.state.id)}>
				<h1 className="card-title">Name: {this.state.team.name}</h1>
				<h2 className="card-subtitle">Range: {this.state.team.range}</h2>
				{
					(this.state.summary && (this.state.team.comments.length > 0)) && <i className="fas fa-comment"></i>
				}
				<br/>
				{
					this.state.hosts.map(host => (
							host.state === "up" && <Host hostname={host.hostname} ip={host.ip} openPorts={host.openPorts} key={host._id} />
					))
				}
				{
					!this.state.summary && <Comments commentArray={this.state.team.comments} commentType="teams" scope={this.state.team._id}/>
					
				}
			</div>
		);
	}

}
export default withRouter(Team) ;