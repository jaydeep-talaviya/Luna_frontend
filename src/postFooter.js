import React,{Component} from "react";
import axiosInstance from './axios.js';

class PostFooter extends Component{
    constructor(props){
        super(props)
        this.state={
            like:false,
            unlike:false,
            like_id:false,
            postid:false,
        }
        this.handleclickup=this.handleclickup.bind(this)
        this.handleclickdown=this.handleclickdown.bind(this)
        this.handlePost=this.handlePost.bind(this);
        this.handleShowLikeUser=this.handleShowLikeUser.bind(this);
        // this.handleGoToUserProfile=this.handleGoToUserProfile.bind(this)
    }
    handlePost(like,unlike){
        // this.setState({like:like,unlike:unlike,like_id:0})
        var postid=this.state.postid
        var user_id=localStorage.getItem("user_id")
        var like_id=this.state.like_id
        var self=this

        if(like_id==false){
            axiosInstance.post(`likelist/create`, {
                "likes":like,
               "unlike":unlike,
               "user":Number(user_id),
               "post":postid
            }).then(function (res) {
                self.props.addLike(res.data)
                self.setState({like_id:res.data.id})
            })
    
        }
        else{
            if(like == unlike){
                axiosInstance.delete(`likelist/${like_id}`).then(function (res) {
                    self.props.deleteLike(like_id)
                    self.setState({like_id:false})
                })
            }
            else{
                axiosInstance.put(`likelist/${like_id}`, {
                    "likes":like,
                   "unlike":unlike,
                   "user":Number(user_id),
                   "post":postid
                }).then(function (res) {
                    self.props.updateLike(res.data,like_id)

                })
            }
            
        }

      }

    handleclickup(e){
    
        e.preventDefault();
        // this.setState({loading:true})
        if (this.state.like){
            if(this.state.unlike){
                this.setState({unlike:false,like_id:false})
            }
            this.setState({like:false})
        }
        else{
            if(this.state.unlike){
                this.setState({unlike:false})
            }
            this.setState({like:true})
        }
        
        setTimeout(() => {
                this.handlePost(this.state.like,this.state.unlike)
        }, 10);

    }
    handleclickdown(e){
        e.preventDefault();
        // this.setState({loading:true})

        if (this.state.unlike){
            if(this.state.like){
                this.setState({like:false,like_id:false})
            }
            this.setState({unlike:false})
        }
        else{ 
            if(this.state.like){
                this.setState({like:false})
            }
            this.setState({unlike:true})
        }
        setTimeout(() => {
            this.handlePost(this.state.like,this.state.unlike)
        }, 10);
        // this.setState({loading:false})

        // console.log(this.props.postdata.likes_set)
    }
    componentDidMount(){
     // var unlike=current_user_like.length==1 && current_user_like[0].like==true?true:false
     var current_user_like=this.props.current_user_like  
     this.setState({
        like_id:current_user_like.length==1?current_user_like[0].id:false,
        like:current_user_like.length==1?current_user_like[0].likes:false,
        unlike:current_user_like.length==1?current_user_like[0].unlike:false,
        postid:this.props.postid
    })

    }
    // handleGoToUserProfile(e){
    //     console.log(">>>>>>>>>>?????????",e)
    // }
   



    handleShowLikeUser(e){
        console.log(e,"EEEEEEEEEEEEEEEEEEEEEEEEE")
        var like_or_unlike=e.target.id.split('_')[0]
        var like_list_ids=[]
        var unlike_list_ids=[]
        var self=this
        if(like_or_unlike=='like'){
            $("#like_by_whom").find('ul').text('')

            like_list_ids=this.props.alllikes.filter((x)=>x.likes==true).map((y)=>y.user)  

            axiosInstance.get(`likesbyuserids?userids=${like_list_ids}`)
            .then(function (res) {
                res.data.map((x)=>
                $("#like_by_whom").find('ul').append(`<li class="list-group-item" href='/user/${x.username}/${x.id}' onclick="window.location.href=this.getAttribute('href');return false;">${x.username}
                </li>`)
                )
                
            })
            

            $('#like_by_whomLabel').text("Liked By")
            $("#like_by_whom").modal("show");
            
        }
        else{
            $("#like_by_whom").find('ul').text('')

            unlike_list_ids=this.props.alllikes.filter((x)=>x.unlike==true).map((y)=>y.user)  
            axiosInstance.get(`likesbyuserids?userids=${unlike_list_ids}`)
            .then(function (res) {

                res.data.map((x)=>
                
                $("#like_by_whom").find('ul').append(`<li class="list-group-item" href='/user/${x.username}/${x.id}' onclick="window.location.href=this.getAttribute('href');return false;">${x.username}
                </li>`)
                )
            })
        
            $('#like_by_whomLabel').text("Unliked By")
            $("#like_by_whom").modal("show");
        }
    }

    render(){
        var like_no=this.props.alllikes.filter((x)=>x.likes==true)
        var unlike_no=this.props.alllikes.filter((x)=>x.unlike==true)

        return(
            
            <div className="d-flex justify-content-between">
                            <div>
                                <div className="modal fade" id="like_by_whom" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="like_by_whomLabel">Like By </h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                
                                {/* {current_like_or_unlike.length>0?
                                <ul class="list-group like_unlike_people">
                                   {current_like_or_unlike.map((x)=>
                                   <li class="list-group-item">{x.username}</li>
                                   )}
                                    </ul>
                                :
                                <p>Please Wait ...</p>
                                    
                                } */}
                                        <ul className="list-group like_unlike_people">
                                        </ul>
                                  
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                                </div>
                            </div>
                            </div>
                                <div className="row ml-1">
                                    <div >
                                        <p className="card-text">
                                        {this.state.like?
                                        <i className="fas fa-thumbs-up fa-3x" onClick={this.handleclickup} style={{ color: 'blue' }}></i>
                                        :
                                            <i className="far fa-thumbs-up fa-3x" onClick={this.handleclickup} style={{ color: 'blue' }}></i>
                                        }
                                        </p>
                                    </div>

                                    <div className="ml-2 my-3">
                                    {like_no.length !== 0?
                                        <h5>
                                            <span className="like_by" id="like_by_whom" onClick={this.handleShowLikeUser}>{like_no.length}</span>
                                            </h5>
                                        :
                                        <h5></h5>

                                    }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="row mr-1">
                                    <div className="">
                                        <p className="card-text">
                                        { this.state.unlike?
                                         <i className="fas fa-thumbs-down fa-3x" onClick={this.handleclickdown} style={{color:'red'}}></i>
                                         :
                                            <i className="far fa-thumbs-down fa-3x" onClick={this.handleclickdown} style={{ color: 'red' }}></i>

                                            }
                                            {/* <i class="fas fa-thumbs-down fa-3x" style={{color:'red'}}></i> */}
                                        </p>
                                    </div>
                                    <div className="ml-2 my-3">
                                        {unlike_no.length !== 0?
                                        <h5><span className="unlike_by" id="unlike_by_whom" onClick={this.handleShowLikeUser}>{unlike_no.length}</span></h5>
                                        :
                                        <h5></h5>

                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
        )
    }

}
export default PostFooter