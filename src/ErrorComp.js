import React, { Component } from "react";
import './style.css';

class ErrorComp extends Component {
    constructor(props){
        super(props)
        
        this.handleClick=this.handleClick.bind(this)
    }

    handleClick(){
        this.props.changerror();
    }
    render(){
        return(
        <div>
       
            <div className={`alert alert-${this.props.error_color} alert-dismissible fade show ${this.props.iserror?'':'d-none'}`} role="alert">
            {this.props.error}
                <button type="button" className="close" onClick={this.handleClick} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

        </div>
  
        )
    }
}
export default ErrorComp
