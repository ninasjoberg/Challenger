import React from 'react';
import firebase from '../Firebase.js';
import './Header.css';


function signOut(props){
    firebase
    .auth()
    .signOut()
    .catch(error => console.log(error));  
}

export default function Header(props){

    console.log(props.currentUser);
    //console.log(props.showUser);

    return(
        <div className="root">
            <div className="header-buttons">
                <button className="btn btn-secondary" onClick={() => props.goTo('home')}>Home</button>
                <div>
                    <p>You are logged in as: {props.currentUser}</p>
                    {!props.currentUser && <button className="btn btn-primary" onClick={() => props.goTo('login')}>Login</button>}
                    {!props.currentUser && <button className="btn btn-primary" onClick={() => props.goTo('register')}>Register</button>}
                    {props.currentUser && <button className="btn btn-primary" onClick={signOut}>Log out</button>}
                    {props.currentUser && <button className="btn btn-primary" onClick={() => props.goTo('userpage')}>My page</button>}
                </div>
            </div>
            <h1 className="heading">CHALLENGER!</h1>
        </div>
    );
}