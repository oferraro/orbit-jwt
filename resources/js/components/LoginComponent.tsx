import axios from "axios";
import React, { Component } from 'react';

export class LoginComponent extends Component<any, any> {
    render() {
        return (
            <div className="sign-up-form">
                <div className="vertical-center">
                    <div className="form-title">Sign Up</div>
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
                                className="submit-button">SIGN UP
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
