import React, { Component } from 'react';
import Vulnerabilities from './Vulnerabilities';
import PortRow from './PortRow';

class PortTable extends Component{
	render() {
		return (
            <div className="card p-0">
                <div className="card-header">
                    Open Ports
                </div>
                <div className="card-body p-0">
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
                                    <PortRow port={port} summary={this.props.summary} ip={this.props.ip} key={port._id}/>
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