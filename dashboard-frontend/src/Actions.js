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
			actions: [],
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
          .then(response => {
			  if(!response.ok) {
				  this.props.history.push('/Login');
			  }
			  return response.json()
		  })
          .then(data => this.setState({teams: data}));
		
		fetch(window.API_URL+'/hosts', {credentials: 'include'})
		  .then(response => {
			  if(!response.ok) {
				  this.props.history.push('/Login');
			  }
			  return response.json()
		  })
		  .then(data => this.setState({hosts: data}));
		
		this.interval = setInterval(() => fetch(window.API_URL+'/actions', {credentials: 'include'})
		  .then(response => {
			  if(!response.ok) this.props.history.push('/Login');
			  return response.json();
		  })
		  .then(data => this.setState({actions: data})),1000);

		
    }
    componentWillUnmount() {
        clearInterval(this.interval);
	}
	addVulnInstance = data => {
		console.log("data for function:");
		console.log(data);
		this.setState({vulns: [...this.state.vulns, data]});
		console.log(this.state.vulns);
	}
	submitAction = () => {
		console.log(this.state.note);
		fetch(window.API_URL+'/actions', {
			method: "POST",
			credentials: 'include',
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify({
				description: this.state.note,
				vulnerabilities: this.state.vulns
			})
		})
		.then(response => {
			if(!response.ok) {
				alert("got an error: "+response.statusText);
			}
			return response.json();
		})
		.then(data => {
			console.log(data);
			document.getElementById('actionNote').value = "";
			this.setState({vulns: []});
		})
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
										{
											this.state.vulns.filter(vuln => {return vuln.team === team._id}).map(vuln => (
												<div>{vuln.host}:{vuln.port} {vuln.severity} ({vuln.notes})</div>
											))
										}		
										<ActionTarget hosts={sortHosts(this.state.hosts.filter(host => {return host.team === team._id}))} key={team._id} team={team._id} updateFunction={this.addVulnInstance}/>
									</td>
	
								))

							}
							<td>
								<button type="button" className="btn btn-primary" onClick={this.submitAction}>
									Submit
								</button>
							</td>
						</tr>
						{
							this.state.actions.map(action => (
								<tr>
									<td>{action.date}</td>
									<td>{action.hacker}</td>
									<td>{action.description}</td>
									{
										this.state.teams.map(team => (
											<td>
												{
													<ul>
														{
															action.vulnerabilities.filter(vuln => {return vuln.team === team._id}).map(vuln => (
																<li>
																	{vuln.ip}:{vuln.port} - {vuln.severity} ({vuln.notes})
																</li>	
															))
														}

													</ul>
												}
											</td>
										))
									}
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		);
	}

}
export default Actions;