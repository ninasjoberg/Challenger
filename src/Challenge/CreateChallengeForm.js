import React, { Component } from 'react';
import DayPicker from './DayPicker.js'; 
import  './CreateChallengeForm.css'


export default function createChallangeForm (props) {

    console.log(props.createNew)
    

    return(
        <aside className={`create-challenge ${props.className}`}>
            <a href='#' onClick={() => props.showHide('hidden')}>X</a>
            <h5>Create new challenge</h5>
            <form onSubmit={props.onSubmit} className="newChallengeForm">
                <div className="create-div">
                    <input className="create-input" type="text" name="heading" onChange={props.onChange} value={props.valueHead} placeholder="Challenge name"></input>
                </div>
                <br/>
                <div className="create-div">
                    <textarea className="create-input" type="text" name="description" onChange={props.onChange} style={{height: "10rem"}} value={props.valueDesc} placeholder="Description"></textarea>
                </div>
                <br/>
                <div className="create-div">
                    <a href="#" onClick="">End date *(optional)</a>
                    <div className="calendar-background">
                        <DayPicker onDayClick={props.onDayClick}/>
                    </div>
                </div>
                <br/>
                <div className="create-div">
                    <label>Select a category</label>
                    <div className="create-input">
                        <a href='#' name='physical' onClick={props.addCategory}>physical</a>
                        <a href='#' name='mental' onClick={props.addCategory}>mental</a>
                        <a href='#' name='social' onClick={props.addCategory}>social</a>
                    </div>
                </div>
                <br/>
                <input className="btn btn-primary" type="submit" value="Create" />
            </form>
        </aside>
    )

}



