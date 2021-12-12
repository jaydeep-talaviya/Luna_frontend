import logo from './logo.svg';
// import './App.css';
import { Route,Switch } from 'react-router-dom';
import Home from './Home.js';
import About from './About.js';
import UserPost from './UserPost.js';
import PostNew from './PostNew.js';
import Navbar from './Navbar.js';
import Slider from './Slider.js';
import './style.css';
import React,{ Component } from 'react';
import Register from './Register.js';
import Login from './Login.js'
import Logout from './logout.js';
import Profile from './Profile.js';
import PostDetail from './PostDetail.js';

import ForgetPassword from './ForgetPassword.js';
import PasswordReset from './PasswordReset.js';

class App extends Component {
  constructor(props){
    super(props)
    this.state={
        islogin:localStorage.getItem('islogin'),
    }
    this.handleLogout=this.handleLogout.bind(this)
    this.handleLogin=this.handleLogin.bind(this)
}
handleLogout(islogin){
    // localStorage.setItem('islogin',false)
    this.setState({islogin:islogin})
  }
  handleLogin(islogin){
    this.setState({islogin:islogin})
  }
  render(){
    return (
      
      <div className="App">
        <Navbar islogin={this.state.islogin}/>
  
      <main role="main" className="container">
        
                <Switch>
                  <Route exact path="/" render={()=><Home/>} />
                  <Route exact path="/register" render={(routeProps)=><Register {...routeProps} />} />
                  <Route exact path="/login" render={(routeProps)=><Login {...routeProps} handleLogin={this.handleLogin} />} />
                  <Route exact path="/logout/blacklist" render={(routeprops) => <Logout  {...routeprops} handleLogout={this.handleLogout} />} />

                  <Route exact path="/about" render={()=><About/>} />
                  <Route exact path="/profile" render={(routeprops)=><Profile {...routeprops}/>} />

                  <Route exact path="/user/:username/:user_id" render={(routeprops)=><UserPost {...routeprops}/>} />
                  <Route exact path="/post/new" render={(routeprops)=><PostNew {...routeprops}/>} />
                  <Route exact path="/post/:id" render={(routeprops)=><PostDetail {...routeprops}/>} />
  

                  <Route exact path="/request-reset-email" render={(routeprops)=><ForgetPassword {...routeprops}/>} />
                  <Route exact path="/password-reset/:uid/:token" render={(routeprops)=><PasswordReset {...routeprops}/>} />
                  

                </Switch>
             
          </main>
        
           </div>
    );
  }
  
}

export default App;
