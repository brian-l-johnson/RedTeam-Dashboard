import React, { Component } from 'react';

class ActionTarget extends Component{
	constructor(props) {
        super(props);
        this.state = {
			selectedHost: 0,
			selectedPort: 0
        }
        /*
        if(typeof(this.props.match.params.ip) !== 'undefined') {
            this.state.selectedHost = this.props.match.params.ip;
        }
        */
	}
	
	handleHostUpdate = event => {
		this.setState({selectedHost: event.target.value})
	}

	handlePortUpdate = event => {
		this.setState({selectedPort: event.target.value})
	}
	toggleVulnModal = () => {
		console.log("in vuln toggle");
		this.setState({isOpen: !this.state.isOpen});
	}
	submitVulnerability = event => {
		event.preventDefault();
		console.log(event.target);
		this.props.updateFunction({
			team: this.props.hosts[event.target.host.value].team,
			host: this.props.hosts[event.target.host.value].ip,
			port: this.props.hosts[event.target.host.value].openPorts[event.target.port.value].port,
			severity: event.target.newSeverity.value,
			notes: event.target.newNotes.value
		});
		this.toggleVulnModal();
	}

	render() {
		return (
			<div>
				<button type="button" className="btm btn-primary" data-toggle="modal" data-target="#addVulnModel" onClick={this.toggleVulnModal}>Add Vulnerability</button>
				{
					this.state.isOpen && (
						<div className="modal fade show" style={{display: "block", "backgroundColor": "rgba(0,0,0,0.5)"}} id="addVulnModal" tabIndex="-1" role="dialog" aria-labelledby="addVulnModelTitle" aria-hidden="true">
							<div className="modal-dialog modal-dialog-centered model-lg" role="document">
								<div className="modal-content">
									<div className="modal-header">
										<h5 className="modal-title" id="addVulnModalTitle">Add Vulnerability</h5>
										<button type="button" className="close" data-dismiss="modal" aria-label="close">
											<span aria-hidden="true" onClick={this.toggleVulnModal}>&times;</span>
										</button>
									</div>
									<div className="modal-body">
										<form onSubmit={this.submitVulnerability}>

											<select onChange={this.handleHostUpdate} id="host">
											{
												this.props.hosts.map((host, index) => (
													<option key={host.id} id={host.ip} value={index}>{host.ip}</option>
												))
											}
											</select>
											<select id="port">
											{
												typeof(this.props.hosts[this.state.selectedHost]) !== 'undefined' && this.props.hosts[this.state.selectedHost].openPorts.map((port, index) => (
													<option key={port.port} id={port.port} value={index}>{port.port}</option>
												))
											}
											</select>
											<select id="newSeverity">
												<option value="Admin Access">Admin Access</option>
												<option value="Regular User Access">Regular User Access</option>
												<option value="Arbitrary File Write">Arbitrary File Write</option>
												<option value="Arbitrary File Read">Arbitrary File Read</option>
												<option value="Database Read">Database Read</option>
												<option value="Database Write">Database Write</option>
												<option value="Information Disclosure">Information Disclosure</option>
												<option value="Other">Other (note details in notes section)</option>
											</select>
											<input type="text" className="form-text form-control" id="newNotes" placeholder="Vulnerability notes..." />
											<button type="submit" className="btn btn-primary">Add Vulnerability</button>
										</form>

									</div>
								</div>
							</div>
						</div>
					)
				}

			</div>
		);
	}

}
export default ActionTarget;