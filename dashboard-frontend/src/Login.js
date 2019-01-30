import React, { Component } from 'react';
import Error from './Error';

class Login extends Component{
	constructor(props) {
    	super(props);
    	this.state = {
			error: ""
		}
	}


	handleSubmit = event => {
		event.preventDefault();
		let login = {};
		let rf = document.getElementById("loginForm");
		login['email'] = rf.email.value;
		login['password'] = rf.password.value;
		fetch(window.API_URL+'/auth/login', {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(login)
		})
		.then(response => {
			if(response.status === 200) {
				this.props.history.push('/');
				response.json().then(data => {
					window.user = data.user;
				})
			}
			else {
				response.json().then(data => {
					this.setState({error: data.error});
				});
			}
		});
	}
	
	render() {
		return (
			<div className="container">
						<div className="card">
				<div className="card-header text-center">
					Login
				</div>
				<div className="card-body">
					{
						(this.state.error !== "") && <Error message={this.state.error} />
					}
					<form onSubmit={this.handleSubmit} id="loginForm">
						<div className="form-group">
							<label htmlFor="email">Email Address</label>
							<input type="email" className="form-control" id="email" placeholder="Enter email..."/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input type="password" className="form-control" id="password" placeholder="Password..."/>
						</div>
						<div className="form-group">
							<button type="submit" className="btn btn-primary">Submit</button>
						</div>
					</form>
				</div>
			</div>
			</div>

		);
	}

}
export default Login;