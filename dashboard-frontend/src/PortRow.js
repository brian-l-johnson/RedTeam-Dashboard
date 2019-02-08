import React, { Component } from 'react';
import Vulnerabilities from './Vulnerabilities';
import HistoryModal from './HistoryModal';

class PortTable extends Component{
    constructor(props) {
        super(props);
        let currentVuln = false;
        console.log(this.props.port);
        if(this.props.port.state === "open") {
            for(let i = 0; i<this.props.port.vulnerabilities.length; i++) {
                //console.log(this.props.port.vulnerabilities[i]);
                if(this.props.port.vulnerabilities[i].current) {
                    currentVuln = true;
                    console.log("hacked");
                }
            }
        }
    	this.state = {
			hacked: currentVuln
        }
	}

	render() {
		return (
            <tr key={this.props.port._id} className={[this.props.port.state, this.state.hacked?("hacked"):("clean")].join(' ')}>
                <td>{this.props.port.port}/{this.props.port.protocol} {(this.props.port.history.length > 0) && <HistoryModal history={this.props.port.history} />}</td>
                <td>{this.props.port.service}</td>
                <td>
                    {
                        this.props.summary ? (
                            ((this.props.port.vulnerabilities.length > 0) && <i className="fas fa-bug"></i>)
                        ) : (
                            <Vulnerabilities port={this.props.port.port} vulnerabilities={this.props.port.vulnerabilities} host={this.props.ip}/>
                        )
                    }
                </td>
            </tr>
		);
	}

}
export default PortTable;