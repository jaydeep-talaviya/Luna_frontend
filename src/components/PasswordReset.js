import react,{Component} from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import axiosInstance from "./axios.js";
import ErrorComp from './ErrorComp.js';

const baseURL = process.env.REACT_APP_BASE_URL;;

class PasswordReset extends Component{
    constructor(props){
        super(props)
        this.state={
            success:false,
            message:'',
            uid64:'',
            token:'',
            password:'',
            password2:'',

            invalid_token:false,
            error_text:'',
            error:false,
            error_color:'',
            
        }
        this.handleError=this.handleError.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleGoToLogin=this.handleGoToLogin.bind(this);

    }  
    handleError(){
        this.setState({error:false})
    }

    handleGoToLogin(){
        this.props.history.push('/login')
    }

    async componentDidMount() {
        var uidb64=this.props.match.params.uid
        var token=this.props.match.params.token
        try {
            const res = await fetch(`${baseURL}/password-reset/${uidb64}/${token}`)
            const responsepost = await res.json();
            if(!responsepost.error){
                this.setState({token:responsepost.token,uid64:uidb64})

            }
            else{
                this.setState({error_text:responsepost.error,error:true,error_color:'danger',invalid_token:true})

            }
         
          } catch (e) {
            this.setState({error_text:'Something went Wrong on Password Reset, Please Try Again',error:true,error_color:'danger',invalid_token:true})

        }

    }

    handleChange(e){
        this.setState({[e.target.name]:e.target.value})
    }
   async handleSubmit(e){
        e.preventDefault();
        var password=this.state.password
        var password2=this.state.password2
        var token=this.state.token
        var uid64=this.state.uid64
        try {
            const res = await fetch(`${baseURL}/password-reset-complete`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({'password':password,'password2':password2,'token':token,'uidb64':uid64})
            })
            const responsepost = await res.json();
            if(responsepost.success){
                  this.setState({success:true})
            }
            else{
                this.setState({error_text:responsepost[Object.keys(responsepost)[0]],error:true,error_color:'danger'})

            }
          
          } catch (e) {
            this.setState({error_text:'Something went Wrong on Password Reset, Please Try Again',error:true,error_color:'danger'})

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
                    {this.state.invalid_token?
                    <p>Your Reset Password link is expired. Please Try again,Thanks!</p>
                    :
                        this.state.success?
                        <div>
                            <h4 className="text-center">Your Password Has Been Reset</h4>
                            <div className="form-group text-center">
                                <button className="btn btn-outline-info" onClick={this.handleGoToLogin} type="submit">
                                    Go To Login
                                </button>
                            </div>
                        </div>
                        :
                        <form method="POST" noValidate onSubmit={this.handleSubmit}>

                        <fieldset className="form-group">
                            <legend className="border-bottom mb-4">
                                Reset Your Password
                            </legend>
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="outlined-basic"  size="small" required fullWidth name="password" label="Password" variant="outlined" color="primary" value={this.state.password} onChange={this.handleChange} />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
                                <TextField id="outlined-basic"  size="small" required fullWidth name="password2" label="Confirm Password" variant="outlined" color="primary" value={this.state.password2} onChange={this.handleChange} />
                            </FormControl>
                        </fieldset>
                        <div className="form-group text-center">
                            <button className="btn btn-outline-info submitbtn" type="submit">
                                Agree
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
export default PasswordReset