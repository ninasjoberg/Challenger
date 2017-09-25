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


    return(
        <div className="root">
            <div className="header-buttons">
                <a className="header-link" href='#' onClick={() => props.goTo('home')}>Home</a>
                <div>
                    {props.currentUser && <p>You are logged in as: {props.currentUser.username}</p>}
                    {!props.currentUser && <a className="header-link" href='#' onClick={() => props.goTo('login')}>Login</a>}
                    {!props.currentUser && <a className="header-link" href='#' onClick={() => props.goTo('register')}>Register</a>}
                    {props.currentUser && <a className="header-link" href='#' onClick={() => props.goTo('userpage')}>My page</a>}
                    {props.currentUser && <a className="header-link" href='#' onClick={signOut}>Log out</a>}
                </div>
            </div>
            <h1 className="heading">CHALLENGER!</h1>
        </div>
    );
}