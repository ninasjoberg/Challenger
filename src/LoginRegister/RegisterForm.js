import React, { Component } from 'react';
import firebase from '../util/Firebase.js';
import GoogleSignIn from './GoogleSignIn.js';


export default class RegisterForm extends Component{

    state = {
        user: '',
        username: '',
        email: '',
        password: '',
        error: false,
        errorUsername: '',
        errorPassword: '',
        errorEmail: '',
    }


    //sets the state based on the name and value from the current inputfield
    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }


    submitForm = (event) => {
        event.preventDefault(); //prevent the page to reload when the form is submitted
        
        //creating errormessages based on input values from the registerform 
        let usernameMess = '';
        let passwordMess = '';
        let emailMess = '';
        let error = false;

        if(!this.state.username){
            usernameMess = 'type in a Username!';
            error = true;
        }    
        if(!this.state.password){
            passwordMess = 'type in a Password!';
            error = true;
        }
        if(!this.state.email){
            emailMess = 'type in an emailaddress!';
            error = true;
        }    
        if(this.state.username && this.state.username.length < 2){
            usernameMess = 'Username must be at least 2 characthers long!';
            error = true;
        }
        if(this.state.password && this.state.password.length < 8){
            passwordMess = 'Password must be at least 8 characthers long!';
            error = true;
        } 
        if(this.state.email && this.state.email.indexOf('@') === -1){
            emailMess = 'Not a valid emailadress!';
            error = true;
        }
        //if we have no errors in the frontEnd, call firebase function create user
        if(error === false){
            firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)//creates a user in firebase Authentication 
            .then((user) => {
                user.updateProfile({ //sets the displayName in Firebase to the username provided by the user during register
                    displayName: this.state.username,
                }).then(() => {
                    firebase.database() //store the user (email, uid and username) data in Firebase database
                    .ref(`users/${user.uid}`)
                    .set({email: user.email, uid: user.uid, username: user.displayName}); //om ett värde inte finns komer det bli null i firebase
                    return user;

                }).then((user) => {
                    this.props.setCurrentUser(user); //to call a function in app.js that sets the logged in user to the states currentUser(didn't happen nby default)
                })
            }).catch(error => console.log(error))
    
        }
        this.setState({errorUsername: usernameMess})
        this.setState({errorPassword: passwordMess})
        this.setState({errorEmail: emailMess})
        this.setState({error: error})
    }


    render() {

       const hasError = this.state.error ? 'has-danger' : '';//if we get an error, use the bootstrap className 'has-danger' for styling
       const usernameMessage = this.state.errorUsername;
       const passwordMessage = this.state.errorPassword;
       const emailMessage = this.state.errorEmail;
       const LoggedinMessage = this.state.loginMess;

        return(
            <div>
                <h1>Register</h1>
                {this.props.currentUser && <h2>You are logged in as: {this.props.currentUser.username}</h2>}
                {this.props.currentUser && <p>create a challange at <a href="#" onClick={() => this.props.goTo('userpage')}>My Page</a></p>}
                <form onSubmit={this.submitForm} style ={{width: "30%", minWidth: "300px", margin: "2rem auto"}}>
                    <div className={`form-group ${hasError}`}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" onChange={this.onChange}></input>
                        {usernameMessage && <div className="form-control-feedback">{usernameMessage}</div>}   
                    </div>
                    <div className={`form-group ${hasError}`}>
                        <label htmlFor="email">Email</label>
                        <input type="text" className="form-control" name="email" onChange={this.onChange}></input>
                        {emailMessage && <div className="form-control-feedback">{emailMessage}</div>}                               
                    </div>
                    <div className={`form-group ${hasError}`}>
                        <label htmlFor="password">Password *(at least 8 characthers)</label>
                        <input type="password" className="form-control" name="password" onChange={this.onChange}></input>
                        {passwordMessage && <div className="form-control-feedback">{passwordMessage}</div>}   
                    </div>
                    <input className="btn btn-primary" type="submit" value="Register"/>
                </form> 
                {this.state.user && <button onClick={() => this.props.goTo('userpage')}>My page</button>}
               
               <GoogleSignIn />
            </div>
        );
    }
}