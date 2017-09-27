import React, { Component } from 'react';
import firebase from '../Firebase.js';
import './UserPage.css';
import Challenge from '../Challenge/Challenge.js';
import NavTab from '../Tabs/NavTab.js';
import CreateChallengeForm from '../Challenge/CreateChallengeForm.js'



const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class UserPage extends Component {

    state = {
        heading: '',
        description: '',
        selectedDay: '',
        category: '',
        selectedType: 'accepted', 
        createNew: 'hidden'
    }

/*
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
*/


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
        let endDate = Date.parse(event)
        this.setState({selectedDay: endDate})
    }

    addCategory = (event) => {
        event.preventDefault();
        this.setState({category: event.target.name})
    }

    completedChallenge = (item) => {
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

        db.ref(`challenges/${item.key}/completedBy`)
        .push(this.props.currentUser.username)
    }

    
    filteType = (event) => {
        this.setState({selectedType: event.target.type})
    }

    createNew = (value) => {
        this.setState({createNew: value})
    }


   

    render(){

        const usersCreatedChallenges = this.props.challenges.filter((item)=> { 
            return item.value.createdBy === this.props.currentUser.username;            
        }).map((item, index) => {
             return <Challenge key={index} {...item.value} user={this.props.currentUser} />
        })



        const usersAcceptedChallenges = this.props.challenges.map((item, index) => {
            const accepted = toArray(item.value.acceptedBy).find((accepted) => {
                return accepted.value === this.props.currentUser.username;
            })
            if(accepted){
                return <Challenge key={index} {...item.value} user={this.props.currentUser} type='accepted' onClick={() => {this.completedChallenge(item)}}/>  
            }else{
                return null;
            }
        })


        const completedChallenges = this.props.challenges.map((item, index) => {
            const completed = toArray(item.value.completedBy).find((completed) => {
                return completed.value === this.props.currentUser.username;
            })
            if(completed){
                return <Challenge key={index} {...item.value} user={this.props.currentUser} />
            }else{
                return null;                
            }
        })



        return (
            <div className="user-page">
                <h1>{this.props.currentUser.username}'s page</h1>
                <div>
                    <div className="userpage-linkbar">
                        <a className="userpage-link" href='#' onClick={() => this.props.goTo('home')}>see all challenges</a>
                        <a className="userpage-link" href='#' onClick={() => this.createNew('visible')}>create new challenge</a>
                    </div>
                    <CreateChallengeForm 
                        onSubmit={this.addToDb} 
                        onChange={this.addChallenge} 
                        valueHead={this.state.heading} 
                        valueDesc={this.state.description} 
                        onDayClick={this.handleDayClick} 
                        addCategory={this.addCategory}
                        className={this.state.createNew}
                        showHide={this.createNew}
                    />

                
                    <article className="userPage-main">
                        <ul className="nav nav-tabs">
                            <NavTab role="presentation" type='accepted' selectedType={this.state.selectedType} onClick={this.filteType}/>
                            <NavTab role="presentation" type='completed' selectedType={this.state.selectedType} onClick={this.filteType}/>
                            <NavTab role="presentation" type='created by Me' selectedType={this.state.selectedType} onClick={this.filteType}/>
                        </ul>
                        <div className="users-Challenges">  
                            <ul>
                                {this.state.selectedType == 'accepted' && usersAcceptedChallenges}
                                {this.state.selectedType == 'created by Me' && usersCreatedChallenges}
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