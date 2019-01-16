import React, { Component } from 'react';

class PortTable extends Component{
	render() {
		return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Port</th>
                        <th>Service</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.openPorts.map(port => (
                            <tr key={port._id}>
                                <td>{port.port}/{port.protocol}</td>
                                <td>{port.service}</td>
                            </tr>
                        ))

                    }
                </tbody>
            </table>
		);
	}

}
export default PortTable;