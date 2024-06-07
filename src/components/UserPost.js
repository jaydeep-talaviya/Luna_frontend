import React,{Component} from "react";
import './style.css';
import './profile.css';
import './Loader.css';

import axiosInstance from "./axios.js";
import PostFilterProfile from './PostFilterProfile.js';
import regeneratorRuntime from "regenerator-runtime";

const baseURL = process.env.REACT_APP_BASE_URL;;

class UserPost extends Component{
    constructor(props){
        super(props);
        this.state={
            allcategory:[],
            allpost:[],
            user:{},
            profile:{},
        }
        // this.handleSelectCategory=this.handleSelectCategory.bind(this);
    }

    async componentDidMount() {
        var self=this;
        var category=[]
        const res = await fetch(`${baseURL}/userpost?userid=${this.props.match.params.user_id}`);
        const responsepost = await res.json();
  
            this.setState({allpost:responsepost.posts,user:responsepost.user,profile:responsepost.profile})

            category=[...new Set(responsepost.posts.map((x)=>x.category))]
            var single_category=[]

                axiosInstance.get(`categorylist`).then(function (res) {
                    for(var i=0;i<category.length;i++){
                        if(res.data.filter((x)=>x.id==category[i]).length > 0){
                            single_category.push(res.data.filter((x)=>x.id==category[i])[0])
                        }
                    }
                    self.setState({allcategory:single_category})
                })
        
      }


    render(){
        return (
            
            <div className="content-section">
               {this.state.allcategory.length>0?
                    <PostFilterProfile allpost={this.state.allpost} allcategory={this.state.allcategory} profile={this.state.profile} user={this.state.user}/>
                :<div className="loader"></div>
            }
            </div>
        )
    }
}

export default UserPost
