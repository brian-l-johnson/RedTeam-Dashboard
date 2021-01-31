import React, { Component } from 'react';
import ActionTarget from './ActionTarget';
import {sortHosts} from './utils';


class Actions extends Component{
	constructor(props) {
        super(props);
        this.state = {
			teams: [],
			hosts: [],
			vulns: [],
			note: ""
        }
        /*
        if(typeof(this.props.match.params.ip) !== 'undefined') {
            this.state.selectedHost = this.props.match.params.ip;
        }
        */
    }
    
    componentDidMount() {
        fetch(window.API_URL+'/teams', {credentials: 'include'})
          .then(response => response.json())
          .then(data => this.setState({teams: data}));
		
		fetch(window.API_URL+'/hosts', {credentials: 'include'})
		  .then(response => response.json())
		  .then(data => this.setState({hosts: data}));
    }
    componentWillUnmount() {
        clearInterval(this.interval);
	}
	addVulnInstance = data => {
		console.log(data);
		this.setState({vulns: [...this.state.vulns, data]});
		console.log(this.state.vulns);
	}
	submitAction = () => {
		console.log(this.state.note);
		this.state.vulns.map(vuln => {
			console.log(vuln);
			return vuln;
		});
	}
	updateNote = event => {
		this.setState({note: event.target.value})
	}
	
	render() {
		return (
			<div>
				Action History
				<table>
					<thead>
						<tr>
							<th>
								Time
							</th>
							<th>
								Hacker
							</th>
							<th>
								Description
							</th>
							{
								this.state.teams.map(team => (
									<th key={team.name}>
										Team {team.name}
									</th>
								))
							}
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{new Date().toUTCString()}
							</td>
							<td>
								{window.user}
							</td>
							<td>
								<input type="text" className="form-text form-control" id="actionNote" placeholder="Action notes..." onChange={this.updateNote}/>
							</td>
							{
								this.state.teams.map(team => (
									<td key={team._id}>	
										{}										{
											this.state.vulns.filter(vuln => {return vuln.team === team._id}).map(vuln => (
												<div>{vuln.host}:{vuln.port} {vuln.severity} ({vuln.notes})</div>
											))
										}		
										<ActionTarget hosts={sortHosts(this.state.hosts.filter(host => {return host.team === team._id}))} key={team._id} updateFunction={this.addVulnInstance}/>
									</td>
	
								))

							}
							<td>
								<button type="button" className="btn btn-primary" onClick={this.submitAction}>
									Submit
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

}
export default Actions;