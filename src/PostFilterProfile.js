import React, { Component } from 'react';
import SinglePost from './SinglePost.js';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import axiosInstance from './axios.js';
import ErrorComp from './ErrorComp.js';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

class PostFilterProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allpost: [...this.props.allpost],
            allcategory: [...this.props.allcategory],
            user: this.props.user,
            profile: this.props.profile,
            selected_category: '',
            is_profile: this.props.is_profile ? true : false,
            isSmallerThenTablet: false,
            image: this.props.profile.image,
            new_image: '',
            description: this.props.profile.description,
            error_text: '',
            error: false,
            error_color: '',

            old_password:'',
            showoldPassword:false,
            password: '',
            showPassword1: false,
            confirmpassword: '',
            showPassword2: false,
        }
        this.handleSelectCategory = this.handleSelectCategory.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.updatePredicate = this.updatePredicate.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChangeInputs = this.handleChangeInputs.bind(this);
        this.handleChangeProfile = this.handleChangeProfile.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleFocus=this.handleFocus.bind(this);
        this.handleClickShowOldPassword=this.handleClickShowOldPassword.bind(this);
        this.handleClickShowPassword1=this.handleClickShowPassword1.bind(this);
        this.handleClickShowPassword2=this.handleClickShowPassword2.bind(this);
        this.handleMouseDownPassword=this.handleMouseDownPassword.bind(this);
        this.handleConfirmChangePassword=this.handleConfirmChangePassword.bind(this);

    }

    handleFocus(e){
        $('#hint_id_password1').removeClass('d-none')
    }
    
    handleClickShowOldPassword() {
        this.setState({
            showoldPassword: !this.state.showoldPassword,
        });
    };

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
    handleMouseDownPassword(event) {
        event.preventDefault();
    };

    componentDidMount() {
        this.updatePredicate();
        window.addEventListener("resize", this.updatePredicate);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updatePredicate);
    }

    updatePredicate() {
        this.setState({ isSmallerThenTablet: window.innerWidth < 767 });
    }

    handleClear() {
        this.setState({
            allpost: [...this.props.allpost],
            allcategory: [...this.props.allcategory],
            selected_category: ''
        })
        $('.clear_btn').addClass('d-none');
    }

    handleChangeInputs(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        var password=document.getElementsByName('password')[0].value
        var confirmpassword=document.getElementsByName('confirmpassword')[0].value


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
                    $('.password_help').text("please enter Valid password").css('display','').css('color',"red")

                }
            }   
           
        }
    }

    

    handleSelectCategory(e) {
        this.handleClear()
        e.preventDefault();

        var category_name = e.target.innerText;
        this.setState({ selected_category: category_name })
        var category_id = this.props.allcategory.filter((x) => x.category == category_name)
        category_id = category_id[0].id
        this.setState({ allpost: this.props.allpost.filter((x) => x.category == category_id) })
        $('.clear_btn').removeClass('d-none');
   
    }

    handleImageChange(e) {
        var reader = new FileReader();
        var url = reader.readAsDataURL(e.target.files[0]);
        this.setState({
            new_image: e.target.files[0],
        })
        reader.onloadend = function (e) {
            this.setState({
                image: reader.result,
            })
        }.bind(this);
    };



    handleChangeProfile(e) {
        e.preventDefault()
        var self = this;
        let form_data = new FormData();

        if (this.state.new_image != '') {
            form_data.append('image', this.state.new_image, this.state.new_image.name);
        }
        form_data.append('description', this.state.description);
        try {
            axiosInstance.patch(`profile`,
                form_data
            ).then(function (res) {
                self.setState({
                    profile: res.data,
                    new_image: '',
                })
                self.setState({ error_text: "your profile has been successfully updated!", error: true, error_color: 'info' })

            })
        } catch (e) {
            self.setState({ error_text: err.response.data.non_field_errors.length > 0 ? err.response.data.non_field_errors[0] : 'something went wrong, Please Try again', error: true, error_color: 'danger' })

        }
        $(".modal").modal('hide');
    }

    handleError() {
        this.setState({ error: false })
    }

    handleConfirmChangePassword(){
        var self=this;
        axiosInstance.put(`change_password/${Number(localStorage.getItem('user_id'))}/`,{
            password:this.state.password,
            password2:this.state.confirmpassword,
            old_password:this.state.old_password
        }
    ).then(function (res) {
        
        self.setState({password:'',password2:'',old_password:'' ,error_text: "your password has been successfully updated!", error: true, error_color: 'info' })

        }).catch(function(err) {
            self.setState({ error_text: "Something went wrong!Please Try Again to change password", error: true, error_color: 'danger' })

        })
    }

    render() {
        var user_id = localStorage.getItem('user_id')
        const isSmallerThenTablet = this.state.isSmallerThenTablet;
        this.state.allpost.filter((x) => x.auther.profile = this.state.profile)
        return (
            <div>
                {this.state.error ?
                    <ErrorComp error={this.state.error_text} iserror={this.state.error} error_color={this.state.error_color} changerror={this.handleError} /> :
                    ''
                }
                <div className="row">

                    <div className="col-md-4">
                        <div className="card card-01">
                            <div className="profile-box">
                                <img className="card-img-top rounded-circle" src={this.state.profile.image} alt="Card image cap" />
                            </div>
                            <div className="card-body text-center">
                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Update Profile</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="d-flex mb-2 px-5" style={{ border: '1px solid', borderRadius: '4px', padding: '1%', justifyContent: 'space-evenly' }}>
                                                    <h5 style={{ alignSelf: 'center' }}>Current Image</h5>
                                                    <img className="rounded-circle article-img" src={this.state.image} />
                                                </div>
                                                <FormControl sx={{ mb: 1, width: '100%' }} variant="outlined">
                                                    <div className="form-group d-flex justify-content-center m-0" style={{ color: 'white' }}>
                                                        <div style={{ backgroundColor: 'black', padding: '2%', borderRadius: '100px' }}>
                                                            <input type="file" style={{ borderRadius: 'inherit' }} className="form-control-file" name="post_image" accept="image/png, image/jpeg" onChange={this.handleImageChange} />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormControl sx={{ mb: 1, width: '100%' }} variant="outlined">
                                                    <TextField id="outlined-basic" size="small" required fullWidth name="description" label="Describe Your Self" variant="outlined" color="primary" onChange={this.handleChangeInputs} value={this.state.description} />
                                                </FormControl>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary" onClick={this.handleChangeProfile}>Save Profile</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal fade" id="change_password" tabIndex="-1" role="dialog" aria-labelledby="ChangePasswordLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Update Your Password</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            
                                        <FormControl sx={{ m: 1 }} variant="outlined">
                                                <InputLabel sx={{ top: '-6px'}} htmlFor="outlined-adornment-password">Old Password*</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    name="old_password"
                                                    type={this.state.showoldPassword ? 'text' : 'password'}
                                                    value={this.state.old_password}
                                                    onChange={this.handleChangeInputs}
                                                    size="small"

                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={this.handleClickShowOldPassword}
                                                                onMouseDown={this.handleMouseDownPassword}
                                                                edge="end"
                                                            >
                                                                {this.state.showoldPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                />
                                            </FormControl>

                                            <FormControl sx={{ m: 1 }} variant="outlined">
                                                <InputLabel sx={{ top: '-6px'}} htmlFor="outlined-adornment-password">Password*</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    name="password"
                                                    type={this.state.showPassword1 ? 'text' : 'password'}
                                                    value={this.state.password}
                                                    onChange={this.handleChangeInputs}
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
                                            <FormControl sx={{ m: 1}} variant="outlined">
                                                <InputLabel sx={{ top: '-6px'}} htmlFor="outlined-adornment-password">Confirm Password*</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    name="confirmpassword"
                                                    size="small"
                                                    type={this.state.showPassword2 ? 'text' : 'password'}
                                                    value={this.state.confirmpassword}
                                                    onChange={this.handleChangeInputs}
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

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" onClick={this.handleConfirmChangePassword}>Agree</button>
                                        </div>
                                        </div>
                                    </div>
                                    </div>

                                    {this.props.is_profile?

                                        <div className="row mb-3">
                                            <span className="col-6"  data-toggle="tooltip" data-placement="top" title="Update Profile">
                                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                                                <i className="fas fa-edit"></i>
                                                </button>
                                            </span>
                                            <span className="col-6" data-toggle="tooltip" data-placement="top" title="Change Password">
                                                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#change_password">
                                                    <i className="fas fa-unlock" ></i>
                                                </button>
                                            </span>
                                        </div>
                                        :''
                                    }

                                <h4 className="card-title">{this.state.user.username}</h4>
                                <p className="card-text">{this.state.user.email}</p>
                                <p className="card-text">{this.state.profile.description}</p>


                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        {this.state.selected_category != '' ?
                                            <h5 className="text-center">Result For '{this.state.selected_category}'
                                            </h5>
                                            : ''
                                        }

                                        <button className="btn btn-danger clear_btn d-none" onClick={this.handleClear}>Clear</button>
                                    </li>

                                    {this.props.allcategory.map((x) =>
                                        <li className="list-group-item" key={x.id}>
                                            <div className="row" >
                                                <div className="col-8 d-flex justify-content-start" onClick={this.handleSelectCategory}>
                                                    <strong style={{ color: '#006EFF', cursor: 'pointer' }}>
                                                        {x.category}
                                                    </strong>

                                                </div>

                                                <div className="col-1 category_number d-flex justify-content-center">
                                                    <span>
                                                        {this.props.allpost.filter((y) => y.category == x.id).length}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    )}


                                </ul>
                            </div>
                        </div>

                    </div>

                    {isSmallerThenTablet ?
                        <div className="col-md-8">

                            <div className="card">
                                {this.state.allpost.map(h =>
                                    <SinglePost key={h.id} postdata={h} user_id={Number(user_id)} is_profile={this.state.is_profile} history={this.props.history} />
                                )}
                            </div>
                        </div>
                        :
                        <div className="col-md-8" style={{ height: '80vh', overflow: 'scroll' }}>

                            <div className="card">
                                {this.state.allpost.map(h =>
                                    <SinglePost key={h.id} postdata={h} user_id={Number(user_id)} is_profile={this.state.is_profile} />
                                )}
                            </div>
                        </div>
                    }


                </div>
            </div>

        );
    }

}

export default PostFilterProfile