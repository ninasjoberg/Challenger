import React, { Component } from 'react';
import firebase from '../util/Firebase.js';
import './UserPage.css';
import Challenge from '../Challenge/Challenge.js';
import NavTab from '../TabsAndLinks/NavTab.js';
import CreateChallengeForm from '../Challenge/CreateChallengeForm.js'
import ToArray from '../util/ToArray.js'


//to avoid write firebase.database() all the time in the code, now we can write db instead
const db = firebase.database();


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

    //built in function "componentDidMount" that runs when the website reloads
    componentDidMount(){
        //gets the current users accepted callenges list from firebase, and adds it to state
        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges`).on('value', (snapshot) => {
            const acpChallenges = ToArray(snapshot.val()); //ToArray = function that takes an object and returns an array
            this.setState({acceptedChallenges: acpChallenges})
        })
    }

    //sets the state based on the name and value from the current inputfield
    addChallenge = (event) => {
        this.setState({[event.target.name] : event.target.value}) 
    }

    //function called when the create challange for is submitted
    addChallengeToDb = (event) => {
        event.preventDefault(); //prevent the page to reload when the form is submitted
        
        //creating errormessages based on input values from the registerform 
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
        if(this.state.heading && this.state.heading.length > 40){
            createNameMess = 'The heading can not be more than 40 characthers long!';
            error = true;
        }
        if(this.state.DescriptionMess && this.state.DescriptionMess.length > 100){
            createDescriptionMess = 'The description can not be more than 100 characthers long!';
            error = true;
        } 
        //if we have no errors in the frontEnd, push the challenge info to firebase db
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
            .then(this.setState({heading: '', description: '', endDate: '', category: ''})) //sets state to empty strings which clears the inputfields
        }
        this.setState({errorCreateName: createNameMess})
        this.setState({errorCreateDescription: createDescriptionMess})
        this.setState({errorCreateCategory: createCategoryMess})
        this.setState({error: error})
        this.setState({createNew: 'hidden'})  
        this.setState({selectedType: 'created by Me'})     
    }

    //sets the input from the calendar to state
    handleDayClick = (event) => {
        let endDate = Date.parse(event)
        this.setState({selectedDay: endDate})
    }

    //the input from the category field to state
    addCategory = (event) => {
        event.preventDefault();
        this.setState({category: event.target.name})
    }

    //if the completed challange button is pressed, the current challange is set till completed: true for the current user in Forebase db
    completedChallenge = (item) => {
        db.ref(`users/${this.props.currentUser.userId}/acceptedChallenges/${item.key}/completed`).set(true)
    }

    //sets the state selectedType based on which category navTab is selected
    filterType = (event) => {
        this.setState({selectedType: event.target.type})
    }

    //sets the state createNew, which is used for className to decied if the "create new challenge form" will be showed or not 
    createNew = (value) => {
        this.setState({createNew: value})
    }



    render(){

        //returns a list with styled challenge component for every accepted challange if it is not completed yet
        const usersAcceptedChallenges = this.state.acceptedChallenges.filter((item) => {
            return item.value.completed != true;
        }).map((item, index) => {
            return <Challenge key={index} {...item.value} type='accepted' user={this.props.currentUser} onClick={() => {this.completedChallenge(item)}}/>            
        })

        //returns a list with styled challenge component for every challenge that is completed
        const completedChallenges = this.state.acceptedChallenges.filter((item) => {
            return item.value.completed === true;
        }).map((item, index) => {
            return <Challenge key={index} {...item.value} type='completed' user={this.props.currentUser} />            
        })

        //returns a list with styled challenge component for every challenge that is created by the currentuser
        const usersCreatedChallenges = this.props.challenges.filter((item)=> { 
            return item.value.createdBy === this.props.currentUser.username;            
        }).map((item, index) => {
             return <Challenge key={index} {...item.value} user={this.props.currentUser} />
        })

        
        const noChallenges = (usersAcceptedChallenges.length === 0) ? 'noChallanges' : '';
    

        return (
            <div className="user-page">
                <h1>{this.props.currentUser.username}'s page</h1>
                <div>
                    <div className="userpage-linkbar">
                        <a className="userpage-link" href='#' onClick={() => this.props.goTo('home')}>see all challenges</a>
                        <a className="userpage-link" href='#' onClick={() => this.createNew('visible')}>create new challenge</a>
                    </div>

                    <CreateChallengeForm 
                        onSubmit={this.addChallengeToDb} 
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
                            <NavTab role="presentation" type='accepted' selectedType={this.state.selectedType} onClick={this.filterType}/>
                            <NavTab role="presentation" type='completed' selectedType={this.state.selectedType} onClick={this.filterType}/>
                            <NavTab role="presentation" type='created by Me' selectedType={this.state.selectedType} onClick={this.filterType}/>
                        </ul>
                        <div className="users-Challenges">  
                            <ul>
                                {this.state.selectedType == 'accepted' && noChallenges && <h5>You have no accepted challenges at the moment. <a href='#' onClick={() => this.props.goTo('home')}>Accept a challenge!</a> </h5>}
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
