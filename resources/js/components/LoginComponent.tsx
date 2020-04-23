import axios from "axios";
import React, { Component } from 'react';

export class LoginComponent extends Component<any, any> {
    constructor (props) {
        super(props);
        this.state = {show: 'signIn'};
    }
    render() {
        return (
            <div className="sign-up-form">
                <div className="vertical-center">
                    {
                        this.state.show === 'signIn' ?
                        <>
                            <div className="form-title">Sign In</div>
                            <form method="post">
                                <div className="form-control">
                                    <input type="text" placeholder="email" name="email" id="email"/>
                                </div>
                                <div className="form-control">
                                    <input type="password" name="password" id="password"/>
                                </div>
                                <div className="submit-button-container">
                                    <div
                                        onClick={() => {
                                            const emailElement = document.getElementById('email') as HTMLInputElement;
                                            const email = (emailElement) ? emailElement.value : '';
                                            const passwordElement = document.getElementById('password') as HTMLInputElement;
                                            const password = (passwordElement) ? passwordElement.value : '';

                                            axios.post(`api/access-tokens`, {
                                                email, password
                                            }).then(res => {
                                                if (res.status === 201) {
                                                    this.props.setJWTItem(res.data.jwt);
                                                }
                                            });
                                        }}
                                        className="submit-button">SIGN IN
                                    </div>
                                    <div className="create-account-link">
                                        Don't have an account?{" "}
                                        <div className="general-link"
                                             onClick={() => {
                                                 this.setState({show: 'signUp'});
                                             }}
                                        >Create an account</div>
                                    </div>
                                </div>
                            </form>
                        </> : <>
                            <div className="form-title">Sign Up</div>
                            <form method="post">
                                <div className="form-control">
                                    <input type="text" placeholder="name" name="name" id="signUpName"/>
                                </div>
                                <div className="form-control">
                                    <input type="text" placeholder="email" name="email" id="signUpEmail"/>
                                </div>
                                <div className="form-control">
                                    <input type="password" name="password" id="signUpPassword"/>
                                </div>
                                <div className="submit-button-container">
                                    <div className="submit-button"
                                         onClick={() => {
                                             const nameElement = document.getElementById('signUpName') as HTMLInputElement;
                                             const emailElement = document.getElementById('signUpEmail') as HTMLInputElement;
                                             const passwordElement = document.getElementById('signUpPassword') as HTMLInputElement;
                                             if (nameElement && emailElement && passwordElement) {
                                                 this.props.signUp({
                                                     name: nameElement.value,
                                                     email: emailElement.value,
                                                     password: passwordElement.value});
                                             }
                                         }}
                                    >SIGN IN</div>
                                </div>
                            </form>

                            </> }
                    </div>
                </div>
        );
    }
}
