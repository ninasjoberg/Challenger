import React from 'react';
import Alink from './Alink.js';
import './WhiteColoredLink.css'


//higher order component that gives the link a specific className
export default function WhiteColoredLink(props){
    return <Alink {...props} className="white-link"/>
}




