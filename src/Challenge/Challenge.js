import React from 'react';
import './Challenge.css'
import NavTab from '../NavTab.js';




export default function challenge(props){
 
    const endDate = new Date(props.endDate).toString().substr(4, 11);


    let buttonColor = '';
    if(props.category === 'physical'){
        buttonColor = 'blue';
    }
    if(props.category === 'mental'){
        buttonColor = 'orange';
    }
    if(props.category === 'social'){
        buttonColor = 'purple';
    }
    if(props.category === 'all'){
        buttonColor = 'grey';
    }


    return( 
        <li className="challengeBox">
            <div className={`category-flag ${buttonColor}`}>{props.category}</div>
            <h5>{props.heading}</h5>
            <p>{props.description}</p>
            <div className="challenge-buttomNav">
                {props.endDate && <p>End date: {endDate}</p>}
                <p>Created by: {props.createdBy}</p>
                {props.user && <a className="accept-click" href='#' onClick={props.onClick}>Accept callenge</a>}
                {props.type === 'accepted' && <a className="complete-click" href='#' onClick={props.onClick}>Completed</a>}
            </div>
        </li>
    )
}
