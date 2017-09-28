import React, { Component } from 'react';
import firebase from '../Firebase.js';
import './Home.css';
import Challenge from '../Challenge/Challenge.js';
import NavTab from '../Tabs/NavTab.js';


const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class Home extends Component{


    state = {
        selectedCategory: 'all',
    }

    acceptChallenge = (item) => {
        
        const acceptedChallenge = {
            challengeId: item.key,
            heading: item.value.heading,
            description: item.value.description,
            createdBy: item.value.createdBy,
            endDate: item.value.endDate,
            category: item.value.category,
            completed: false
        }

        const acceptedBy = {
            username: this.props.currentUser.username,
            completed: false
        }

        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`)
        .push(acceptedChallenge)

        //lägg in dett ist så att completed kommer med även här? 
        // db.ref(`challenges/${item.key}/acceptedBy`)
        // .push(acceptedBy)

        db.ref(`challenges/${item.key}/acceptedBy`)
        .push(this.props.currentUser.username)
    }


    filterCategory = (event) => {
        this.setState({selectedCategory: event.target.type})
    }


    render(){

        console.log(this.props.currentUser);

        const challengesList = this.props.challenges.map((item, index) => {
            return <Challenge key={index} {...item.value} user={this.props.currentUser} onClick={() => {this.acceptChallenge(item)}}/>
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



