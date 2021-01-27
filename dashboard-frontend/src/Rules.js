import React, { Component } from 'react';

import Rule from './Rule';

class Rules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exploitOptions : [],
            rules : []
        }
        /*
        if(typeof(this.props.match.params.ip) !== 'undefined') {
            this.state.selectedHost = this.props.match.params.ip;
        }
        */
      }
    
    componentDidMount() {
        this.interval = setInterval(() => fetch(window.API_URL+'/exploit/rule', {credentials: 'include'})
          .then(response => response.json())
          .then(data => this.setState({rules: data})),1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    handleSubmit = event => {
        alert("in handle submit");
        event.preventDefault();
        let newRule = {};
        let newRuleForm = document.getElementById('newRuleForm');
        newRule['port'] = newRuleForm.port.value;
        newRule['exploit'] = newRuleForm.exploit.value;

        let newExploitOptions = {};
        this.state.exploitOptions.map(eo => {
            newExploitOptions[eo.key] = eo.value;
        })
        newRule['exploitOptions'] = newExploitOptions;

        console.log(newRule);

        fetch(window.API_URL+'/exploit/rule', {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newRule)
        })
        .then(response => response.json());
    }

    addKeyValue = event => {
        let keyElement = document.getElementById('key');
        let valueElement = document.getElementById('value');

        
        let eo = this.state.exploitOptions;
        eo.push({key: keyElement.value, value: valueElement.value});
        this.setState({exploitOptions: eo});
        console.log(this.state.exploitOptions);
        keyElement.value = "";
        valueElement.value = "";

    }
    
    /*
    chooseHost = event => {
        this.setState({selectedHost: event.target.value});
    }
    */
    render() {
		return (
            <div>

                {
                    //this.state.selectedHost && <Host hostname={this.state.hosts[this.state.selectedHost].hostname} ip={this.state.hosts[this.state.selectedHost].ip} openPorts={this.state.hosts[this.state.selectedHost].openPorts} comments={this.state.hosts[this.state.selectedHost].comments} key={this.state.hosts[this.state.selectedHost]._id} summary={false}/>
                    <form id="newRuleForm" onSubmit={this.handleSubmit}>
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>Port</th>
                                <th>Exploit</th>
                                <th>Options</th>
                                <th>Enabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.rules.map(rule => (
                                    <Rule key={rule._id} rule={rule} />
                                ))
                            }
                            
                            <tr>
                                    <td>
                                        <input type="text" className="form-text" placeholder="Port" id="port"/>
                                    </td>
                                    <td>
                                        <input type="text" className="form-text" placeholder="Exploit, fully qualified" id="exploit"/>
                                    </td>
                                    <td>
                                        <div id="exploitOptions">
                                            {this.state.exploitOptions.map(o => (
                                                <div key={o.key}> {o.key} : {o.value} </div>
                                            ))}
                                        </div>
                                        <input type="text" className="form-text" placeholder="key" id="key"/>:<input type="text" className="form-text" placeholder="value" id="value"/>
                                        <button type="button" className="btn" onClick={this.addKeyValue}>New key/value</button>
                                    </td>
                                    <td>
                                        <input type="checkbox" checked="true" id="enabled" className="form-check-input"/>
                                    </td>
                            </tr>
                            <tr>
                                <td></td><td></td><td></td><td><button type="submit" className="btn btn-primary">Submit</button></td>
                            </tr>
                        </tbody>
                    </table>
                    </form>
                }
            </div>
        

		);
	}
}

export default Rules;