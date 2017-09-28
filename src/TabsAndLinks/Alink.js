import React from 'react';

export default function Alink(props){
    return(
        <div>
            <a href='#' onClick={props.onClick} className={props.className}>
                {props.title}
            </a>
        </div>
    )
}



