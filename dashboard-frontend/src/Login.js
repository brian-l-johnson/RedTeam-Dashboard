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
		let register = {};
		let rf = document.getElementById("registerForm");
		register['email'] = rf.email.value;
		register['password'] = rf.password.value;
		alert("in handleSubmit:"+JSON.stringify(register));
		fetch(window.API_URL+'/auth/login', {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(register)
		})
		.then(response => {
			if(response.status === 200) {
				this.props.history.push('/');
			}
			else {
				response.json().then(data => {
					console.log(data);
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
					<form onSubmit={this.handleSubmit} id="registerForm">
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