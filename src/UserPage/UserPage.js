import React, { Component } from 'react';
import firebase from '../Firebase.js';
import './UserPage.css';
import Challenge from '../Challenge/Challenge.js';
import NavTab from '../NavTab.js';
import CreateChallangeForm from '../CreateChallangeForm.js'



const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class UserPage extends Component {

    state = {
        heading: '',
        description: '',
        acceptedChallenges: [],
        completedChallenges: [],
        selectedDay: '',
        category: '',
        selectedType: 'accepted'
    }


    componentDidMount(){

        //gör detta med map o filter i react ist??

        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`).on('value', (snapshot) => {
            const acpChallenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({acceptedChallenges: acpChallenges})
        })

        db.ref(`users/${this.props.currentUser.userId}/completedChallenges`).on('value', (snapshot) => {
            const compChallenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({completedChallenges: compChallenges})
        })
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
            createdBy: this.props.currentUser.username,
            category: this.state.category,
            endDate: this.state.selectedDay
        }
        db.ref('challenges')
        .push(challenge)
        .then(this.setState({heading: '', description: '', endDate: '', category: ''}))
    }


    handleDayClick = (event) => {
        console.log(event);
        let endDate = Date.parse(event)
        this.setState({selectedDay: endDate})
    }

    addCategory = (event) => {
        console.log(event.target.name);
        this.setState({category: event.target.name})
    }

    completedChallenge = (item) => {

        console.log(item);

        const completedChallenge = {
            challengeId: item.key,
            heading: item.value.heading,
            description: item.value.description,
            createdBy: item.value.createdBy,
            endDate: item.value.endDate,
            category: item.value.category
        }

        db.ref(`users/${this.props.currentUser.userId}/completedChallenges`)
        .push(completedChallenge)
    }

    
    filteType = (event) => {
        this.setState({selectedType: event.target.type})
    }


   

    render(){

        const usersCreatedChallenges = this.props.challenges.filter((item)=> { 
            console.log(item.value.createdBy);
            console.log(this.props.currentUser.username);
            return item.value.createdBy === this.props.currentUser.username;            
        }).map((item, index) => {
             return <Challenge key={index} {...item.value}/>
        })


        const usersAcceptedChallenges = this.state.acceptedChallenges.map((item, index) => {
            return <Challenge key={index} {...item.value} type='accepted' onClick={() => {this.completedChallenge(item)}}/>
        })


        const completedChallenges = this.state.completedChallenges.map((item, index) => {
            return <Challenge key={index} {...item.value}/>
        })

        console.log(this.state.completedChallenges);

        return (
            <div>
                <h1>{this.props.currentUser.username}'s page</h1>
                <div className="user-page">
                    <CreateChallangeForm onSubmit={this.addToDb} onChange={this.addChallenge} valueHead={this.state.heading} valueDesc={this.state.description} onDayClick={this.handleDayClick} addCategory={this.addCategory}/>
                    <article className="userPage-main">
                        <ul className="nav nav-tabs">
                            <NavTab role="presentation" type='accepted' selectedType={this.state.selectedType} onClick={this.filteType}/>
                            <NavTab role="presentation" type='completed' selectedType={this.state.selectedType} onClick={this.filteType}/>
                            <NavTab role="presentation" type='created by Me' selectedType={this.state.selectedType} onClick={this.filteType}/>
                        </ul>
                        <div className="users-Challenges">
                            <ul>
                                 {this.state.selectedType == 'accepted' && usersAcceptedChallenges}
                            </ul>
                            <ul>
                                {this.state.selectedType == 'created by Me' && usersCreatedChallenges}
                            </ul>
                            <ul>
                                {this.state.selectedType == 'completed' && completedChallenges}
                            </ul>
                        </div>
                    </article>
                </div>
            </div>
        );
    }
}


function toArray(firebaseObj){
    let array = [];
    for(let item in firebaseObj){
      array.push({key: item, value: firebaseObj[item]}) //här måste man sätta varje enskilt objekt till value för att sen enkelt komma åt alla värden 
    }
    return array;
}