import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import ReactModalLogin from 'react-modal-login';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import About from './Components/About/About';
import List from './Components/List/List';
import Swal from 'sweetalert2';
import CreateProfile from "./Components/CreateProfile/CreateProfile";

const swal = require('sweetalert2');
const cookies = new Cookies();

const styles = {
    customWidth: {
        width: 200,
    },
};

class App extends Component {
  state = {
    token: "",
    userId: "",
    username: "",
    showModal: false,
    loggedIn: null,
    loading: false,
    error: null,
    initialTab: "register",
    recoverPasswordSuccess: null,
    name: [],
    date: [],
    id: []
  }

  handleChange = (event, index, value, id) => {
    console.log(event)
    this.setState({[id]: value})
  };

  logIn(email, password) {
    axios.post('http://localhost:8080/api/Users/login', {
      "email": email,
      "password": password
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          cookies.set('token', res['data']['id'], {path: '/'});
          cookies.set('userId', res['data']['userId'], {path: '/'});
          this.onLoginSuccess("form", res['data']['id'], res['data']['userId']);
        }

      })
      .catch(err => {
        if (err.response.status === 401) {
          swal.fire({
            title: 'Hang on...',
            text: 'Invalid username/password combination',
            type: 'error',
            confirmButtonText: 'Oops'
          })
        }
        else {
          swal.fire({
            title: 'Error',
            text: 'Status code: ' + err.response.status,
            type: 'error',
            confirmButtonText: 'Whatever'
          })
        }
      })
  }
  logOut() {
    // clear token from db
    axios.post('http://localhost:8080/api/Users/logout?access_token='+this.state.token);
    // clear state
    this.setState({
      token: "",
      userId: "",
      loggedIn: false,
      username: "",
      loading: false
    });
    // clear cookies
    cookies.remove('token', {path: '/'});
    cookies.remove('userId', {path: '/'});
    this.render();
  }

  signUp(realm, username, email, password) {
    console.log("_signUp_");
    axios.post('http://localhost:8080/api/Users', {
      "realm": realm,
      "username": username,
      "email": email,
      "password": password
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.logIn(username, password);
        }
        else {
          alert(res["error"]["message"]);
        }
      })
      .catch(err => {
        if (err.response.status === 422){
          swal.fire({
            title: 'Hang on...',
            text: 'Username or email address already in use.',
            type: 'error',
            confirmButtonText: 'Got it.'
          })
        }
        else {
          swal.fire({
            title: 'Error',
            text: 'Status code: ' + err.response.status,
            type: 'error',
            confirmButtonText: 'Whatever'
          })
        }
      })
  }

  onLogin() {
    console.log('__onLogin__');
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!email || !password) {
      this.setState({
        error: true
      })
    } else {
      this.logIn(email, password);
    }
  }

  onRegister() {
    console.log('__onRegister__');
    console.log('login: ' + document.querySelector('#login').value);
    console.log('email: ' + document.querySelector('#email').value);
    console.log('password: ' + document.querySelector('#password').value);

    const login = document.querySelector('#login').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    if (!login || !email || !password) {
      this.setState({
        error: true,
      });
      swal.fire({
        title: 'Incomplete',
        text: 'All three fields are required!',
        type: 'error',
        confirmButtonText: 'My bad'
      });
    } else {
      this.signUp("testRealm", login, email, password);
    }
  }

  onRecoverPassword() {
    console.log('__onForgottenPassword__');
    console.log('email: ' + document.querySelector('#email').value);

    const email = document.querySelector('#email').value;


    if (!email) {
      this.setState({
        error: true,
        recoverPasswordSuccess: false
      })
    } else {
      this.setState({
        error: null,
        recoverPasswordSuccess: true
      });
    }
  }

  openModal(initialTab) {
    this.setState({
      initialTab: initialTab
    }, () => {
      this.setState({
        showModal: true,
      })
    });
  }

  onLoginSuccess(method, token, userId) {

    this.closeModal();
    this.setState({
      token: token,
      userId: userId,
      loggedIn: method,
      loading: false
    });
    this.getUser(userId, token);
  }

  onLoginFail(method, response) {

    this.setState({
      loading: false,
      error: response
    })
  }

  startLoading() {
    this.setState({
      loading: true
    })
  }

  finishLoading() {
    this.setState({
      loading: false
    })
  }

  afterTabsChange() {
    this.setState({
      error: null,
      recoverPasswordSuccess: false,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null
    });
  }

  getUser(userId, token) {
    if (token) {
      axios.get('http://localhost:8080/api/Users/'+userId+'?access_token='+token)
        .then(result => {
          console.log("getting user data" + result.data);
          this.setState({
            username: result.data['username']
          });
      }).catch(err => {
        console.log(err);
      });
    }
  }


  render() {

    const isLoading = this.state.loading;
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-title">
            PoE Party Finder
          </div>
          <div className="App-header-login">
            {this.state.loggedIn ?
              <div><button
                className="RML-btn"
                onClick={() => this.logOut()}
              >
                Logout
              </button></div>
              :
              <div><button
                className="RML-btn"
                onClick={() => this.openModal('login')}
              >
                <span>Login</span>
              </button>
              <button
              className="RML-btn"
              onClick={() => this.openModal('register')}
              >
              <span>Register</span>
              </button></div>
            }


            <div><ReactModalLogin
              visible={this.state.showModal}
              onCloseModal={this.closeModal.bind(this)}
              loading={isLoading}
              initialTab={this.state.initialTab}
              error={this.state.error}
              tabs={{
                afterChange: this.afterTabsChange.bind(this)
              }}
              startLoading={this.startLoading.bind(this)}
              finishLoading={this.finishLoading.bind(this)}
              form={{
                onLogin: this.onLogin.bind(this),
                onRegister: this.onRegister.bind(this),
                onRecoverPassword: this.onRecoverPassword.bind(this),

                recoverPasswordSuccessLabel: this.state.recoverPasswordSuccess
                  ? {
                    label: "New password has been sent to your mailbox!"
                  }
                  : null,
                recoverPasswordAnchor: {
                  label: "Forgot your password?"
                },
                loginBtn: {
                  label: "Sign in"
                },
                registerBtn: {
                  label: "Sign up"
                },
                recoverPasswordBtn: {
                  label: "Send new password"
                },
                loginInputs: [
                  {
                    containerClass: 'RML-form-group',
                    label: 'Email',
                    type: 'email',
                    inputClass: 'RML-form-control',
                    id: 'email',
                    name: 'email',
                    placeholder: 'Email',
                  },
                  {
                    containerClass: 'RML-form-group',
                    label: 'Password',
                    type: 'password',
                    inputClass: 'RML-form-control',
                    id: 'password',
                    name: 'password',
                    placeholder: 'Password',
                  }
                ],
                registerInputs: [
                  {
                    containerClass: 'RML-form-group',
                    label: 'Nickname',
                    type: 'text',
                    inputClass: 'RML-form-control',
                    id: 'login',
                    name: 'login',
                    placeholder: 'Nickname',
                  },
                  {
                    containerClass: 'RML-form-group',
                    label: 'Email',
                    type: 'email',
                    inputClass: 'RML-form-control',
                    id: 'email',
                    name: 'email',
                    placeholder: 'Email',
                  },
                  {
                    containerClass: 'RML-form-group',
                    label: 'Password',
                    type: 'password',
                    inputClass: 'RML-form-control',
                    id: 'password',
                    name: 'password',
                    placeholder: 'Password',
                  }
                ],
                recoverPasswordInputs: [
                  {
                    containerClass: 'RML-form-group',
                    label: 'Email',
                    type: 'email',
                    inputClass: 'RML-form-control',
                    id: 'email',
                    name: 'email',
                    placeholder: 'Email',
                  },
                ],
              }}
              separator={{
                label: "[Social Login Disabled Temporarily]"
              }}
              /*          providers={{
                          facebook: {
                            config: facebookConfig,
                            onLoginSuccess: this.onLoginSuccess.bind(this),
                            onLoginFail: this.onLoginFail.bind(this),
                            inactive: isLoading,
                            label: "Continue with Facebook"
                          },
                          google: {
                            config: googleConfig,
                            onLoginSuccess: this.onLoginSuccess.bind(this),
                            onLoginFail: this.onLoginFail.bind(this),
                            inactive: isLoading,
                            label: "Continue with Google"
                          }
                        }}*/
            />
            </div>

          </div>
        </header>
        <div className="App-body">
          <br />
        <Router>
          <div className="App-body-container">
            <Route
              exact path='/'
              render={(props) => <About {...props}
                                        loggedIn={this.state.loggedIn}
                                        username={this.state.username}
                                        profileCreated={this.state.profileCreated}
              />}
              />
            <Route
              path='/list'
              render={(props) => <List />}
            />
            <Route
              path='/createProfile'
              render={(props) => <CreateProfile {...props}
                                                loggedIn={this.state.loggedIn}
                                                username={this.state.username}/>}
            />
          </div>
        </Router>
        <footer>
            &copy; Shane LeBlanc 2019
        </footer>
        </div>
      </div>

    );
  }
  componentWillMount () {
    if (cookies.get('token') !== undefined){
      this.onLoginSuccess("cookie", cookies.get('token'), cookies.get('userId'));
    }
  }
}


export default App;
