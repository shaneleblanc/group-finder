import React, { Component } from 'react';

class About extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className="about">
        {this.props.loggedIn ?
          <p>Welcome {this.props.username}</p>
          :
          <p>Please sign up or log in!</p>
        }
      </div>
    )
  }
};

export default About;
