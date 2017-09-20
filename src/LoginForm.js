import React, {Component} from 'react';
import firebase from './Firebase.js';


export default class LoginForm extends Component{

    state = {
        email: '',
        password: '',
        user: '',
    }


    onChange = (event) => {
        this.setState({[event.target.name] : event.target.value}) //<-- detta kommer fungera för alla inputfält när man skrivit såhär, så länge "name" är samma som något som finns i statet
    }


    signIn = (event) => {
        event.preventDefault(); //<-- så att inte infon skickas iväg o sidan laddas om, då detta kommer gäras med state ist
        
        firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        //sätter statet user i app.js Verkar dock inte funka! 
        .then((user) => {
            console.log(user);
            this.props.showUser(user.email);
            console.log(this.props.showUser);
        })
        .catch(error => console.log(error));        
    }


   render(){

    if(this.state.user) {
        console.log(this.state.user);
    }    

    //console.log(firebase.auth().currentUser.email);
   // const user = firebase.auth().currentUser.email;

        return (
            <div>
                <h1>Login</h1>

                <form onSubmit={this.signIn} style ={{maxWidth: "50%", margin: "5rem auto"}}>
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
                {firebase.auth().currentUser && <p>You are logged in as db: {firebase.auth().currentUser.email}</p>}
                {this.state.user && <p>You are logged in as state: {this.state.user.email}</p>}
                {this.state.user && <button onClick={() => this.props.goTo('userpage')}>My page</button>}
            </div>
        );
    }
}