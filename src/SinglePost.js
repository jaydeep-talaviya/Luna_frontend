import React, { Component } from "react";
import './style.css'
import logo from './images/head.jpg';
import axiosInstance from './axios.js';
import PostFooter from "./postFooter.js";
import { Link } from "react-router-dom";
import './Loader.css';


class SinglePost extends Component {
   
    constructor(props){
        super(props)
        this.state={
            like_list:[...this.props.postdata.likes_set],
            showfulltext:false            
        }
        this.addLike=this.addLike.bind(this)
        this.updateLike=this.updateLike.bind(this)
        this.deleteLike=this.deleteLike.bind(this)
        this.ShowMore=this.ShowMore.bind(this);
        // this.handleDeletePost=this.handleDeletePost.bind(this);
        // this.OpenModel=this.OpenModel.bind(this);
    }
    addLike(newLike){
        this.setState((currstate)=>({
            like_list:[...currstate.like_list,newLike]
        }))
    }
    updateLike(updatedLike,updatedLikeid){
        var withoutchange=this.state.like_list.filter((x)=>x.id!=updatedLikeid)
        this.setState({like_list:[...withoutchange,updatedLike]})
    }
    deleteLike(deleteid){
        var withoutchange=this.state.like_list.filter((x)=>x.id!=deleteid)
        this.setState({like_list:[...withoutchange]})

    }
    ShowMore(){
        this.setState({showfulltext:true})
    }

  

    render() {
        var user_id=localStorage.getItem('user_id')
        var current_user_like=this.state.like_list.filter((x)=>x.user==Number(user_id))

        // var content=this.state.showfulltext?
        // this.props.postdata.content.substring(0,100):this.props.postdata.content

        return (
            <div>
               


                {this.props.postdata.auther.profile!= null?
                
                 <div className="content-section">
                      
                 <div className="media">
                     <img className="rounded-circle article-img" src={this.props.postdata.auther.profile.image} />
                     <div className="media-body">
                         <div className="article-metadata">
                            <Link to={`/user/${this.props.postdata.auther.username}/${this.props.postdata.auther.id}`} className="mr-2">{this.props.postdata.auther.username}</Link>

                             {/* <a  href="#">{this.props.postdata.auther.username}</a> */}
                             <small className="text-muted">{this.props.postdata.date_posted}</small>
                         </div>
                         <h2><span className="article-title" >{this.props.postdata.title}</span></h2>

                     </div>
                 </div>
                 {this.props.postdata.image !== null?
                   <div className="card">
                   <img src={this.props.postdata.image} className="img-fluid rounded mx-auto d-block" alt="Responsive image" />
               </div>
               :
               <div></div>
             }
               
                 <div className="card-body">
                     {this.state.showfulltext?
                     <p className="card-text">
                     {this.props.postdata.content}
                     </p>
                      :
                      <p className="card-text">
                      {this.props.postdata.content.substring(0,100)}
                      {this.props.postdata.content.length>=100?
                         <span className="text-primary" onClick={this.ShowMore}> Show more</span>
                         : 
                     ''
                     }

                      </p>
                     
                 }

                     <hr />
                     <PostFooter current_user_like={current_user_like} alllikes={this.state.like_list} addLike={this.addLike} updateLike={this.updateLike} deleteLike={this.deleteLike} postid={this.props.postdata.id}/>

                </div>
                 {this.props.is_profile?
                  <div className="text-center mb-3">

                  <Link to={`/post/${this.props.postdata.id}`} className='btn btn-info'>Update</Link>
                 </div>
              :''
                }
                   
             </div>
        :
        <div className="loader"></div>
            }
               

            </div>
        )
    }
}

export default SinglePost