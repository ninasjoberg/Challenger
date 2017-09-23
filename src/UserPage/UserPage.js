import React, { Component } from 'react';
import firebase from '../Firebase.js';
import './UserPage.css';
import Challenge from '../Challenge/Challenge.js';
import NavTab from '../NavTab.js';
import DayPicker from '../DayPicker.js';



const db = firebase.database(); //för att slippa skriva ut hela grejen varje gång nedan. nu kan vi använda bara db


export default class UserPage extends Component {

    state = {
        heading: '',
        description: '',
        challenges: [],
        acceptedChallenges: [],
        completedChallenges: [],
        selectedDay: '',
        category: ''
    }


    componentDidMount(){
        //hämtar alla förändringar byt till den uppdelade varianten??   
        db.ref(`challenges`).on('value', (snapshot) => {
            const challenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({challenges: challenges})
        })

        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`).on('value', (snapshot) => {
            const acpChallenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({acceptedChallenges: acpChallenges})
        })

        db.ref(`users/${this.props.currentUser.userId}/completedChallenge`).on('value', (snapshot) => {
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

        db.ref(`users/${this.props.currentUser.userId}/completedChallenge`)
        .push(completedChallenge)
    }

   

    render(){

        const usersCreatedChallenges = this.state.challenges.filter((item)=> {
            return item.value.createdBy === this.props.currentUser.username;            
        })
        .map((item, index) => {
             return <Challenge key={index} {...item.value}/>
        })

        const usersAcceptedChallenges = this.state.acceptedChallenges.map((item, index) => {
            return <Challenge key={index} {...item.value} type='accepted' onClick={() => {this.completedChallenge(item)}}/>
        })

        const completedChallenges = this.state.completedChallenges.map((item, index) => {
            return <Challenge key={index} {...item.value}/>
        })

        console.log(completedChallenges);


        return (
            <div>
                <h1>{this.props.currentUser.username}'s page</h1>
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
                        <div>
                            <p>Has an end date?:</p>
                            <DayPicker onDayClick={this.handleDayClick}/>
                        </div>
                        <div>
                            <p>Select a category</p>
                            <a href='#' name='physical' onClick={this.addCategory}>physical</a>
                            <a href='#' name='mental' onClick={this.addCategory}>mental</a>
                            <a href='#' name='social' onClick={this.addCategory}>social</a>
                        </div>
                        <input className="btn btn-primary" type="submit" value="Create" />
                    </form>
                </aside>

                <article className="userPage-main">
                    <ul className="nav nav-tabs">
                        <NavTab role="presentation" class="active" type='accepted' onClick={this.filterCategory}/>
                        <NavTab role="presentation" type='completed' onClick={this.filterCategory}/>
                        <NavTab role="presentation" type='created by Me' onClick={this.filterCategory}/>
                    </ul>
                    <div className="users-Challenges">
                        <ul>
                            {usersAcceptedChallenges}
                        </ul>
                        <ul>
                            {usersCreatedChallenges}
                        </ul>
                        <ul>
                            {completedChallenges}
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