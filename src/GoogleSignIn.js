import React, { Component } from 'react';
import firebase from './Firebase.js';

let provider = new firebase.auth.GoogleAuthProvider();


function signInGoogle () {
    firebase.auth().signInWithRedirect(provider);

    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // ...
        }
        // The signed-in user info.
        var user = result.user;
        return user;
        console.log(user);

    }).then((user) => {
        //hur får jag in denna användare i databasen?? Fel plats??
        firebase.database() //för att lagra användarinfo i själva databasen! här lagrar vi användarens email under users
        .ref(`users/${user.uid}`)
        .set({email: user.email, uid: user.uid, username: user.displayName}); //om ett värde inte finns komer det bli null i firebase
    })
      
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    })
}



export default function GoogleSignIn(props){


    return(
        <div>
            <a  href='#' onClick={signInGoogle}>Sign in with google</a>
        </div>
    )

}