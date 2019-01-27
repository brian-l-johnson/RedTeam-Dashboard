import React, { Component } from 'react';

class Vulnerabilities extends Component {
    submitVulnerability = event => {
        event.preventDefault();
        let newVuln = {};
        newVuln['vulnerability'] = event.target.newVulnerability.value;
        newVuln['notes'] = event.target.newNotes.value;
        newVuln['severity'] = event.target.newSeverity.value;
        newVuln['user'] = "me";

        fetch(window.API_URL+'/vulnerability/'+this.props.host+"/"+this.props.port, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newVuln)
        })
        .then(response => response.json())
        .then(event.target.newVulnerability.value = "")
        .then(event.target.newNotes.value = "");
    }
    
    render() {
		return (
            <div className="commentsContainer">
                 <form onSubmit={this.submitVulnerability}>
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
                                <td>{vuln.detected}</td>
                                <td>{vuln.current}</td>
                                <td>{vuln.user}</td>
                            </tr>
                        ))
                        
                        }
                        <tr>
                            <td><input type="text" className="form-text form-control" id="newVulnerability" placeholder="Vulnerability title..." /></td>
                            <td><input type="text" className="form-text form-control" id="newNotes" placeholder="Vulnerability notes..." /></td>
                            <td>
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
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
               
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
		);
	}
}

Vulnerabilities.defaultProps = {
    commentArray : []
}

export default Vulnerabilities;