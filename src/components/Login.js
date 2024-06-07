import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axiosInstance from "./axios.js";
import './style.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ErrorComp from './ErrorComp.js';
import {Link} from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username_or_email: '',
            password: '',
            showPassword: false,
            error:false,
            error_text:'',
            error_color:''

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this)

        this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleError=this.handleError.bind(this)
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });       
    };
    handleError(){
        this.setState({error:false})
    }

    handleClickShowPassword() {
        this.setState({
            showPassword: !this.state.showPassword,
        });
    };
   
    handleMouseDownPassword(event) {
        event.preventDefault();
    };
    handleSubmit(e) {
        e.preventDefault();
        var history = this.props.history
        var self=this
        if ((this.state.password.length < 8) || (this.state.username_or_email  == '')) {
            this.setState({error:true,
                error_text:'please enter valid informations',
                error_color:'warning'})
        }
        else{
            
        axiosInstance.post(`/api/token/`, {
            username: this.state.username_or_email,
            password: this.state.password
        }).then(function (res) {
            localStorage.setItem("access_token",res.data.access)
            localStorage.setItem("refresh_token",res.data.refresh)
            localStorage.setItem("user_id",res.data.id)
            
            axiosInstance.defaults.headers['Authorization']=
            'JWT '+localStorage.getItem('access_token');
            // if (res.status == 201) {
            localStorage.setItem('islogin',true)
            // localStorage.setItem('user')
            self.props.handleLogin(true)
                history.push('/')
        }).catch(function (err) {
            self.setState({error_text:'Please Check username or password',error:true,error_color:'danger',username_or_email:'',password:''})
       
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
                                Login
                            </legend>
                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <TextField id="outlined-basic"  size="small" required fullWidth name="username_or_email" label="Username or Email" variant="outlined" color="primary" value={this.state.username_or_email} onChange={this.handleChange} />
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel sx={{ top: '-6px'}} htmlFor="outlined-adornment-password">Password*</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    name="password"
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    value={this.state.password}
                                    size="small"
                                    onChange={this.handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={this.handleClickShowPassword}
                                                onMouseDown={this.handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
                        </fieldset>
                        <div className="form-group">
                            <button className="btn btn-outline-info submitbtn" type="submit">
                                Sign In
                            </button>
                            <small className="text-muted">
                        <Link className="ml-2" to="/request-reset-email">Forget Password? </Link></small>

                        </div>
                    </form>

                    <div className="border-top pt-3">
                        <small className="text-muted">Create New Account 
                        <Link className="ml-2" to="/register">Sign up</Link></small>
                    </div>

                    </div>
                </div>
            </div>
            </div>
         

        )
    }

}

export default Login