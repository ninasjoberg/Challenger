import React, { Component } from 'react';
import firebase from './Firebase.js';
import './App.css';
import Header from './Header/Header.js';
import Home from './Home.js';
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';
import UserPage from './UserPage/UserPage.js';


const routes = {
  home: Home,
  login: LoginForm,
  register: RegisterForm,
  userpage: UserPage 
}


export default class App extends Component {

  state = {
    currentUser: '',
    currentPage: 'home',
  }

  //hämtar automatiskt alla förändingar i auth (inloggning & reg.) från firebase
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
          const newUser = {
              email: user.email,
              username: user.displayName,
              userId: user.uid
          }
          this.setState({currentUser: newUser});
      }else{
          console.log('something went wrong');
          this.setState({currentUser: ''});
      }
    })
  }  


  changePage = (page) => {
    this.setState({currentPage: page})
  }


  render() {

    console.log(this.state.currentUser.username);

    const Page = routes[this.state.currentPage];

    return (
      <div className="App">
        <Header goTo={this.changePage} currentUser={this.state.currentUser}/>
        <Page goTo={this.changePage} currentUser={this.state.currentUser}/>
      </div>
    );
  }
}




