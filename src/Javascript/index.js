import React, { Component } from "react";
import { doGet } from "../helpers/xhr";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    componentDidMount() {
        doGet("data/javascript.json").then((data) => {
            this.setState({ questions: data.questions.question });
        });
    }

    renderQuestions() {
        const { questions } = this.state;
        if (questions) {
            return questions.map((question) => {
                const { q } = question;
                return (
                    <div>
                        <p> {q[0].p[0]}</p>
                        <pre>{q[0].code[0]} </pre>
                    </div>
                );
            });
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="App">
                {this.renderQuestions()}
            </div>
        );
    }
}

export default App;
