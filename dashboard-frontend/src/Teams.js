import React, { Component } from 'react';

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            newTeam: {}
        }
      }
    
      componentDidMount() {
          
          this.interval = setInterval(() => fetch(window.API_URL+'/teams', {credentials: 'include'})
            .then(response => {
                if(!response.ok) this.props.history.push('/Login');
                else return response.json();
            })
            .then(data => this.setState({teams: data})),1000);
            
      }
      componentWillUnmount() {
          clearInterval(this.interval);
      }
      handleSubmit = event => {
          event.preventDefault();
          let newTeam = {};
          let ntf = document.getElementById("newTeamForm");
          newTeam['name'] = ntf.name.value;
          newTeam['range'] = ntf.range.value;
          fetch(window.API_URL+'/teams', {
              method: "POST",
              credentials: 'include',
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(newTeam)
          })
          .then(response => response.json());

      }
      handleChange = event => {
          this.setState({['newTeam'[event.target.name]]: event.target.value});
      }
      handleClick(teamName) {
          this.props.history.push("/team/"+teamName);
      }
      deleteTeam = event => {
          console.log(event.target);
          console.log("deleting team: "+event.target.name);

          fetch(window.API_URL+'/teams/'+event.target.name, {
            method: "DELETE",
            credentials: 'include'
          });
      }
    
    
    render() {
		return (
            <div className="container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th>IP Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        this.state.teams.map(team => (
                            <tr key={team.name} > 
                                <td onClick={this.handleClick.bind(this, team._id)}>{team.name}</td>
                                <td onClick={this.handleClick.bind(this, team._id)}>{team.range}</td>
                                {
									((typeof(window.permissions.indexOf) === "function") && (window.permissions.indexOf('admin') > -1)) && (
										<td>
                                            <button type="button" name={team._id} onClick={this.deleteTeam}>Delete</button>
                                        </td>
									)
								}
                            </tr>


                        ))
                        }
                    </tbody>
                
                </table>

                <div>
                    <h1>Create New Team</h1>
                    <form onSubmit={this.handleSubmit} id="newTeamForm">
                        <div className="form-group">
                            <label htmlFor="name">Team Name</label>
                            <input type="text" className="form-text" id="name" placeholder="Enter team name" />
                        </div>
                        <div className="from-group">
                            <label htmlFor="range">IP Address Range</label>
                            <input type="text" className="form-text" id="range" placeholder="Enter team IP Address Range" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
            
		);
	}
}

export default Teams;