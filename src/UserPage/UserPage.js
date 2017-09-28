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
        createNew: 'hidden',
        acceptedChallenges: [],
        errorCreate: false,
        errorCreateName: '',
        errorCreateDescription: '',
        errorCreateCategory: '',
    }


    componentDidMount(){
        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`).on('value', (snapshot) => {
            const acpChallenges = toArray(snapshot.val()); //toArray = en egenskapad funktion som gör obj till array
            this.setState({acceptedChallenges: acpChallenges})
        })
    }


    addChallenge = (event) => {
        this.setState({[event.target.name] : event.target.value}) //<-- detta kommer fungera för alla inputfält när man skrivit såhär, så länge "name" är samma som något som finns i statet        
    }

    //lägger till inputen (från state) till firebase
    addToDb = (event) => {
        event.preventDefault(); //<-- så att inte infon skickas iväg o sidan laddas om, då detta kommer gäras med state ist
        
        let createNameMess = '';
        let createDescriptionMess = '';
        let createCategoryMess = '';
        let error = false;

        console.log(`###${this.state.heading}`)
        if(!this.state.heading){
            createNameMess = 'type in a Name!';
            error = true;
        }    
        if(!this.state.description){
            createDescriptionMess = 'type in a Description!';
            error = true;
        }
        if(!this.state.category){
            createCategoryMess = 'you must select a category!';
            error = true;
        }    
        if(this.state.heading && this.state.heading.length > 20){
            createNameMess = 'The heading can not be more than 20 characthers long!';
            error = true;
        }
        if(this.state.DescriptionMess && this.state.DescriptionMess.length > 100){
            createDescriptionMess = 'The description can not be more than 100 characthers long!';
            error = true;
        } 
        if(error === false){
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
        console.log(error);
        this.setState({errorCreateName: createNameMess})
        this.setState({errorCreateDescription: createDescriptionMess})
        this.setState({errorCreateCategory: createCategoryMess})
        this.setState({error: error})
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
        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges/${item.key}/completed`).set(true)
        //sätt även completed till true i challangelist, alt ta bort completed när jag skapar challenge
    }

    
    filteType = (event) => {
        this.setState({selectedType: event.target.type})
    }

    createNew = (value) => {
        this.setState({createNew: value})
    }



    render(){

        console.log(this.props.currentUser.userId);

        const usersAcceptedChallenges = this.state.acceptedChallenges.filter((item) => {
            return item.value.completed != true;
        }).map((item, index) => {
            return <Challenge key={index} {...item.value} type='accepted' user={this.props.currentUser} onClick={() => {this.completedChallenge(item)}}/>            
        })


        const completedChallenges = this.state.acceptedChallenges.filter((item) => {
            return item.value.completed === true;
        }).map((item, index) => {
            return <Challenge key={index} {...item.value} type='completed' user={this.props.currentUser} />            
        })


        const usersCreatedChallenges = this.props.challenges.filter((item)=> { 
            return item.value.createdBy === this.props.currentUser.username;            
        }).map((item, index) => {
             return <Challenge key={index} {...item.value} user={this.props.currentUser} />
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
                        nameMess={this.state.errorCreateName}
                        descriptionMess={this.state.errorCreateDescription}
                        categoryMess={this.state.errorCreateCategory}
                        error={this.state.error}
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