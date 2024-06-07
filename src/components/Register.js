import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Grid';
import axiosInstance from "./axios.js";
import './style.css';
import ErrorComp from './ErrorComp.js';
import {Link} from 'react-router-dom';
import $ from 'jquery';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            showPassword1: false,
            confirmpassword: '',
            showPassword2: false,
            error:false,
            error_text:'',
            error_color:''

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClickShowPassword1 = this.handleClickShowPassword1.bind(this)
        this.handleClickShowPassword2 = this.handleClickShowPassword2.bind(this)

        this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFocus=this.handleFocus.bind(this);
        this.handleError=this.handleError.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        var password=document.getElementsByName('password')[0].value
        var confirmpassword=document.getElementsByName('confirmpassword')[0].value

        if(event.target.name=='username'){
            axiosInstance.get(`/allusers`).then(function (res) {
                $('.usernames_help').css('display','none')
                $(".submitbtn").attr("disabled", false);
                 if(res.data.usernames.includes(event.target.value)){
                $('.usernames_help').css('display','').text("user with this username already exist")
                $(".submitbtn").attr("disabled", true);
       
            }
            })  
        }
        if(event.target.name=='email'){
            axiosInstance.get(`/allusers`).then(function (res) {
                $('.emails_help').css('display','none')
                $(".submitbtn").attr("disabled", false);
    
                if (res.data.emails.includes(event.target.value)){
                    $('.emails_help').css('display','').text("user with this email already exist")
                    $(".submitbtn").attr("disabled", true);
    
                }

            })  
        }

        if(event.target.name=='password'){
            if(event.target.value.length>=8){
                $('#hint_id_password1').addClass('d-none')

            }
        }

        if (event.target.name == 'confirmpassword' || event.target.name=='password') {
            if (this.state.password == '') {
                $('.password_help').text("please enter password").css('display','').css('color',"red")
            }
            else{
                if (confirmpassword === password && (confirmpassword.length > 8 && password.length > 8)) {
                    $('.password_help').text("Matched password").css('display','').css('color',"green")

                }
                else {
                    console.log(confirmpassword,"confirmpassword")
                        $('.password_help').text( confirmpassword.length > 1 ? "please enter Valid password":"").css('display','').css('color',"red")
                }
            }   
           
        }
    };
    handleFocus(e){
        if(e.target.name=="username"){
            $('.username_help').css('display','')

        }
        if(e.target.name=="password"){
        
            $('#hint_id_password1').removeClass('d-none')
        }
    }

    handleClickShowPassword1() {
        this.setState({
            showPassword1: !this.state.showPassword1,
        });
    };
    handleClickShowPassword2() {
        this.setState({
            showPassword2: !this.state.showPassword2,
        });
    };
    handleError(){
        this.setState({error:false})
    }

    handleMouseDownPassword(event) {
        event.preventDefault();
    };
    handleSubmit(e) {
        e.preventDefault();
        var history = this.props.history
        var self=this
        if ((this.state.password.length < 8) || (this.state.confirmpassword.length < 8) || (this.state.username  == '') || (this.state.email == '')) {
            this.setState({error_text:"please enter valid informations",error:true,error_color:'warning'})
        }
        else{
            
        axiosInstance.post(`/register`, {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirm_password:this.state.confirmpassword,
        }).then(function (res) {
            if (res.status == 201) {
                history.push('/login')
            }
        }).catch(function (err) {
            self.setState({error_text:err.response.data.non_field_errors.length>0?err.response.data.non_field_errors[0]:'something went wrong, Please Try again',error:true,error_color:'danger'})

        })            
        }

        // console.log(e,this.state,this.props.history.push())
    }

    render() {
        return (
            <div>
            {this.state.error?
            <ErrorComp error={this.state.error_text} iserror={this.state.error} error_color={this.state.error_color} changerror={this.handleError}/>:
                ''
                }
      <div className="row">
                <div className="col-md-6 offset-md-3">
                <div className="content-section">
           
                    <form method="POST" noValidate onSubmit={this.handleSubmit}>

                        <fieldset className="form-group">
                            <legend className="border-bottom mb-4">
                                Join Today
                            </legend>
                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">

                                <TextField id="outlined-basic" onFocus={this.handleFocus} size="small" required fullWidth name="username" label="Username" variant="outlined" color="primary" value={this.state.username} onChange={this.handleChange} />
                                <p className="username_help" style={{ fontSize: '84%',color: 'grey', display: 'none',marginBottom:'0' }}>150 characters or fewer. Letters, digits and @/./+/-/_ only.</p>
                            </FormControl>
                            <p className="usernames_help" style={{ fontSize: '84%',color: 'red', display: 'none',marginBottom:'0',marginLeft:'5%' }}></p>

                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <TextField id="outlined-basic"   size="small" name="email" required fullWidth label="Email" variant="outlined" color="primary" value={this.state.email} onChange={this.handleChange} />
                            </FormControl>
                            <p className="emails_help" style={{ fontSize: '84%',color: 'red', display: 'none',marginBottom:'0',marginLeft:'5%' }}></p>

                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel sx={{ top: '-6px'}} htmlFor="outlined-adornment-password">Password*</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="password"
                                    type={this.state.showPassword1 ? 'text' : 'password'}
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    onFocus={this.handleFocus}
                                    size="small"

                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={this.handleClickShowPassword1}
                                                onMouseDown={this.handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {this.state.showPassword1 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <small id="hint_id_password1" className="form-text text-muted d-none mb-2"><ul><li>Your password can’t be too similar to your other personal information.</li><li>Your password must contain at least 8 characters.</li><li>Your password can’t be a commonly used password.</li><li>Your password can’t be entirely numeric.</li></ul></small>
                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel sx={{ top: '-6px'}} htmlFor="outlined-adornment-password">Confirm Password*</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="confirmpassword"
                                    size="small"
                                    type={this.state.showPassword2 ? 'text' : 'password'}
                                    value={this.state.confirmpassword}
                                    onChange={this.handleChange}
                                    onFocus={this.handleFocus}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={this.handleClickShowPassword2}
                                                onMouseDown={this.handleMouseDownPassword}
                                                edge="end"

                                            >
                                                {this.state.showPassword2 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Confirm Password"
                                />
                            </FormControl>
                            <p className="password_help" style={{ fontSize: '84%',marginLeft: '4%',color: 'grey', display: 'none',marginBottom:'0' }}></p>

                            
                        </fieldset>
                        <div className="form-group">
                            <button className="btn btn-outline-info" type="submit">
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="border-top pt-3">
                        <small className="text-muted">Already Have An Account? 
                        <Link className="ml-2" to="/login">Sign In</Link>
                        </small>
                    </div>
                    </div>
                </div>
            </div>
            </div>
      

        )
    }

}

export default Register