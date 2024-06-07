import React, { Component } from 'react'
import axiosInstance from "./axios.js";
import regeneratorRuntime from "regenerator-runtime";

class Logout extends Component {
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
    }
    async logout(){
        try {
            const response = await axiosInstance.post('/logout/blacklist/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            
            this.props.handleLogout(false);

            localStorage.removeItem('islogin');
            axiosInstance.defaults.headers['Authorization'] = null;
            this.props.history.push("/login/")
        }
        catch (e) {
            console.log(e);
        }
    }
    componentDidMount(){
        this.logout();
    }
    render() {
        return (
            <div className="container">
                <h1 className="align-middle d-flex justify-content-center">loging out...</h1>
            </div>
        )
    }
}
export default Logout;