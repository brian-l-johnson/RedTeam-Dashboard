import React, { Component } from 'react';
import {Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Teams from './Teams';
import Hosts from './Hosts';

class Main extends Component {
	render() {
		return (
            <div>
                <Switch>
                    <Route exact path='/' component={Dashboard}/>
                    <Route path='/Teams' component={Teams}/>
                    <Route path='/Hosts' component={Hosts}/>
                </Switch>
            </div>

		);
	}
}

export default Main;