import React, { Component } from 'react';
import firebase from './Firebase.js';


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
        welcomeMessage: ''
    }


    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                console.log(user);
                this.setState({user: user});
            }else{
                console.log('something went wrong');
                this.setState({user: ''});
            }
        })
    }

    //lägger till det som skrivs i inputfälten i statet
    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }


    submitForm = (event) => {
        event.preventDefault(); //<-- så att inte infon skickas iväg o sidan laddas om, då detta kommer gäras med state ist
        
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
        if(this.state.username && this.state.username.length < 8){
            usernameMess = 'Username must be at least 8 characthers long!';
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
        if(error === false){
            console.log('you are logged in!');
            console.log(this.state.username);
            console.log(this.state.password);
            console.log(this.state.email);
        }
        
        this.setState({errorUsername: usernameMess})
        this.setState({errorPassword: passwordMess})
        this.setState({errorEmail: emailMess})
        this.setState({error: error})
        
        firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)//skapar en envändare i firebase Authentication 
        .then((user) => {
            user.updateProfile({
                displayName: this.state.username,
            }).then(() => {
                firebase.database() //för att lagra användarinfo i själva databasen! här lagrar vi användarens email under users
                .ref(`users/${user.uid}`)
                .set({email: user.email, uid: user.uid, username: user.displayName}); //om ett värde inte finns komer det bli null i firebase
            })
        })
        .catch(error => console.log(error))


        this.setState({welcomeMessage: 'Welcome, you are now logged in as ' + this.state.user.displayName})        
    }


    render() {

        console.log(this.state.user);
        console.log(this.props.currentUser);
        console.log(this.state.user.displayName);


       const hasError = this.state.error ? 'has-danger' : ''; //för att använda oss utav bootstrapklassen 'has-danger' om vå får ett error        
       const usernameMessage = this.state.errorUsername;
       const passwordMessage = this.state.errorPassword;
       const emailMessage = this.state.errorEmail;
       const LoggedinMessage = this.state.loginMess;

        return(
            <div>
                <h1>Register</h1>
                <form onSubmit={this.submitForm} style ={{maxWidth: "50%", margin: "5rem auto"}}>
                    <div className={`form-group ${hasError}`}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" onChange={this.onChange}></input>
                        {this.state.errorUsername && <div className="form-control-feedback">{usernameMessage}</div>}   
                    </div>
                    <div className={`form-group ${hasError}`}>
                        <label htmlFor="email">Email</label>
                        <input type="text" className="form-control" name="email" onChange={this.onChange}></input>
                        {this.state.errorEmail && <div className="form-control-feedback">{emailMessage}</div>}                               
                    </div>
                    <div className={`form-group ${hasError}`}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" onChange={this.onChange}></input>
                        {this.state.errorPassword && <div className="form-control-feedback">{passwordMessage}</div>}   
                    </div>
                    <input className="btn btn-primary" type="submit" value="Register"/>
                </form> 
                {this.state.user && <h1> {this.state.welcomeMessage} </h1>}
                {this.state.user && <button onClick={() => this.props.goTo('userpage')}>My page</button>}
            </div>
        );
    }
}