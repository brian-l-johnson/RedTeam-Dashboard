import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Header extends Component {
	render() {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
				<Link className="navbar-brand" to="/">Red Team Dashboard</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item active">
							<Link className="nav-link" to="/Teams">Teams</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/Hosts">Hosts</Link>
						</li>
					</ul>
					<ul className="navbar-nav ml-auto">
						<li className="nav-item">
							<Link className="nav-link" to="/Register">Register</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/Login">Login</Link>
						</li>
					</ul>
				</div>

			</nav>
		);
	}
}

export default Header;