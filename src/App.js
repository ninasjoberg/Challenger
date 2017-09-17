import React, { Component } from 'react';
import './App.css';
import firebase from './Firebase.js';
import Header from './Header/Header.js';
import Home from './Home.js';
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';
import UserPage from './UserPage.js';


const routes = {
  home: Home,
  login: LoginForm,
  register: RegisterForm,
  userpage: UserPage 
}


class App extends Component {

  state = {
    user: '',
    username: '',
    password: '',
    email: '',
    input: '',
    currentPage: 'home'
  }


  changePage = (page) => {
    this.setState({currentPage: page})
  }


  render() {

    const Page = routes[this.state.currentPage];
    console.log(this.state.currentPage);


    return (
      <div className="App">
        <Header goTo={this.changePage}/>
        <Page goTo={this.changePage}/>
      </div>
    );
  }
}

export default App;
