import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom';

class Header extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
			permissions: [],
			loggedin: false
		}
	}
	/*
	getUserInfo() {
		fetch(window.API_URL+'/auth/permissions', {credentials: 'include'})
        .then(response => {
            if(response.status === 401) {
              this.setState({loggedin: false});
			}
			else{
				this.setState({loggedin: true});
			}
            return response.json();
        })
        .then(permissions => {
			this.setState({"permissions": permissions});
        })
	}
	*/
	getUserInfo() {
		fetch(window.API_URL+'/auth/user', {credentials: 'include'})
        .then(response => {
            if(response.status === 401) {
              this.setState({loggedin: false});
			}
			else{
				this.setState({loggedin: true});
			}
            return response.json();
        })
        .then(user => {
			console.log("logged in:");
			console.log(user);
			console.log(user.permissions);
			this.setState({"permissions": user.permissions});
			this.setState({"user": user.handle});
			window.user = user.handle;
			window.permissions = user.permissions;
        })
	}

	componentDidMount() {
		this.getUserInfo();
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
		  this.onRouteChanged();
		}
	  }
	
	  onRouteChanged() {
		console.log("getting user info");
		this.getUserInfo();
	  }

	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
				<Link className="navbar-brand" to="/">Red Team Dashboard</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					
					{
						this.state.loggedin && (
							<ul className="navbar-nav">
								<li className="nav-item active">
									<Link className="nav-link" to="/Teams">Teams</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/Hosts">Hosts</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/Ports">Ports</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/Vulnerabilities">Vulnerabilities</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/Actions">Actions</Link>
								</li>
								<li>
									<Link className="nav-link" to="/Rules">Exploit Rules</Link>
								</li>

								{
									((this.state.loggedin && typeof(this.state.permissions) !== 'undefined' && typeof(this.state.permissions.indexOf) === "function") && (this.state.permissions.indexOf('admin') > -1)) && (
										<li className="navbar-nav">
											<Link className="nav-link" to="/UserManagement">User Management</Link>
										</li>
									)
								}
		
						</ul>
						) 
					}

					{
						this.state.loggedin===false ? (
							<ul className="navbar-nav ml-auto">
								<li className="nav-item">
									<Link className="nav-link" to="/Register">Register</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/Login">Login {this.state.loggedin}</Link>
								</li>
							</ul>
						) : (
							<ul className="navbar-nav ml-auto">
								<li className="nav-link">
									{this.state.user}
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/Logout">Logout</Link>
								</li>
							</ul>
						)
					}
				
				</div>

			</nav>
		);
	}
}

export default withRouter(Header);