import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Counter from './Counter';
import Team from './Team';

class App extends Component {
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
    fetch('http://127.0.0.1:3001/hosts')
      .then(response => response.json())
      .then(data => this.setState({hosts: data}));
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
        <Header />
        <h1>Hello {this.props.message}!</h1>
        <Counter />
        <div className="teamsContainer">
          {this.createTeams(this.state.teams)}
        </div>
      </div>
    );
  }
}

export default App;
