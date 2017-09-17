import React from 'react';
import './Header.css';

export default function Header(props){

    return(
        <div className="root">
            <button onClick={() => props.goTo('home')}>Home</button>
            <h1>Challenger-app!</h1>
        </div>
    );
}