import React, { Component } from "react";
import axiosInstance from './axios.js';
import $ from 'jquery';

class PostFooter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            like: false,
            unlike: false,
            like_id: false,
            postid: false,
        }
        this.handleclickup = this.handleclickup.bind(this)
        this.handleclickdown = this.handleclickdown.bind(this)
        this.handlePost = this.handlePost.bind(this);
        this.handleShowLikeUser = this.handleShowLikeUser.bind(this);
    }
    handlePost(like, unlike) {
        var postid = this.state.postid
        var user_id = localStorage.getItem("user_id")
        var like_id = this.state.like_id
        var self = this

        if (like_id == false) {
            axiosInstance.post(`likelist/create`, {
                "likes": like,
                "unlike": unlike,
                "user": Number(user_id),
                "post": postid
            }).then(function (res) {
                self.props.addLike(res.data)
                self.setState({ like_id: res.data.id })
            })

        }
        else {
            if (like == unlike) {
                axiosInstance.delete(`likelist/${like_id}`).then(function (res) {
                    self.props.deleteLike(like_id)
                    self.setState({ like_id: false })
                })
            }
            else {
                axiosInstance.put(`likelist/${like_id}`, {
                    "likes": like,
                    "unlike": unlike,
                    "user": Number(user_id),
                    "post": postid
                }).then(function (res) {
                    self.props.updateLike(res.data, like_id)

                })
            }

        }

    }

    handleclickup(e) {

        e.preventDefault();
        if (this.state.like) {
            if (this.state.unlike) {
                this.setState({ unlike: false, like_id: false })
            }
            this.setState({ like: false })
        }
        else {
            if (this.state.unlike) {
                this.setState({ unlike: false })
            }
            this.setState({ like: true })
        }

        setTimeout(() => {
            this.handlePost(this.state.like, this.state.unlike)
        }, 10);

    }
    handleclickdown(e) {
        e.preventDefault();

        if (this.state.unlike) {
            if (this.state.like) {
                this.setState({ like: false, like_id: false })
            }
            this.setState({ unlike: false })
        }
        else {
            if (this.state.like) {
                this.setState({ like: false })
            }
            this.setState({ unlike: true })
        }
        setTimeout(() => {
            this.handlePost(this.state.like, this.state.unlike)
        }, 10);

    }
    componentDidMount() {
        var current_user_like = this.props.current_user_like
        this.setState({
            like_id: current_user_like.length == 1 ? current_user_like[0].id : false,
            like: current_user_like.length == 1 ? current_user_like[0].likes : false,
            unlike: current_user_like.length == 1 ? current_user_like[0].unlike : false,
            postid: this.props.postid
        })

    }
 
    handleShowLikeUser(e) {
        var like_or_unlike = e.target.id.split('_')[0]
        var like_list_ids = []
        var unlike_list_ids = []
        var self = this
        if (like_or_unlike == 'like') {
            window.$("#like_by_whom").find('ul').text('')
            like_list_ids = this.props.alllikes.filter((x) => x.likes == true).map((y) => y.user)
            axiosInstance.get(`likesbyuserids?userids=${like_list_ids}`)
                .then(function (res) {
                    console.log(res)
                    res.data.map((x) =>
                        window.$("#like_by_whom").find('ul').append(
                            `<li class="list-group-item py-2" href='/user/${x.username}/${x.id}' onclick="window.location.href=this.getAttribute('href');return false;">
                    <img src=${x.profile.image} width="50px" height="50px" style="border-radius:50%"/> ${x.username}
                    </li>`)
                    )
                })
            window.$('#like_by_whomLabel').text("Liked By")
            window.$("#like_by_whom").modal("show");

        }
        else {
            window.$("#like_by_whom").find('ul').text('')

            unlike_list_ids = this.props.alllikes.filter((x) => x.unlike == true).map((y) => y.user)
            axiosInstance.get(`likesbyuserids?userids=${unlike_list_ids}`)
                .then(function (res) {

                    res.data.map((x) =>

                        window.$("#like_by_whom").find('ul').append(
                            `<li class="list-group-item py-2" href='/user/${x.username}/${x.id}' onclick="window.location.href=this.getAttribute('href');return false;">
                       <img src=${x.profile.image} width="50px" height="50px" style="border-radius:50%" /> ${x.username}
                    </li>`
                        )
                    )
                })

            window.$('#like_by_whomLabel').text("Unliked By")
            window.$("#like_by_whom").modal("show");
        }
    }

    render() {
        var like_no = this.props.alllikes.filter((x) => x.likes == true)
        var unlike_no = this.props.alllikes.filter((x) => x.unlike == true)
        return (
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
                                {this.state.like ?
                                    <i className="fas fa-thumbs-up fa-3x" onClick={this.handleclickup} style={{ color: 'blue' }}></i>
                                    :
                                    <i className="far fa-thumbs-up fa-3x" onClick={this.handleclickup} style={{ color: 'blue' }}></i>
                                }
                            </p>
                        </div>

                        <div className="ml-2 my-3">
                            {like_no.length !== 0 ?
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
                                {this.state.unlike ?
                                    <i className="fas fa-thumbs-down fa-3x" onClick={this.handleclickdown} style={{ color: 'red' }}></i>
                                    :
                                    <i className="far fa-thumbs-down fa-3x" onClick={this.handleclickdown} style={{ color: 'red' }}></i>

                                }
                            </p>
                        </div>
                        <div className="ml-2 my-3">
                            {unlike_no.length !== 0 ?
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