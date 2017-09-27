import React, {Component} from 'react';
import firebase from '../Firebase.js';
import GoogleSignIn from './GoogleSignIn.js';


export default class LoginForm extends Component{

    state = {
        email: '',
        password: '',
        error: ''
    }


    onChange = (event) => {
        this.setState({[event.target.name] : event.target.value}) //<-- detta kommer fungera för alla inputfält när man skrivit såhär, så länge "name" är samma som något som finns i statet
    }


    signIn = (event) => {
        event.preventDefault(); //<-- så att inte infon skickas iväg o sidan laddas om, då detta kommer gäras med state ist
        
        firebase.auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            if(user){
                this.setState({error: ''})
            }
        })
        .catch(error => {
            console.log(error);
            this.setState({error: error.code})
        });    
    }

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
                {errorMessage.length != 0 &&  errorMessage.map((error) => <p>{error}</p>)}
                <form onSubmit={this.signIn} style ={{maxWidth: "50%", margin: "2rem auto"}}>
                    <div>
                        <label htmlFor="email">email-address</label>
                        <input type="text" className="form-control" name="email" onChange={this.onChange}></input>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" onChange={this.onChange}></input>
                    </div>
                    <input className="btn btn-primary" type="submit" value="Login" />
                </form>
                {this.state.user && <button onClick={() => this.props.goTo('userpage')}>My page</button>}
                <GoogleSignIn />
                <a href='#' onClick={() => this.props.goTo('register')}>Register</a>
            </div>
        );
    }
}