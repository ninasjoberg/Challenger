import React, { Component } from 'react';
import DayPicker from './DayPicker.js';


export default function createChallangeForm (props) {

    return(
        <aside className="create-challenge">
            <h5>Create a new challenge</h5>
            <form onSubmit={props.onSubmit} className="newChallenge" style ={{maxWidth: "50%", margin: "5rem auto"}}>
                <div>
                    <label>Challenge</label>
                    <input type="text" name="heading" onChange={props.onChange} value={props.valueHead}></input>
                </div>
                <div>
                    <label>Description</label>
                    <textarea type="text" name="description" onChange={props.onChange} style={{height: "10rem"}} value={props.valueDesc}></textarea>
                </div>
                <div>
                    <p>Has an end date?:</p>
                    <DayPicker onDayClick={props.onDayClick}/>
                </div>
                <div>
                    <p>Select a category</p>
                    <a href='#' name='physical' onClick={props.addCategory}>physical</a>
                    <a href='#' name='mental' onClick={props.addCategory}>mental</a>
                    <a href='#' name='social' onClick={props.addCategory}>social</a>
                </div>
                <input className="btn btn-primary" type="submit" value="Create" />
            </form>
        </aside>
    )

}



