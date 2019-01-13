import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Team from './Team';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          "teams": 
            [
              {"name": "Team 1", "range": "192.168.1.0/24"},
              {"name": "Team 2", "range": "192.168.2.0/24"},
              {"name": "Team 3", "range": "192.168.3.0/24"},
              {"name": "Team 4", "range": "192.168.4.0/24"},
              {"name": "Team 5", "range": "192.168.5.0/24"},
              {"name": "Team 6", "range": "192.168.6.0/24"},
              {"name": "Team 7", "range": "192.168.7.0/24"}
             ],
          "counter" :0
        }
      }
    
      componentDidMount() {
          /*
          this.interval = setInterval(() => fetch('http://127.0.0.1:3001/hosts')
            .then(response => response.json())
            .then(data => this.setState({hosts: data})),1000);
        */
      }
      componentWillUnmount() {
          clearInterval(this.interval);
      }
    
      createTeam(team) {
        return (<Team name={team.name} range={team.range} key={team.name} />)
      }
      createTeams(teams) {
        return teams.map(this.createTeam);  
      }
    
    render() {
		return (
            <div>
                <div className="teamsContainer">
                    {this.createTeams(this.state.teams)}
                 </div>
            </div>
   
		);
	}
}

export default Dashboard;