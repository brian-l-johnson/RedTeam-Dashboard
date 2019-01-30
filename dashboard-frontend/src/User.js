import React, { Component } from 'react';

class User extends Component{
	toggleActive = event => {
		let status = event.target.checked;
		let update = {'active': status};
		
		fetch(window.API_URL+"/auth/user/"+this.props.user._id, {
			method: "PUT",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(update)
		})
		.then(response => {
			response.json()
		})
	}

	togglePermission = event => {
		let name = event.target.name;
		let status = event.target.checked;
		let permissions = this.props.user.permissions;
		if(status) {
			permissions.push(name);
		}
		else {
			let index = permissions.indexOf(name)
			permissions.splice(index, 1);
		}


		fetch(window.API_URL+"/auth/user/"+this.props.user._id, {
			method: "PUT",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({"permissions": permissions})
		})
		.then(response => {
			response.json()
		})
	}
	
	render() {
		return (
			<tr key={this.props.user._id}>
				<td>{this.props.user.email}</td>
				<td>{this.props.user.handle}</td>
				<td className="text-center">
					<input className="form-check-input" type="checkbox" checked={this.props.user.active} onChange={this.toggleActive}/>
				</td>
				<td>
					<div className="form-check">
						<input form={this.props.user._id} className="form-check-input" type="checkbox" checked={(this.props.user.permissions.indexOf("admin") > -1) ? true: false} name="admin" id={"admin"+this.props.user._id} onChange={this.togglePermission}/>
						<label className="form-check-label" htmlFor={"admin"+this.props.user._id}>Admin</label>
					</div>
					<div className="form-check">
						<input form={this.props.user._id} className="form-check-input" type="checkbox" checked={(this.props.user.permissions.indexOf("view") > -1) ? true: false} name="view" id={"view"+this.props.user._id} onChange={this.togglePermission}/>
						<label className="form-check-label" htmlFor={"view"+this.props.user._id}>View</label>
					</div>
					<div className="form-check">
						<input htmlFor={this.props.user._id} className="form-check-input" type="checkbox" checked={(this.props.user.permissions.indexOf("hacker") > -1) ? true: false} name="hacker" id={"hacker"+this.props.user._id} onChange={this.togglePermission}/>
						<label className="form-check-label" htmlFor={"hacker"+this.props.user._id}>Hacker</label>
					</div>
					<div className="form-check">
						<input form={this.props.user._id} className="form-check-input" type="checkbox" checked={(this.props.user.permissions.indexOf("scanner") > -1) ? true: false} name="scanner" id={"scanner"+this.props.user._id} onChange={this.togglePermission}/>
						<label className="form-check-label" htmlFor={"scanner"+this.props.user._id}>Scanner</label>
					</div>
				</td>
			</tr>
		);
	}

}
export default User;