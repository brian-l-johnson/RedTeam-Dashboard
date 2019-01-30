import React, { Component } from 'react';

class Login extends Component{
	constructor(props) {
    	super(props);
    	this.state = {
			loggedin: "true"
		}
	}

	componentDidMount() {
          
		fetch(window.API_URL+"/auth/logout", {credentials: "include"})
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.setState({loggedin: false});
				window.user = "";
				this.props.history.push("/Login");
			});
		  
	}


	
	render() {
		return (
			<div className="container">
				<div className="card">
					<div className="card-header text-center">
						Logout
					</div>
					<div className="card-body">
						{
							this.state.loggedin ? (
								<div>
									You are being logged out
								</div>
							):
							(
								<div>
									You have been logged out
								</div>
							)
						}
					</div>
				</div>
			</div>

		);
	}

}
export default Login;