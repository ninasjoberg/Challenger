import React, { Component } from 'react';
import firebase from './Firebase.js';
import './Home.css';
import Challenge from './Challenge/Challenge.js';
import NavTab from './NavTab.js';


const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class Home extends Component{


    state = {
        allChallenges: [],
        selectedCategory: 'all'
    }


    componentDidMount(){
        //hämtar alla förändringar byt till den uppdelade varianten??   
        db.ref(`challenges`).on('value', (snapshot) => {
            const allChallenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({allChallenges: allChallenges})
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
    }

    filterCategory = (event) => {
        console.log(event.target.type);
        this.setState({selectedCategory: event.target.type})
        
    }


    render(){

        const challengesList = this.state.allChallenges.map((item, index) => {
            return <Challenge key={index} {...item.value} user={this.props.currentUser} onClick={() => {this.acceptChallenge(item)}}/>
        })

        const challengesListByCategory = this.state.allChallenges.filter((item) => {
            return item.value.category === this.state.selectedCategory;
        }) 
        .map((item, index) => {
            return <Challenge key={index} {...item.value} user={this.props.currentUser} onClick={() => {this.acceptChallenge(item)}}/>
        })

        console.log(this.state.selectedCategory);

        return(
            <div className="home-main">
                <ul className="nav nav-tabs">
                    <NavTab role="presentation" class="active" type='all' onClick={this.filterCategory}/>
                    <NavTab role="presentation" type='mental' onClick={this.filterCategory}/>
                    <NavTab role="presentation" type='physical' onClick={this.filterCategory}/>
                    <NavTab role="presentation" type='social' onClick={this.filterCategory}/>
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



