import React from 'react';
import './Challenge.css'
import NavTab from '../Tabs/NavTab.js';


export default function challenge(props){
 
    let endDate = ''
    if(props.endDate){
        endDate = new Date(props.endDate).toString().substr(4, 11);
    }else{
        endDate = 'none';
    }


    console.log(props.acceptedBy);

    //kollar om den inloggade användaren finns med i listan över de som accepterat utmaningen.
    let isAccepted = toArray(props.acceptedBy).find((accepted) => {
        if(accepted.value === props.user.username){
            return true;
        }else{
            return false;
        }
    })

    let buttonColor = '';
    if(props.category === 'physical'){
        buttonColor = 'green';
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
                <p>End date: {endDate}</p>
                <p>Created by: {props.createdBy}</p>
                {props.acceptedBy && <p> AcceptedBy: {toArray(props.acceptedBy).length}</p>} 
                {!props.type && !isAccepted && props.user && <a className="challenge-green-text" href='#' onClick={props.onClick}>Accept callenge</a>}
                {(props.type === 'accepted' || isAccepted) && props.user &&  <p className="challenge-red-text">Accepted</p>}
                {props.type === 'accepted' && <a className="challenge-green-text" href='#' onClick={props.onClick}>Complete</a>}
                {props.type === 'completed' &&  <p className="challenge-red-text">Completed</p>}
            </div>
        </li>
    )
}


function toArray(firebaseObj){
    let array = [];
    for(let item in firebaseObj){
      array.push({key: item, value: firebaseObj[item]}) //här måste man sätta varje enskilt objekt till value för att sen enkelt komma åt alla värden 
    }
    return array;
  }

