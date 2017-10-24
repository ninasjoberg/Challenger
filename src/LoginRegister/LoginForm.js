import React, {Component} from 'react';
import firebase from '../util/Firebase.js';
import GoogleSignIn from './GoogleSignIn.js';


export default class LoginForm extends Component{

    state = {
        email: '',
        password: '',
        error: ''
    }

    //sets the state based on the name and value from the current inputfield
    onChange = (event) => {
        this.setState({[event.target.name] : event.target.value}) 
    }

    signIn = (event) => {
        event.preventDefault(); //prevent the page to reload when the form is submitted
        
        firebase.auth() //logging in a user in firebase Authentication 
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            if(user){
                this.setState({error: ''})
            }
        })
        .catch(error => {
            this.setState({error: error.code}) 
        });    
    }

    //creating error messages based on the messeges from Firebase, handled in the ".catch"
    getErrorMessage = (err) => {
        let msg = [];        
        if(err === 'auth/wrong-password'){
            msg.push('Wrong Password');
        }
        if(err === 'auth/user-not-found'){
           msg.push('User not found');
        }
        if(err === 'auth/invalid-email'){
            msg.push('Invalid email-address');
        }
        if(msg.length === 0 && err) {
            msg.push('Something went wrong.');
        }
        return msg;
    }


   render() {

        let errorMessage = this.getErrorMessage(this.state.error); 

        return (
            <div>
                {!this.props.currentUser && <h1>Login to accept and create Challenges!</h1>}
                {this.props.currentUser && <h1>You are now logged in as: {this.props.currentUser.username}</h1>}
                {this.props.currentUser && <p>create a challange at <a href="#" onClick={() => this.props.goTo('userpage')}>My Page</a></p>}
                {errorMessage.length != 0 &&  errorMessage.map((error) => <p>{error}</p>)}
                <form onSubmit={this.signIn} style ={{width: "30%", minWidth: "300px", margin: "2rem auto"}}>
                    <div>
                        <label htmlFor="email">email-address</label>
                        <input type="text" className="form-control" name="email" onChange={this.onChange}></input>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" onChange={this.onChange}></input>
                    </div>
                    <br/>
                    <input className="btn btn-primary" type="submit" value="Login" />
                </form>
                <GoogleSignIn />
                <p>or</p>
                <a href='#' onClick={() => this.props.goTo('register')}>Register</a>
            </div>
        );
    }
}