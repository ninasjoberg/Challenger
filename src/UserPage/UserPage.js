import React, { Component } from 'react';
import firebase from '../Firebase.js';
import './UserPage.css';
import ChallengesList from '../ChallengesList.js';

const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class UserPage extends Component {

    state = {
        heading: '',
        description: '',
        challenges: []
    }


    addChallenge = (event) => {
        this.setState({[event.target.name] : event.target.value}) //<-- detta kommer fungera för alla inputfält när man skrivit såhär, så länge "name" är samma som något som finns i statet        
    }

    //lägger till inputen (från state) till firebase
    addToDb = (event) => {
        event.preventDefault(); //<-- så att inte infon skickas iväg o sidan laddas om, då detta kommer gäras med state ist
        
        const challenge = {
            heading: this.state.heading,
            description: this.state.description,
            createdBy: this.props.currentUser
        }
        db.ref('challenges')
        .push(challenge)
        .then(this.setState({heading: '', description: ''}))
    }

    render(){

        const listOfChallenges = this.state.challenges.map((item, index) => {
            console.log(item.value.heading);
            return <li>
                <p>{item.value.heading}</p>
            </li>
        })

        console.log(this.props);

      

        return (
            <div>
                <h1>{this.props.currentUser}'s page</h1>
                <div className="user-page">
                <aside className="create-challenge">
                    <h5>Create a new challenge</h5>
                    <form onSubmit={this.addToDb} className="newChallenge" style ={{maxWidth: "50%", margin: "5rem auto"}}>
                        <div>
                            <label>Challenge</label>
                            <input type="text" name="heading" onChange={this.addChallenge} value={this.state.heading}></input>
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea type="text" name="description" onChange={this.addChallenge} style={{height: "10rem"}} value={this.state.description}></textarea>
                        </div>
                        <input className="btn btn-primary" type="submit" value="Create" />
                    </form>
                </aside>

                <article className="my-challenges">
                    <h5>My accepted challenges:</h5>
                    <ul>

                    </ul>

                    <h5>Challenges created by Me:</h5>
                    <ul>
                        <ChallengesList currentUser={this.props.currentUser}/>
                    </ul>
                </article>
                </div>
            </div>
        );
    }
}


