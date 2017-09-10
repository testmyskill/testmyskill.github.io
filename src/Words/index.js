import React, { Component } from "react";
import { doGet } from "../helpers/xhr";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    componentDidMount() {
        doGet("data/words.json").then((data) => {
            this.setState({ words: data });
        });
    }

    renderQuestions() {
        const { words } = this.state;
        if (words) {
            return words.map((word) => {
                const { title, ans, examples } = word;
                return (
                    <div>
                        <h1> {title}</h1>
                        <p>{ans} </p>
                        <ol>
                            {examples.map(example => (<li> {example} </li>))}
                        </ol>
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
