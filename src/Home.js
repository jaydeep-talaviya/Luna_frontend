import React,{Component} from "react";
import './style.css'
import SinglePost from "./SinglePost.js";
import Slider from "./Slider.js";
import axiosInstance from "./axios.js";
import "./Loader.css";

class Home extends Component{
    
      
    constructor(props){
        super(props);
        this.state={
          posts:[],
          search_value:'',
          allcategory:[]
        }
        this.handleChange=this.handleChange.bind(this);
        this.searchPost=this.searchPost.bind(this);
        this.clearPost=this.clearPost.bind(this);
        this.FilterPost=this.FilterPost.bind(this);
      }
      
      handleChange(e){
        e.preventDefault();
        this.setState({search_value:e.target.value})
      }
      async clearPost(e){
        this.setState({search_value:''})
          try {
            const res = await fetch('http://127.0.0.1:8000');
            const responsepost = await res.json();
            this.setState({
              posts:responsepost
            });
          } catch (e) {
            console.log(e);
        }
      }
      searchPost(e){
        e.preventDefault();
        var self=this;
        axiosInstance.get(`post/search/?search=${this.state.search_value}`).then(function (res) {
              console.log(res,"search result>>>>>>")
              self.setState({posts:res.data})
          })
      }
      FilterPost(filter_url){
        var self=this;

        axiosInstance.get(`post/filter/?${filter_url}`).then(function (res) {
              console.log(res,"filter result>>>>>>")
              self.setState({posts:res.data})
          })
      }
      

   
      async componentDidMount() {
        console.log("componentDidMount called")
        var self=this;
        try {
          const res = await fetch('http://127.0.0.1:8000');
          const responsepost = await res.json();
          this.setState((currstate)=>({
            posts:[...currstate.posts,...responsepost]
          }));
          axiosInstance.get(`categorylist`).then(function (res) {
            self.setState({allcategory:res.data})
          })
        } catch (e) {
          console.log(e);
      }
      }
     

    render(){
      var user_id=localStorage.getItem('user_id')
        var allcategory=this.state.allcategory
        return(
              <div>
                
              <div className="wrap col-md-10 offset-md-1">
              <div className="search">
                  <input type="text" className="searchTerm" onChange={this.handleChange} placeholder="What are you looking for?" value={this.state.search_value}/>
                  <button type="submit" onClick={this.searchPost} className="searchButton">
                    <i className="fa fa-search"></i>
                </button>
                <button type="submit" onClick={this.clearPost} className="clearButton">
                    <i className="fa fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div className="row">
            <div className="col-md-4">
           
                <Slider allcategory={allcategory} FilterPost={this.FilterPost}/>
                </div>
                <div className="col-md-8">
                    {this.state.posts.length==0?
                    <div className="content-section">
                      <div className="media">
                      <div className="loader"></div>
                        </div>
                      </div>
                    :
                    this.state.posts.map(h=>
                      <SinglePost key={h.id} postdata={h} user_id={Number(user_id)}/>
                    )
                    
                    }
                    
              
                </div>
                
            </div>
            </div>

        )
    }
}

export default Home