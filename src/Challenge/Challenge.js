import React from 'react';
import './Challenge.css'
import NavTab from '../TabsAndLinks/NavTab.js';
import ToArray from '../util//ToArray.js'


export default function challenge(props){
 
    //to see if enddate is set or not, endDate is optional
    let endDate = ''
    if(props.endDate){
        endDate = new Date(props.endDate).toString().substr(4, 11);
    }else{
        endDate = 'none';
    }


    //to see if the logged in user is in the list of those who have accepted the challenge
    let isAccepted = ToArray(props.acceptedBy).find((accepted) => { //ToArray = function that takes an object and returns an array
        if(accepted.value === props.user.username){
            return true;
        }else{
            return false;
        }
    })

    //creates different classnames depending on category 
    let categoryColor = '';
    if(props.category === 'physical'){
        categoryColor = 'green';
    }
    if(props.category === 'mental'){
        categoryColor = 'orange';
    }
    if(props.category === 'social'){
        categoryColor = 'purple';
    }


    return( 
        <li className="challengeBox">
            <div className={`category-flag ${categoryColor}`}>{props.category}</div>
            <h5>{props.heading}</h5>
            <p>{props.description}</p>
            <div className="challenge-buttomNav">
                <p>End date: {endDate}</p>
                <p>Created by: {props.createdBy}</p>
                {props.acceptedBy && <p> AcceptedBy: {ToArray(props.acceptedBy).length}</p>} 
                {!props.type && !isAccepted && props.user && <a className="challenge-green-text" href='#' onClick={props.onClick}>Accept callenge</a>}
                {(props.type === 'accepted' || isAccepted) && props.user &&  <p className="challenge-red-text">Accepted</p>}
                {props.type === 'accepted' && <a className="challenge-green-text" href='#' onClick={props.onClick}>Complete</a>}
                {props.type === 'completed' &&  <p className="challenge-red-text">Completed</p>}
            </div>
        </li>
    )
}



