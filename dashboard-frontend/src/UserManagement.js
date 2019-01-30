import React, { Component } from 'react';
import { checkPermissions} from './utils.js';
import User from './User';

class UserManagement extends Component{
	constructor(props) {
    	super(props);
    	this.state = {
			users: []
		}
	}

	componentDidMount() {
		checkPermissions("admin").then(
            result => {
              if(!result) {
                this.props.history.push('/Login');
              }
            }
        );
          
		this.interval = setInterval(() => fetch(window.API_URL+'/auth/users', {credentials: 'include'})
		  .then(response => {
			  if(!response.ok) this.props.history.push('/Login');
			  else return response.json();
		  })
		  .then(data => this.setState({users: data})),1000);
		  
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div className="container">
				<table className="table table-striped table-sm">
					<thead>
						<tr>
							<th>Email</th>
							<th>Handle</th>
							<th>Active</th>
							<th>Permissions</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.users.map(user => (
								<User key={user._id} user={user} />
							))
						}
					</tbody>
				</table>
			</div>

		);
	}

}
export default UserManagement;