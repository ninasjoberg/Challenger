import React, { Component } from 'react';
import firebase from './Firebase.js';
import './Home.css';
import Challenge from './Challenge/Challenge.js';
import NavTab from './NavTab.js';


const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class Home extends Component{


    state = {
        selectedCategory: 'all',
        acceptedChallenges: [],
        completedChallenges: []
    }

    componentDidMount(){
        
        //gör detta med map o filter i react ist?? Duplicerad kod från UserPage.js!!

        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`).on('value', (snapshot) => {
            const acpChallenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({acceptedChallenges: acpChallenges})
        })

        db.ref(`users/${this.props.currentUser.userId}/completedChallenge`).on('value', (snapshot) => {
            const compChallenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({completedChallenges: compChallenges})
        })
    }


    acceptChallenge = (item) => {

        const acceptedChallenge = {
            challengeId: item.key,
            heading: item.value.heading,
            description: item.value.description,
            createdBy: item.value.createdBy,
            endDate: item.value.endDate,
            category: item.value.category
        }

        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`)
        .push(acceptedChallenge)

        db.ref(`challenges/${item.key}/acceptedBy`)
        .push(this.props.currentUser.username)
    }

    filterCategory = (event) => {
        this.setState({selectedCategory: event.target.type})
        
    }


    render(){
        const challengesList = this.props.challenges.map((item, index) => {
            const found = toArray(item.value.acceptedBy).find((accepted) => {
                return accepted.value === this.props.currentUser.username; 
            })
            if(found){
                return <Challenge key={index} {...item.value} user={this.props.currentUser} accepted='true' onClick={() => {this.acceptChallenge(item)}}/>
            }
            else{
                return <Challenge key={index} {...item.value} user={this.props.currentUser} accepted='false' onClick={() => {this.acceptChallenge(item)}}/>
            }
        })


        const challengesListByCategory = this.props.challenges.filter((item) => {
            return item.value.category === this.state.selectedCategory;
        }) 
        .map((item, index) => {
            return <Challenge key={index} {...item.value} user={this.props.currentUser} onClick={() => {this.acceptChallenge(item)}}/>
        })


        return(
            <div className="home-main">
                <ul className="nav nav-tabs">
                    <NavTab role="presentation" type='all' selectedType={this.state.selectedCategory} onClick={this.filterCategory}/>
                    <NavTab role="presentation" type='mental' selectedType={this.state.selectedCategory} onClick={this.filterCategory}/>
                    <NavTab role="presentation" type='physical' selectedType={this.state.selectedCategory} onClick={this.filterCategory}/>
                    <NavTab role="presentation" type='social' selectedType={this.state.selectedCategory} onClick={this.filterCategory}/>
                </ul>
                <div className="home-challenges">
                    <ul>
                        {this.state.selectedCategory == 'all' && challengesList}
                        {this.state.selectedCategory != 'all' && challengesListByCategory}
                    </ul>
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



