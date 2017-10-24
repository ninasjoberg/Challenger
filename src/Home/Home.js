import React, { Component } from 'react';
import firebase from '../util/Firebase.js';
import './Home.css';
import Challenge from '../Challenge/Challenge.js';
import NavTab from '../TabsAndLinks/NavTab.js';


const db = firebase.database(); //to avoid write firebase.database() all the time in the code, now we can write db instead

export default class Home extends Component{

    state = {
        selectedCategory: 'all',
    }

    //function that is called when the "accept challange" button is pressed
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

        //pushes the accepted challenge info to the user's acceptedChallenges list, Firebase
        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`)
        .push(acceptedChallenge)

        //pushes the username to the acceptedBy list in the current challenge, Firebase
        db.ref(`challenges/${item.key}/acceptedBy`)
        .push(this.props.currentUser.username)
    }


    filterCategory = (event) => {
        console.log(event.target.type);
        this.setState({selectedCategory: event.target.type})
    }


    render(){

        //returns a list with styled challenge component for every challenge in the list
        const challengesList = this.props.challenges.map((item, index) => {
            return <Challenge key={index} {...item.value} user={this.props.currentUser} onClick={() => {this.acceptChallenge(item)}}/>
        })

        //returns a list with styled challenge component for every challenge that matches the selected category 
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



