import React, { Component } from 'react';
import Vulnerabilities from './Vulnerabilities';

class PortTable extends Component{
	render() {
		return (
            <div className="card">
                <div className="card-header">
                    Open Ports
                </div>
                <div className="card-body">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Port</th>
                                <th>Service</th>
                                <th>Vulns</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.openPorts.map(port => (
                                    <tr key={port._id}>
                                        <td>{port.port}/{port.protocol}</td>
                                        <td>{port.service}</td>
                                        <td>
                                            {
                                                this.props.summary ? (
                                                    (port.vulnerabilities.length > 0) && <i className="fas fa-bug"></i>
                                                ) : (
                                                    <Vulnerabilities port={port.port} vulnerabilities={port.vulnerabilities} host={this.props.ip}/>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))

                            }
                        </tbody>
                    </table>
                </div>
            </div>
		);
	}

}
export default PortTable;