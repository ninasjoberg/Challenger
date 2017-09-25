import React from 'react';
import './NavTab.css';

export default function NavTab (props){

    let buttonColor = 'nav-link ';
    if(props.type === 'physical'){
        buttonColor += 'green';
    }
    if(props.type === 'mental'){
        buttonColor += 'orange';
    }
    if(props.type === 'social'){
        buttonColor += 'purple';
    }
    if(props.type === 'all'){
        buttonColor += 'grey';
    }
    if(props.type === 'accepted'){
        buttonColor += 'red';
    }
    if(props.type === 'completed'){
        buttonColor += 'blue';
    }
    if(props.type === 'created by Me'){
        buttonColor += 'yellow';
    }

    if(props.selectedType === props.type){
        buttonColor += ' active';
    }


    return(        
        <li className={`nav-item`} role={props.role} onClick={props.onClick}>
            <a className={buttonColor} href='#' type={props.type}>{props.type}</a>
        </li>
    )

}