import React, { Component } from 'react';
import firebase from './Firebase.js';
import Challenge from './Challenge/Challenge.js';


const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db

export default class ChallengesList extends Component{

    state = {
        challenges: [],
    }

    componentDidMount(){
        //hämtar alla förändringar byt till den uppdelade varianten??   
        db.ref(`challenges`).on('value', (snapshot) => {
            const challenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({challenges: challenges})
        })
    }

    
    render(){

        let listOfChallenges = [];
        if(this.props.currentUser){
            this.state.challenges.filter((item) =>{
                return item.value.createdBy === this.props.currentUser;
            }).map((item, index) => {
                listOfChallenges.push(<Challenge key={index} heading={item.value.heading} description={item.value.description} user={this.state.user}></Challenge>);
                console.log(item.value.heading);
                return <Challenge key={index} heading={item.value.heading} description={item.value.description} user={this.state.user}></Challenge>
            })
        }
        else{
            this.state.challenges.map((item, index) => {
                listOfChallenges.push(<Challenge key={index} heading={item.value.heading} description={item.value.description} user={this.state.user}></Challenge>);                
                console.log(item.value.heading);
                return <Challenge key={index} heading={item.value.heading} description={item.value.description} user={this.state.user}></Challenge>
            })
        }

        console.log(listOfChallenges);

        return(
            <div>
                <ul>
                    {listOfChallenges}
                </ul>
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