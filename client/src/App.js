import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import ReactModalLogin from "react-modal-login";
import Cookies from 'universal-cookie';

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
    initialTab: null,
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
  }
  logOut() {
    this.setState({
      token: "",
      userId: "",
      loggedIn: false,
      username: "",
      loading: false
    })
    cookies.remove('token', {path: '/'});
    cookies.remove('userId', {path: '/'});
  }

  signUp(realm, username, email, password) {
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
          alert(res["error"]["message"])
        }
      })
      .catch(err => {
        console.error(err);
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
        error: true
      })
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
    })
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

    const loggedIn = this.state.loggedIn
      ? <div>
        <p>Welcome, {this.state.username}</p>
      </div>
      : <div>
        <p>You are signed out</p>
      </div>;

    const isLoading = this.state.loading;
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-title">
            Path of Exile Party Finder
          </div>
          <div className="App-header-login">
            {this.state.loggedIn ?
              <button
                className="RML-btn"
                onClick={() => this.logOut()}
              >
                Logout
              </button>
              :
              <button
                className="RML-btn"
                onClick={() => this.openModal('login')}
              >
                Login
              </button>
            }
            <button
              className="RML-btn"
              onClick={() => this.openModal('register')}
            >
              Register
            </button>

            <ReactModalLogin
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
            {loggedIn}
          </div>
        </header>
        {this.state.loggedIn ?
          <div className="about">
          Welcome {this.state.username}
          </div>
          :
          <div className="about">
            Please sign up or log in!
          </div>
        }

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
