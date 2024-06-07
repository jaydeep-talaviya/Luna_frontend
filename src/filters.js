import React,{Component} from "react";
import axiosInstance from "./axios.js";

class Filters extends Component{
    constructor(props){
        super(props);
        this.state={
            filter_url:''
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleClear=this.handleClear.bind(this);
    }

    handleSubmit(e){
        e.preventDefault()
        var all_checkboxs=$(e.target).find('input[type=checkbox]:checked')

        var list_of_category=[]
        for(var i=0;i<all_checkboxs.length;i++){
            list_of_category.push(all_checkboxs[i].value)
        }
        var date_posted_after=$(e.target).find('#date_posted_after').val()
        var date_posted_before=$(e.target).find('#date_posted_before').val()
        
        var filter_url=''
        
        if (list_of_category.length>0){
            filter_url=filter_url+'category='+list_of_category.join(',')
            if(date_posted_after.length>1 && date_posted_before.length>1)
            {
                filter_url=filter_url+'&date_posted_after='+date_posted_after+'&date_posted_before='+date_posted_before
            }
            else if(date_posted_after.length>1){
                filter_url=filter_url+'&date_posted_after='+date_posted_after
            }
            else if(date_posted_before.length>1){
                filter_url=filter_url+'&date_posted_before='+date_posted_before
            }
            else{
                filter_url=filter_url
            }
        }
        else{
            if(date_posted_after.length>1 && date_posted_before.length>1)
            {
                filter_url=filter_url+'date_posted_after='+date_posted_after+'&date_posted_before='+date_posted_before
            }
            else if(date_posted_after.length>1){
                filter_url=filter_url+'date_posted_after='+date_posted_after
            }
            else if(date_posted_before.length>1){
                filter_url=filter_url+'date_posted_before='+date_posted_before
            }
            else{
                filter_url=filter_url
            }
        }
        this.setState({filter_url:filter_url})
        this.props.handleFilter(filter_url)
    }

    handleClear(){
        this.setState({filter_url:''});
        this.props.handleFilter('')
        var all_checkboxs=$('input[type=checkbox]:checked')
        for(var i=0;i<all_checkboxs.length;i++){
            all_checkboxs[i].checked=false;
        }
        all_checkboxs.checked=false;
        var date_posted_after=$('#date_posted_after').val('')
        var date_posted_before=$('#date_posted_before').val('')
        // window.location.href='http://localhost:3000/'
    }

    render(){
        return(
            <div className="card">
            <form onSubmit={this.handleSubmit}>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item p-0">
                    <h5 className="card-header">Category</h5>
                    <ul className="list-group list-group-flush" style={{height:'20vh',overflowY:'auto'}}>
                        {this.props.allcategory.map((h)=>
                        // <li class="list-group-item" id={h.id} onClick={this.handleFilter}>{h.category}</li>

                        // )}
                        <li className="list-group-item" key={h.id}>
                        <div className="form-check">
                        <input className="form-check-input" type="checkbox" value={h.id} id={h.id} />
                        <label className="form-check-label" htmlFor={h.id}>
                        {h.category}
                        </label>
                        </div>
                        </li>
                        )}
                    </ul>
                    </li>
                    <li className="list-group-item p-0">
                    <h5 className="card-header">Date Range</h5>
                    <ul className="list-group list-group-flush ">
                        <li className="list-group-item px-3">
                        <label htmlFor="date_posted_after">Start Date</label>
                        <input type="date" className="form-control" id="date_posted_after"/>
                        </li>
                        <li className="list-group-item px-3">
                        <label htmlFor="date_posted_before">End Date</label>
                        <input type="date" className="form-control" id="date_posted_before"/>
                        
                        </li>
                    </ul>
                    </li>
                    <li className="list-group-item text-center">
                    <button className="btn btn-primary" type="submit">Apply</button>
                    </li>
                    
                        {this.state.filter_url!=''?
                        <li className="list-group-item text-center">
                        <button className="btn btn-danger clear_btn" onClick={this.handleClear}>Clear</button>
                        </li>
                        :'' 
                    }
                
                   
                </ul>
                </form>
                </div>  
        )
    }
}

export default Filters