import React, { Component } from 'react';
import firebase from './Firebase.js';
import './App.css';
import Header from './Header/Header.js';
import Home from './Home/Home.js';
import LoginForm from './LoginRegister/LoginForm.js';
import RegisterForm from './LoginRegister/RegisterForm.js';
import UserPage from './UserPage/UserPage.js';


const routes = {
  home: Home,
  login: LoginForm,
  register: RegisterForm,
  userpage: UserPage 
}

const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class App extends Component {

  state = {
    currentUser: '',
    currentPage: 'home',
    challengesList: [],
  }


  //bryter ut denna funktion så att detta kan köras när jag exempelvis registrerat en ny användare
  onUserReady = (user) => {    

    if(user && user.displayName) {
      const newUser = {
          email: user.email,
          username: user.displayName,
          userId: user.uid
      }
      this.setState({currentUser: newUser});
    }
    else{
      this.setState({currentUser: ''});
      
    }
  }

  //hämtar automatiskt alla förändingar i auth (inloggning & reg.) från firebase
  componentDidMount() {

    firebase.auth().onAuthStateChanged(this.onUserReady);


    //Lyssnar på när ett nytt objekt eller värde pushas in i vår databas. callback returnerar det tillagda objektet
    db.ref('challenges').on('child_added', (snapshot) => {

      const newChallenge = {
        value: snapshot.val(),
        key: snapshot.key
      }
      this.setState({challengesList: [...this.state.challengesList, newChallenge]})
    })


    //Lyssnar på när ett nytt objekt eller värde tas bort med .remove() från vår databas. callback returnerar det borttagna objektet
    db.ref('challenges').on('child_removed', (snapshot) => {
      let challenges = this.state.challengesList.filter((item) => {
        return item.key !== snapshot.key;
      })
      this.setState({challengesList: challenges})
    })


    //Lyssnar på när ett nytt objekt eller värde uppdateras med .set() i vår databas. callback returnerar det uppdaterade objektet
    db.ref('challenges').on('child_changed', (snapshot) => {
      let updateChallenges = this.state.challengesList.map((item) => {
        if(item.key === snapshot.key){ 
          return Object.assign({}, item, {value: snapshot.val()}) //Object assign === merge the old object with the new object.
        }else
          return item;
      })
      this.setState({challengesList: updateChallenges})
    })
  }


  changePage = (page) => {
    this.setState({currentPage: page})
  }


  render() {

    const Page = routes[this.state.currentPage];

    return (
      <div className="App">
        <Header goTo={this.changePage} currentUser={this.state.currentUser}/>
        <Page goTo={this.changePage} currentUser={this.state.currentUser} challenges={this.state.challengesList} userToDb={this.onUserReady}/>
      </div>
    );
  }
}






