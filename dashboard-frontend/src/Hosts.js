import React, { Component } from 'react';

import Host from './Host';

class Hosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hosts: [],
            selectedHost: null
        }
        /*
        if(typeof(this.props.match.params.ip) !== 'undefined') {
            this.state.selectedHost = this.props.match.params.ip;
        }
        */
      }
    
    componentDidMount() {
        this.interval = setInterval(() => fetch(window.API_URL+'/hosts', {credentials: 'include'})
          .then(response => response.json())
          .then(data => this.setState({hosts: data})),1000);
          
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    chooseHost = event => {
        this.setState({selectedHost: event.target.value});
    }
    
    render() {
		return (
            <div>
               <h1>Hosts!</h1>
                <select onChange={this.chooseHost}>
                    {
                        this.state.hosts.map((host, index) => (
                            <option value={index} key={index}>{host.ip}</option>
                        ))
                    }
                </select>
                {
                    this.state.selectedHost && <Host hostname={this.state.hosts[this.state.selectedHost].hostname} ip={this.state.hosts[this.state.selectedHost].ip} openPorts={this.state.hosts[this.state.selectedHost].openPorts} comments={this.state.hosts[this.state.selectedHost].comments} key={this.state.hosts[this.state.selectedHost]._id} summary={false}/>

                }
            </div>

		);
	}
}

export default Hosts;