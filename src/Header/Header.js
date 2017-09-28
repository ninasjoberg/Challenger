import React from 'react';
import firebase from '../util/Firebase.js';
import './Header.css';
import WhiteColoredLink from '../TabsAndLinks/WhiteColoredLink.js'


//signout Firebase
function signOut(props){
    firebase
    .auth()
    .signOut()
    .then(() => {
        props.goTo('home')
    })
    .catch(error => console.log(error));  
}

export default function Header(props){

    return(
        <div className="header">
            <div className="header-links">
                <WhiteColoredLink title='Home' onClick={() => props.goTo('home')}/>}
                <div className="white-text">
                    {props.currentUser && <p>You are logged in as: {props.currentUser.username}</p>}
                    {!props.currentUser && <WhiteColoredLink title='Login' onClick={() => props.goTo('login')}/>}
                    {!props.currentUser && <WhiteColoredLink title='Register' onClick={() => props.goTo('register')}/>}
                    {props.currentUser && <WhiteColoredLink title='My page' onClick={() => props.goTo('userpage')}/>}
                    {props.currentUser && <WhiteColoredLink title='Log out' onClick={() => signOut(props)}/>}
                </div>
            </div>
            <h1 className="heading">CHALLENGER!</h1>
            <p className="white-text text">Push yourself to new things by challenging others or assuming others' challenges. 
               <a href="#" className="green-text" onClick={() => props.goTo('login')}> Create a challenge here!</a> 
            </p>
        </div>
    );
}