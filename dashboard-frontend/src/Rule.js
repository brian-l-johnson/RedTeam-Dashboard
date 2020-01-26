import React, { Component } from 'react';

class Rule extends Component{
	/*
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
	*/
	
	render() {
		return (
			<tr key={this.props.rule._id}>
				<td>{this.props.rule.port}</td>
				<td>{this.props.rule.exploit}</td>
				<td>
					{
						Object.keys(this.props.rule.exploitOptions).map(key => (
							<div key={key}>{key} : {this.props.rule.exploitOptions[key]}</div>
						))
					}
				</td>
				<td>
					<input type="checkbox" checked={this.props.rule.enabled} className="form-check-input" />
				</td>
			</tr>
		);
	}

}
export default Rule;