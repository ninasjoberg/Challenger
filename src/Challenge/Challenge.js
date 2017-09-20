import React from 'react';
import './Challenge.css'





export default function challenge(props){

    return(
        <li className="challengeBox">
            <h5>{props.heading}</h5>
            <p>{props.description}</p>
            {props.user && <button onClick=''>Accept callenge</button>}
        </li>
    )
}
