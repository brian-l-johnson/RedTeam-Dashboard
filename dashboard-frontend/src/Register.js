import React, { Component } from 'react';

class Register extends Component{
	
	handleSubmit = event => {
		event.preventDefault();
		let register = {};
		let rf = document.getElementById("registerForm");
		register['email'] = rf.email.value;
		register['handle'] = rf.handle.value;
		register['password'] = rf.password.value;
		fetch(window.API_URL+'/auth/register', {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(register)
		})
		.then(response => response.json())
		.then(this.props.history.push('/Login'));
		
	}
	
	render() {
		return (
			<div className="container">
						<div className="card">
				<div className="card-header text-center">
					Register
				</div>
				<div className="card-body">
					<form onSubmit={this.handleSubmit} id="registerForm">
						<div className="form-group">
							<label htmlFor="email">Email Address</label>
							<input type="email" className="form-control" id="email" placeholder="Enter email..."/>
						</div>
						<div className="form-group">
							<label htmlFor="handle">Handle</label>
							<input type="text" className="form-control" id="handle" placeholder="Enter handle..."/>
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
export default Register;