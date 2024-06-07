import React,{Component} from "react";
import axiosInstance from "./axios.js";
import Filters from "./filters.js";
import { v4 as uuidv4 } from 'uuid';

class Slider extends Component{
    constructor(props){
        super(props);
        this.state={
            isTablet: false,
        }
        this.handleFilter=this.handleFilter.bind(this);
        this.updatePredicate = this.updatePredicate.bind(this);

    }
    componentDidMount() {
        this.updatePredicate();
        window.addEventListener("resize", this.updatePredicate);
      }
    
      componentWillUnmount() {
        window.removeEventListener("resize", this.updatePredicate);
      }
    
      updatePredicate() {
        this.setState({ isTablet: window.innerWidth > 767 });
      }

    handleFilter(filter_url){
        this.props.FilterPost(filter_url)
    }
    render(){
        const isTablet = this.state.isTablet;

        return(
            
            <div className="slider-main">
                    
                    {isTablet ? (
                        <div className="content-section">
                            <div className="card card-body" style={{padding:"0px",}}>
                                <Filters allcategory={this.props.allcategory} handleFilter={this.handleFilter}/>
                            </div>
                        </div>
                        ) : (
                            <div className="content-section">
                                 <button className="btn btn-primary btn-block" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                    Filters
                                </button>
                                <div className="collapse" id="collapseExample">
                                    <div className="card card-body">
                                        <Filters allcategory={this.props.allcategory} handleFilter={this.handleFilter}/>
                                    </div>
                                </div>
                        </div>
                        )}
                       
            </div>
        )
    }
}
export default Slider




      