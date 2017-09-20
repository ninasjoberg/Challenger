import React, { Component } from 'react';
import ChallengesList from './ChallengesList.js';



export default function Home(props){

    return(
        <div>
            <h5>All Challenges:</h5>
            <ul>
                <ChallengesList/>
            </ul>
        </div>
    );
}    



