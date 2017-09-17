import React from 'react';

export default function Home(props){

    return(
        <div>
            <button onClick={() => props.goTo('login')}>Login</button>
            <button onClick={() => props.goTo('register')}>Register</button>
        </div>
    );
}