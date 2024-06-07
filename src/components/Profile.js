import React, { Component } from "react";
import './style.css';
import './profile.css';
import axiosInstance from "./axios.js";
import './Loader.css';
import PostFilterProfile from './PostFilterProfile.js';
import { v4 as uuidv4 } from 'uuid';
import regeneratorRuntime from "regenerator-runtime";

class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
            allcategory:[],
            allpost:[],
            user:{},
            profile:{},
            is_profile:true,
        }
    }


    async componentDidMount() {
        var self=this;
        var category=[]

        axiosInstance.get(`/profile`).then(function (post) {
            console.log("post.data.profile",post.data.profile)
            self.setState({allpost:post.data.posts,user:post.data.user,profile:post.data.profile})
            category=[...new Set(post.data.posts.map((x)=>x.category))]

            var single_category=[]
                axiosInstance.get(`categorylist`).then(function (res) {
                    for(var i=0;i<category.length;i++){
                        if(res.data.filter((x)=>x.id==category[i]).length > 0){
                            single_category.push(res.data.filter((x)=>x.id==category[i])[0])
                        }

                    }

                    self.setState({allcategory:single_category})
                })
          
        })

      }

 


    render() {
        return (
            
            <div className="content-section">
               {/* {this.state.allcategory.length>0? */}
                    <PostFilterProfile key={uuidv4()} allpost={this.state.allpost} allcategory={this.state.allcategory} profile={this.state.profile} user={this.state.user} is_profile={this.state.is_profile} />
                {/* :<div className="loader"></div> */}
            {/* } */}
            </div>
        )
    }
}

export default Profile