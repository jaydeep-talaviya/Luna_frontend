import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./components/Homepage";

export default class App extends Component {

  render() {
    return (
      <div>
        <HomePage/>
      </div>
    );
  }
}
