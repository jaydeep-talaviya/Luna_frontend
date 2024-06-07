import React,{Component} from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import axiosInstance from "./axios.js";
import regeneratorRuntime from "regenerator-runtime";
import ErrorComp from './ErrorComp.js'
import $ from 'jquery';

const baseURL = process.env.REACT_APP_BASE_URL;;


class ForgetPassword extends Component{
    constructor(props){
        super(props);
        this.state={
            email:'',
            sent_email:false,
            error:false,
            error_text:'',
            error_color:''
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleError=this.handleError.bind(this);
    }

    handleChange(e){
        this.setState({email:e.target.value})
    }

    handleError(){
        this.setState({error:false})
    }

    async handleSubmit(e){
        e.preventDefault()
        var email=$(e.target).find('input[name=email]').val()
    
        try {
            const res = await fetch(`${baseURL}/request-reset-email`,
                                {method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                  },
                                body: JSON.stringify({'email':email})
                            })
            const responsepost = await res.json();
            if (responsepost.success){
                this.setState({sent_email:true})

            }
          } catch (e) {
            this.setState({error_text:'Please Check Conntection! Something Went Wrong On Sending Email',error:true,error_color:'danger'})
        }


    }
    render(){
        return(
            <div>  
                 {this.state.error?
            <ErrorComp error={this.state.error_text} iserror={this.state.error} error_color={this.state.error_color} changerror={this.handleError}/>:
                ''
                }
                <div className="row">
                
                <div className="col-md-6 offset-md-3">
                <div className="content-section">
                {this.state.sent_email?
                <p>Please Check Your email,We have Sent You a Link To Reset Your Password</p>
                :
                <form method="POST" noValidate onSubmit={this.handleSubmit}>

                        <fieldset className="form-group">
                            <legend className="border-bottom mb-4">
                                Enter Your Email
                            </legend>
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="outlined-basic"  size="small" required fullWidth name="email" label="Email" variant="outlined" color="primary" value={this.state.username_or_email} onChange={this.handleChange} />
                            </FormControl>
                        </fieldset>
                        <div className="form-group text-center">
                            <button className="btn btn-outline-info submitbtn" type="submit">
                                Send Email
                            </button>
                        </div>
                    </form>
                }
                    
                </div>
                </div>
            </div>
            </div>

        )
    }

}

export default ForgetPassword