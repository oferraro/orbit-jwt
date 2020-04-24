import React, {Component} from 'react';
import './MyIdeasStyles.scss';
import axios from "axios";

export interface Idea {
    id?: number;
    content: string;
    impact: number;
    ease: number;
    confidence: number;
}

const emptyIdea: Idea = {content: '', impact: 0, ease: 0, confidence: 0};

const initialState = {
    showForm: false, content: '', impact: 0, ease: 0, confidence: 0, average: 0,
    editingIdea: false, ideaToEdit: emptyIdea, ideaToEditAvg: 0
};

export class MyIdeasComponent extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.props.getIdeas();
    }
    render() {
        return (
            <div className="my-ideas-container">
                <div className="title">My ideas</div>

                <img src="images/btn_addanidea.png" className="plus-button cursor-pointer" alt="add-button"
                    onClick={() => {
                        this.setState({showForm: true, editingIdea: false});
                    }}
                />
                <hr />

                {this.state.editingIdea
                    ? <div>
                        <input type="text" value={this.state.ideaToEdit.content} onChange={(event) => {
                            const editingIdea = this.state.ideaToEdit;
                            editingIdea.content = event.target.value;
                            this.setState({ideaToEdit: editingIdea});
                        }} />
                        <div className="select-block">
                            <div>Impact</div>
                            <select defaultValue={this.state.ideaToEdit.impact}
                                    onChange={(event) => {
                                        const editingIdea = this.state.ideaToEdit;
                                        editingIdea.impact = event.target.value;
                                        const ideaToEditAvg = this.getAverage(this.state.ideaToEdit);
                                        this.setState({ideaToEdit: editingIdea, ideaToEditAvg});
                                    }}
                            >
                                {this.getSelectOptions()}
                            </select>
                        </div>
                        <div className="select-block">
                            <div>Ease</div>
                            <select defaultValue={this.state.ideaToEdit.ease}
                                    onChange={(event) => {
                                        const editingIdea = this.state.ideaToEdit;
                                        editingIdea.ease = event.target.value;
                                        const ideaToEditAvg = this.getAverage(this.state.ideaToEdit);
                                        this.setState({ideaToEdit: editingIdea,ideaToEditAvg});
                                    }}
                            >
                                {this.getSelectOptions()}
                            </select>
                        </div>
                        <div className="select-block">
                            <div>Confidence</div>
                            <select defaultValue={this.state.ideaToEdit.confidence}
                                onChange={(event) => {
                                    const editingIdea = this.state.ideaToEdit;
                                    editingIdea.confidence = event.target.value;
                                    const ideaToEditAvg = this.getAverage(this.state.ideaToEdit);
                                    this.setState({ideaToEdit: editingIdea,ideaToEditAvg});
                                }}
                            >
                                {this.getSelectOptions()}
                            </select>
                        </div>
                        <div className="select-block">
                            <div>Avg.</div>
                            {
                                this.state.ideaToEditAvg
                            }
                        </div>
                        <div className="select-block">
                            <img src="images/Confirm_V.png" alt="confirm-image" className="cursor-pointer"
                                 onClick={() => {
                                     const jwt = localStorage.getItem('jwt');
                                     axios.put(`api/ideas/${this.state.ideaToEdit.id}`, {
                                         content: this.state.ideaToEdit.content,
                                         impact: this.state.ideaToEdit.impact,
                                         ease: this.state.ideaToEdit.ease,
                                         confidence: this.state.ideaToEdit.confidence
                                     },{
                                         headers: {'x-api-key': jwt
                                         }}).then(res => {
                                         if (res.status === 200 && res.data.status !== 'Token is Invalid') {
                                             this.setState({showForm: false, content: ''});
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
                    </div>
                :<>
                    <div className={ (this.state.showForm ? undefined : 'hidden')}>
                        <input type="text" value={this.state.content} onChange={(event) => {
                            this.setState({content: event.target.value});
                        }} />

                        <div className="select-block">
                            <div>Impact</div>
                            <select
                                onChange={(event) => {
                                const impact: any = event.target.value;
                                const average = (parseInt(impact) + parseInt(this.state.ease) + parseInt(this.state.confidence))/3;
                                this.setState({impact, average: average.toFixed(2)});
                            }}>
                                {this.getSelectOptions()}
                            </select>
                    </div>

                    <div className="select-block">
                        <div>Ease</div>
                        <select onChange={(event) => {
                            const ease: any = event.target.value;
                            const average = (parseInt(this.state.impact) + parseInt(ease) + parseInt(this.state.confidence)) / 3;
                            this.setState({ease, average: average.toFixed(2)});
                        }}>
                            {this.getSelectOptions()}
                        </select>
                    </div>

                    <div className="select-block">
                        <div>Confidence:</div>
                        <select onChange={(event) => {
                            const confidence: any = event.target.value;
                            const average = (parseInt(this.state.impact) + parseInt(this.state.ease) + parseInt(confidence)) / 3;
                            this.setState({confidence, average: average.toFixed(2)});
                        }}>
                            {this.getSelectOptions()}
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
                                     if (res.status === 201 && res.data.status !== 'Token is Invalid') {
                                         this.setState({showForm: false, content: ''});
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
                </> }

                <table>
                    <tbody>
                {this.props.ideas ? this.props.ideas.map((idea) => {
                    return (
                        <tr key={idea.id}>
                            <td className="ideas-td">
                                {idea.content}
                            </td>
                            <td className="ideas-td">
                                {idea.impact}
                            </td>
                            <td className="ideas-td">
                                {idea.ease}
                            </td>
                            <td className="ideas-td">
                                {idea.confidence}
                            </td>
                            <td className="ideas-td">
                                {idea.average_score.toFixed(2)}
                            </td>
                            <td className="ideas-td">
                                <img src="images/pen.png" alt="delete-idea" className="cursor-pointer"
                                     onClick={() => {
                                         const ideaToEditAvg = this.getAverage(idea);
                                         this.setState({editingIdea: true, ideaToEdit: idea, ideaToEditAvg})
                                 }}/>
                                 {" "}
                                <img src="images/bin.png" alt="delete-idea" className="cursor-pointer"
                                    onClick={() => {
                                        this.props.deleteIdea(idea.id);
                                    }}/>
                            </td>
                        </tr>
                    );
                })
                : undefined}
                    </tbody>
                </table>
            </div>
        );
    }
    getSelectOptions() {
        return [1,2,3,4,5,6,7,8,9,10].map((k, v) => {
            return (<option key={v} value={v}>{v}</option>);
        });
    }
    getAverage(idea) {
        const average = 0;
        if (idea) {
            return ((parseInt(idea.impact) + parseInt(idea.ease) + parseInt(idea.confidence)) / 3)
                .toFixed(2);
        }
        return average;
    }
}
