import React from 'react';

export default function LoginForm(props) {

    return (
        <div>
            <h1>Login</h1>

            <form style={{ maxWidth: "50%", margin: "5rem auto" }}>
                <div>
                    <label htmlFor="email">email-address</label>
                    <input type="text" className="form-control" name="email"></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="text" className="form-control" name="password"></input>
                </div>
                <input className="btn btn-primary" onClick="" type="submit" value="Login" />
            </form>
        </div>
    );
}