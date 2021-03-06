import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class About extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className="about">
        {this.props.loggedIn ?
          <div>
          <p>Welcome {this.props.username}</p>
          <p><Link to="/createProfile">{'Create your profile'}</Link></p>
          </div>
          :
          <p>Please sign up or log in!</p>
        }
      </div>
    )
  }
};

export default About;
