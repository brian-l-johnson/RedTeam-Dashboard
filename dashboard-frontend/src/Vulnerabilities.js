import React, { Component } from 'react';
import VulnerabilityModal from './VulnerabilityModal';

class Vulnerabilities extends Component {
    toggleDetected = event => {
        let update = {"detected": event.target.checked};

        fetch(window.API_URL+"/vulnerability/"+this.props.host+"/"+this.props.port+"/"+event.target.value, {
			method: "PUT",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(update)
        })
        .then(response => {
			response.json()
		})
    }
    toggleCurrent = event => {
        let update = {"current": event.target.checked};

        fetch(window.API_URL+"/vulnerability/"+this.props.host+"/"+this.props.port+"/"+event.target.value, {
			method: "PUT",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(update)
        })
        .then(response => {
			response.json()
		})
    }
    

    render() {
		return (
            <div className="commentsContainer">
                {
                    (this.props.vulnerabilities.length > 0) && (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Vulnerability</th>
                                    <th>Notes</th>
                                    <th>Severity</th>
                                    <th>Date</th>
                                    <th>Detected</th>
                                    <th>Current</th>
                                    <th>User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
        
                                this.props.vulnerabilities.map(vuln => (
                                    <tr key={vuln._id} > 
                                        <td>{vuln.vulnerability}</td>
                                        <td>{vuln.notes}</td>
                                        <td>{vuln.severity}</td>
                                        <td>{vuln.date}</td>
                                        <td>
                                            <input className="form-check-input" type="checkbox" checked={vuln.detected} name="detected" value={vuln._id} onChange={this.toggleDetected}/>
                                        </td>
                                        <td>
                                            <input className="form-check-input" type="checkbox" checked={vuln.current} name="current" value={vuln._id} onChange={this.toggleCurrent}/>
                                        </td>
                                        <td>{vuln.user}</td>
                                    </tr>
                                ))
                                
                                }
                            </tbody>
                        </table>
                    )
                }
                
               
                <VulnerabilityModal host={this.props.host} port={this.props.port}/>
            </div>
		);
	}
}

Vulnerabilities.defaultProps = {
    commentArray : []
}

export default Vulnerabilities;