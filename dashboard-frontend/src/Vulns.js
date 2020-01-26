import React, { Component } from 'react';
import Vulnerabilities from './Vulnerabilities';

class Vulns extends Component{
    constructor(props) {
        super(props);
        
    	this.state = {
            vulns: []
        }
    }
    
    componentDidMount() {
          
        this.interval = setInterval(() => fetch(window.API_URL+'/vulnerability', {credentials: 'include'})
          .then(response => {
              if(!response.ok) this.props.history.push('/Login');
              else return response.json();
          })
          .then(data => this.setState({vulns: data})),1000);
          
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

	render() {
		return (
            <div>
                {
                    this.state.vulns.map(host => 
                        (
                            <div key={host.host}>
                            <h2>{host.host}</h2>
                            {
                                host.ports && host.ports.map(port => (
                                    <div key={host.host+":"+port._id}>
                                        <h3>{port.port}</h3>
                                        <Vulnerabilities port={port.port} vulnerabilities={port.vulnerabilities} host={host.ip}/>
                                    </div>
                                ))
                            }
                        </div>
                        )
 
                    )
                }
            </div>
            
  
		);
	}

}
export default Vulns;