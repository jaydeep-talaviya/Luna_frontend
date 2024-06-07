import React,{Component} from "react";
import oops from './images/oops.png';
import { Link } from 'react-router-dom';

class NotFound extends Component{
    render(){
        return(
            <div>
                <div className="d-flex justify-content-center">
                <img src={oops} />

                </div>
                <h1 className="text-center text-dark">404 -  Not Found</h1>
                <h2 className="text-center">Please Check,The Page you are searching is not exist. Thanks!</h2>
                <div className="d-flex justify-content-center mt-5">
                <Link to="/" class="btn btn-outline-primary">GO TO HOMEPAGE</Link>

                </div>
            </div>
        )
    }
}

export default NotFound