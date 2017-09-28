import React, { Component } from 'react';
import DayPicker from './DayPicker.js'; 
import  './CreateChallengeForm.css'


export default function createChallangeForm (props) {

    //if we get an error, use the bootstrap className 'has-danger' for styling
    const hasError = props.error ? 'has-danger' : '';       

    return(
        <aside className={`create-challenge ${props.className}`}>
            <a className="close-button" href='#' onClick={() => props.showHide('hidden')}>Close</a>
            <h5>Create new challenge</h5>
            <form onSubmit={props.onSubmit} className="newChallengeForm">
                <div className={`form-group ${hasError} create-div`}>
                    <input className="create-input form-control" type="text" name="heading" onChange={props.onChange} value={props.valueHead} placeholder="Challenge name"></input>
                    {props.nameMess && <div className="form-control-feedback">{props.nameMess}</div>}   
                </div>
                <br/>
                <div className={`form-group ${hasError} create-div`}>
                    <textarea className="create-input form-control" type="text" name="description" onChange={props.onChange} style={{height: "10rem"}} value={props.valueDesc} placeholder="Description"></textarea>
                    {props.descriptionMess && <div className="form-control-feedback">{props.descriptionMess}</div>}   
                </div>
                <br/>
                <div className="create-div">
                    <p>End date *(optional)</p>
                    <div className="calendar-background">
                        <DayPicker onDayClick={props.onDayClick}/>
                    </div>
                </div>
                <br/>
                <div className={`form-group ${hasError} create-div`}>
                    <label>Select a category</label>
                    <div className="create-input">
                        <a href='#' name='physical' onClick={props.addCategory}>physical</a>
                        <a href='#' name='mental' onClick={props.addCategory}>mental</a>
                        <a href='#' name='social' onClick={props.addCategory}>social</a>
                        {props.categoryMess&& <div className="form-control-feedback">{props.categoryMess}</div>}   
                    </div>
                </div>
                <br/>
                <input className="btn btn-primary" type="submit" value="Create" />
            </form>
        </aside>
    )

}



