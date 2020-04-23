import React, {Component} from 'react';
import './MyIdeasStyles.scss';
import axios from "axios";


const initialState = {showForm: false, content: '', impact: 0, ease: 0, confidence: 0, average: 0};

export class MyIdeasComponent extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    render() {
        let showForm = false;
        return (
            <div className="my-ideas-container">
                <div className="title">My ideas</div>

                <img src="images/btn_addanidea.png" className="plus-button cursor-pointer" alt="add-button"
                    onClick={() => {
                        this.setState({showForm: true});
                    }}
                />
                <hr />
                    <div className={ (this.state.showForm ? undefined : 'hidden')}>
                        <input type="text" value={this.state.content} onChange={(event) => {
                            this.setState({content: event.target.value});
                        }} />

                        <div className="select-block">
                            <div>Impact</div>
                            <select onChange={(event) => {
                                const impact: any = event.target.value;
                                const average = (parseInt(impact) + parseInt(this.state.ease) + parseInt(this.state.confidence))/3;
                                this.setState({impact, average: average.toFixed(2)});
                            }}>{
                                [1,2,3,4,5,6,7,8,9,10].map((k, v) => {
                                    return (<option key={v} value={v}>{v}</option>);
                                })
                            }</select>
                    </div>

                    <div className="select-block">
                        <div>Ease</div>
                        <select onChange={(event) => {
                            const ease: any = event.target.value;
                            const average = (parseInt(this.state.impact) + parseInt(ease) + parseInt(this.state.confidence)) / 3;
                            this.setState({ease, average: average.toFixed(2)});
                        }}>
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((k, v) => {
                                    return (<option key={v} value={v}>{v}</option>);
                                })
                            }
                        </select>
                    </div>

                    <div className="select-block">
                        <div>Confidence:</div>
                        <select onChange={(event) => {
                            const confidence: any = event.target.value;
                            const average = (parseInt(this.state.impact) + parseInt(this.state.ease) + parseInt(confidence)) / 3;
                            this.setState({confidence, average: average.toFixed(2)});
                        }}>
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((k, v) => {
                                    return (<option key={v} value={v}>{v}</option>);
                                })
                            }
                        </select>
                    </div>
                    <div className="select-block">
                        <div>Avg.</div>
                        {this.state.average}
                    </div>
                    <div className="select-block">
                        <img src="images/Confirm_V.png" alt="confirm-image" className="cursor-pointer"
                             onClick={() => {
                                 const jwt = localStorage.getItem('jwt');
                                 axios.post(`api/ideas`, {
                                     content: this.state.content,
                                     impact: this.state.impact,
                                     ease: this.state.ease,
                                     confidence: this.state.confidence
                                 },{
                                     headers: {'x-api-key': jwt
                                 }}).then(res => {
                                     if (res.status === 200 && res.data.status !== 'Token is Invalid') {
                                         this.setState(initialState);
                                         this.props.getIdeas();
                                     } else if (res.data.status === 'Token is Invalid') {
                                         localStorage.removeItem('jwt');
                                         location.reload();
                                         this.props.setJWTItem(false);
                                     }
                                 });
                             }}
                        />
                    </div>
                    <div className="select-block">
                        <img src="images/Cancel_X.png" alt="cancel-image" className="cursor-pointer"
                            onClick={() => {
                                this.setState(initialState);
                            }}
                        />
                    </div>
                </div>
                {
                    JSON.stringify(this.state)
                }
            </div>
        );
    }
}
