import React from 'react';
import './NavTab.css';

export default function NavTab (props){

    let buttonColor = '';
    if(props.type === 'physical'){
        buttonColor = 'blue';
    }
    if(props.type === 'mental'){
        buttonColor = 'orange';
    }
    if(props.type === 'social'){
        buttonColor = 'purple';
    }
    if(props.type === 'all'){
        buttonColor = 'grey';
    }
    if(props.type === 'accepted'){
        buttonColor = 'red';
    }
    if(props.type === 'completed'){
        buttonColor = 'green';
    }
    if(props.type === 'created by Me'){
        buttonColor = 'yellow';
    }
  

    console.log(props.type);
    console.log(buttonColor);

    return(        
        <li className={`nav-item`} role={props.role} onClick={props.onClick}>
            <a className={`nav-link ${buttonColor}`} href='#' type={props.type}>{props.type}</a>
        </li>
    )

}