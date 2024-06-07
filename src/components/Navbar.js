import React, { Component } from "react"
import { Link } from "react-router-dom"
import './style.css'
import moon from './images/full_moon.png';

class Navbar extends Component {
   
    render() {
        var islogin=this.props.islogin

        if(islogin == null ){
            islogin = false
        }
        return (
            <div>
                <header className="site-header">
                    <nav className="navbar navbar-expand-md navbar-dark bg-steel fixed-top" style={{background:'#0d62a9'}}>
                        <div className="container">
                            {/* <a class="navbar-brand mr-4" href="">Django Blog</a> */}
                            
                            <Link to="/" className="navbar-brand mr-4">
                                <img src={moon} height="40px" width="60px"/>
                            </Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarToggle">
                                <div className="navbar-nav mr-auto">
                                    {/* <a class="nav-item nav-link" href="#"></a> */}
                                    <Link to="/" className="nav-item nav-link">Home</Link>

                                    {/* <a class="nav-item nav-link" href="#"></a> */}
                                    <Link to="/about" className="nav-item nav-link">About</Link>

                                </div>
                                {/* <!-- Navbar Right Side --> */}
                                <div className="navbar-nav">
                                    {/* <a class="nav-item nav-link" href="/post/new">New Post</a> */}
                                    {islogin?
                                    <span style={{display: 'contents'}}>
                                    <Link to="/post/new" className="nav-item nav-link">New Post</Link>
                                    <Link to="/room" className="nav-item nav-link">Room</Link>

                                    {/* <a className="nav-item nav-link" href="#">Profile</a> */}
                                    <Link to="/profile" className="nav-item nav-link">Profile</Link>

                                    <Link to="/logout/blacklist" className="nav-item nav-link">Logout</Link>
                                    </span>
                                    :<span style={{display: 'contents'}}>
                                    <Link to="/login" className="nav-item nav-link">Login</Link>
                                    <Link to="/register" className="nav-item nav-link">Register</Link>
                                    </span>
                                    }

                                    {/* {% endif %} */}
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
        )
    }

}

export default Navbar

