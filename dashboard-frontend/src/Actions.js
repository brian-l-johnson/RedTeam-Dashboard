import React, { Component } from 'react';

class User extends Component{
	constructor(props) {
        super(props);
        this.state = {
            teams: [],
        }
        /*
        if(typeof(this.props.match.params.ip) !== 'undefined') {
            this.state.selectedHost = this.props.match.params.ip;
        }
        */
    }
    
    componentDidMount() {
        this.interval = setInterval(() => fetch(window.API_URL+'/teams', {credentials: 'include'})
          .then(response => response.json())
          .then(data => this.setState({hosts: data})),1000);
          
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
	
	render() {
		return (
			<div>
				Action History
				<table>
					<thead>
						<tr>
							<th>
								Time
							</th>
							<th>
								Hacker
							</th>
							<th>
								Description
							</th>
						</tr>
					</thead>
				</table>
			</div>
		);
	}

}
export default ActionList;