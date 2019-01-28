import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { checkPermissions} from './utils.js';
import Team from './Team';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          "teams": [],
        }

      }

      componentDidMount() {
          checkPermissions("view").then(
            result => {
              if(!result) {
                this.props.history.push('/Login');
              }
            }
          )
          
          this.interval = setInterval(() => fetch(window.API_URL+'/teams', {credentials: 'include'})
            .then(response => {
              if(!response.ok) {
                this.props.history.push('/Login');
              }
              else return response.json()
            })
            .then(data => this.setState({teams: data})),1000);
        
      }
      componentWillUnmount() {
          clearInterval(this.interval);
      }
    
      createTeam(team) {
        return (<Team name={team.name} range={team.range} key={team.name} id={team._id} summary={true}/>)
      }
      createTeams(teams) {
        return teams.map(this.createTeam);  
      }
    
    render() {
		return (
            <div>
                <div className="teamsContainer" >
                    {this.createTeams(this.state.teams)}
                 </div>
            </div>
   
		);
	}
}

export default Dashboard;