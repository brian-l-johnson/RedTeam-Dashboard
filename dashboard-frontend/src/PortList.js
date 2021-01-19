import React, { Component } from 'react';
import Host from './Host';

class User extends Component{
	constructor(props) {
        super(props);
        this.state = {
            ports: [],
			selectedPort: null,
			hosts: []
        }
	  }
	  
	componentDidMount() {
        this.interval = setInterval(() => fetch(window.API_URL+'/hosts/port/list', {credentials: 'include'})
          .then(response => response.json())
          .then(data => this.setState({ports: data})),1000);
          
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    choosePort = event => {
		this.setState({selectedPort: event.target.value});
		fetch(window.API_URL+'/hosts/port/'+event.target.value, {credentials: 'include'})
			.then(response => response.json() )
			.then(data => this.setState({hosts: data}));
    } 

	
	render() {
		return (
			<div>
				<div>
					Select Port: 
					<select onChange={this.choosePort}>
						{
							this.state.ports.map((port, index) => (
								<option value={port} key={index}>{port}</option>
							))
						}
					</select>
				</div>
				<div>
					{
						this.state.hosts.map(host => (
							<Host hostname={host.hostname} ip={host.ip} openPorts={host.openPorts} comments={host.comments} key={host._id} summary={this.state.summary}/>
						))
					}
				</div>
			</div>
		);
	}

}
export default User;