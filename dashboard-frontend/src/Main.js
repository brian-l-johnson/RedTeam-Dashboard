import React, { Component } from 'react';
import {Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Teams from './Teams';
import Team from './Team';
import Hosts from './Hosts';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import UserManagement from './UserManagement';
import Vulnerabilities from './Vulnerabilities';
import Vulns from './Vulns';
import Rules from './Rules';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          "teams": [],
        }
    }

    loggedIn() {
        fetch(window.API_URL+'/auth/permissions', {credentials: 'include'})
        .then(response => {
            if(response.ok) {
                return true;
            }
            return false;
        });
    }
  
    requireAuth(nextState, replace) {
        if (!this.loggedIn()) {
            replace({
                pathname: '/Login'
            })
        }
    }


	render() {
		return (
            <div className="jumbotron">
                <Switch>
                    <Route exact path='/' component={Dashboard} />
                    <Route path='/Teams' component={Teams} />
                    <Route path='/Team/:id' component={Team} />
                    <Route path='/Hosts' component={Hosts} />
                    <Route path='/Host/:ip' component={Hosts} />
                    <Route path='/Vulnerabilities' component={Vulns}/>
                    <Route path='/Rules' component={Rules}/>
                    <Route path='/Register' component={Register}/>
                    <Route path='/Login' component={Login}/>
                    <Route path='/Logout' component={Logout}/>
        

                    <Route path="/UserManagement" component={UserManagement}/>
                    
                </Switch>
            </div>

		);
	}
}

export default Main;