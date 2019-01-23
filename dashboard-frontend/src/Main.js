import React, { Component } from 'react';
import {Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Teams from './Teams';
import Team from './Team';
import Hosts from './Hosts';

class Main extends Component {
	render() {
		return (
            <div className="jumbotron">
                <Switch>
                    <Route exact path='/' component={Dashboard}/>
                    <Route path='/Teams' component={Teams}/>
                    <Route path='/Team/:id' component={Team} />
                    <Route path='/Hosts' component={Hosts}/>
                    <Route path='/Host/:ip' component={Hosts}/>
                    
                </Switch>
            </div>

		);
	}
}

export default Main;