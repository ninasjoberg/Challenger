import React, { Component } from 'react';

export default class RegisterForm extends Component{

    state = {
        user: ''
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

    submitForm = (event) => {
        event.preventDefault(); //<-- så att inte infon skickas iväg o sidan laddas om, då detta kommer gäras med state ist
    }


    render() {

       

        return(
            <div>
                <h1>Register</h1>
                <form onSubmit={this.submitForm}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username"></input>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" className="form-control" name="email"></input>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="text" className="form-control" name="password"></input>
                    </div>
                    <input className="btn btn-primary" type="submit" value="Register"/>
                </form> 
            </div>
        );
    }
}