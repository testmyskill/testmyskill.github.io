import React, { Component } from "react";
import Javascript from "./Javascript";
import Words from "./Words";
import IndexApp from "./IndexApp";
import Header from "./Header";


class App extends Component {

    renderQuestionsComponent() {
        if (window.location.pathname.indexOf("javascript") >= 0) {
            return (<Javascript />);
        } else if (window.location.pathname.indexOf("words") >= 0) {
            return (<Words />);
        } else {
            return (<IndexApp />);
        }
    }


    render() {
        return (
            <div className="App">
                <Header />
                {this.renderQuestionsComponent()}
            </div>
        );
    }
}

export default App;
