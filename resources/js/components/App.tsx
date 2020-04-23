import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Global.scss';
import {LoginComponent} from "./LoginComponent";
import {MyIdeasComponent} from "./MyIdeasComponent";
import axios from "axios";

const initialState = {jwt: '', ideas: []};

class App extends Component<any, any> {
    constructor(props) {
        super(props);
        const jwt = localStorage.getItem('jwt');
        this.state = {jwt};
        this.getIdeas();
    }
    render () {
        const avatar = 'images/IdeaPool_icon.png';
        return (<div className="wrapper">
            <div className="left-bar">
                <div className="avatar">
                    <img src={avatar} className="image" />
                    <div className="text">
                        The Idea Pool
                    </div>
                    {this.state.jwt ?
                        <>
                        <hr />
                        <div className="user-data-container">
                            <div className="cursor-pointer"
                                onClick={() => {
                                    localStorage.removeItem('jwt');
                                    location.reload();
                                }
                            }>
                                Log Out
                            </div>
                        </div>
                        </>
                    : undefined }
                </div>
            </div>
            { this.state.jwt
                ? <MyIdeasComponent
                    setJWTItem={(jwtValue) => {
                        this.setState({jwt: jwtValue});
                    }}
                    getIdeas={() => {
                        this.getIdeas();
                    }}
                    />
                : <LoginComponent
                    setJWTItem={(jwtValue) => {
                        this.setState({jwt: jwtValue});
                    }}
                /> }
    </div>)
    }

    getIdeas() {
        axios.get(`api/ideas`, {
            headers: {'x-api-key': this.state.jwt
            }}).then(res => {
                console.log(res);
                if (res.data.status === "Token is Expired") {
                    localStorage.removeItem('jwt');
                    location.reload();
                }
            this.setState({ideas: res.data.ideas});
        });
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
