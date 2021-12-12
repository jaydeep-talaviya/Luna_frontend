import React,{Component} from "react";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axiosInstance from "./axios.js";
import ErrorComp from "./ErrorComp.js";

class PostDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            categories:[],
            error_text:'',
            error:false,
            error_color:'',
            new_category:'',

            title:'',
            content:'',
            image:'',
            category:'',
            new_image:'',

        }
        this.addCategory=this.addCategory.bind(this)
        this.handleChange=this.handleChange.bind(this);
        this.handleChangeInputs=this.handleChangeInputs.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleError=this.handleError.bind(this);
        this.handleImageChange=this.handleImageChange.bind(this);
        this.GoBackPage=this.GoBackPage.bind(this);
        this.handleDeletePost=this.handleDeletePost.bind(this);
        this.OpenModel=this.OpenModel.bind(this);
    }

    handleChangeInputs(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleImageChange(e){
        var reader = new FileReader();
        var url = reader.readAsDataURL(e.target.files[0]);
        this.setState({
            new_image: e.target.files[0],
        })
        reader.onloadend = function (e) {
            this.setState({
                image: reader.result
            })
          }.bind(this);
      };
    
    handleSubmit(e){
        e.preventDefault();
        
        let form_data = new FormData();
        if (this.state.new_image!= ''){
            form_data.append('image', this.state.new_image, this.state.new_image.name);
        }
        form_data.append('title', this.state.title);
        form_data.append('content', this.state.content);
        form_data.append('category', this.state.category);
        // var user_id=localStorage.getItem('user_id')
        // form_data.append('auther', user_id);

        var self=this;
        var history = this.props.history;
        var post_id=this.props.match.params.id

        axiosInstance.patch(`/post/${post_id}`,
            form_data,
        ).then(function (res) {
     
            self.setState({
                error_text:'',
                error:false,
                error_color:'',

                title:'',
                content:'',
                new_image:'',
                category:'',
            })
            history.goBack();
          }).catch(function (err) {
            self.setState({error_text:err.toJSON().message,error:true,error_color:'danger'})

        }) 
    }

    handleError(){
        this.setState({error:false})
    }

    addCategory(){
        var new_category_name=$("input[name='new_category']").val()
        var self=this
        axiosInstance.post(`category/createcategory`,{
            category:new_category_name
        }).then(function (res) {
            self.setState({categories:[...self.state.categories,res.data],new_category:''}) 
          })
    }


    handleChange(e){ 
        this.setState({new_category:e.target.value})
        if((this.state.categories.filter((x)=>x.category.toLowerCase() === e.target.value.toLowerCase())).length > 0){
            $('.new_category_help').text("Already Exist This Category").css('display','').css('color',"red")
            $('.add_category_btn').css('display', '')
            $('.add_category_btn_new').css('display', 'none')

        }
        else if(e.target.value == ''){
            $('.new_category_help').text("Please Enter Valid Category").css('display','').css('color',"red")
            $('.add_category_btn').css('display', '')
            $('.add_category_btn_new').css('display', 'none')
        }
        else{
            $('.add_category_btn').css('display', 'none')
            $('.new_category_help').css('display','none');
            $('.add_category_btn_new').css('display', '')
            
        }
        
    }



    componentDidMount() {
        var self=this;

        try
        {
            axiosInstance.get(`categorylist`).then(function (res) {
                self.setState({categories:res.data})
              })
          axiosInstance.get(`post/${self.props.match.params.id}`).then(function (res) {
            self.setState({
                title:res.data.title,
                content:res.data.content,
                image:res.data.image,
                category:res.data.category
            })
          })

        } 
        catch(e){
            
            console.log(e);
        }
      }
      GoBackPage(){
        var history = this.props.history;
        history.goBack();
      }

    handleDeletePost(e){

        var post_id=this.props.match.params.id
         // this.history
        try
         {
           axiosInstance.delete(`/post/${post_id}`).then(function (res) {
             // self.setState({categories:res.data})
           })
         } 
         catch(e){
             
             console.log(e);
         }
     $(".modal").modal('hide');
     this.props.history.push("/profile");
 
     }

     OpenModel(e){
        $('#delete_input_id').val(e.target.id.split('_')[2])
        $("#deletePost").modal('show');
    }



    render(){
       

        return(
            
            <div>
                {this.state.error?
                    <ErrorComp error={this.state.error_text} iserror={this.state.error} error_color={this.state.error_color} changerror={this.handleError}/>:
                        ''
                        }
                {this.state.category!=''?

                    <div className="col-md-8 offset-md-2">
                   
                        <div className="content-section">
                           
                            <fieldset className="form-group">
                                    <legend className="border-bottom mb-4">
                                    Change Your Post
                                    </legend>
                                <form method="POST" noValidate onSubmit={this.handleSubmit} m>
                                <FormControl sx={{ mb: 1, width: '100%' }} variant="outlined">
        
                                    <TextField id="outlined-basic"  size="small" required fullWidth name="title" label="Title" variant="outlined" color="primary" onChange={this.handleChangeInputs} value={this.state.title} />
                                </FormControl>
        
                                <FormControl sx={{ mb: 1, width: '100%' }} variant="outlined">
                                <TextField
                                required fullWidth
                                name="content"
                                label="Description"
                                multiline
                                rows={3}
                                onChange={this.handleChangeInputs}
                                value={this.state.content}
                                />
                                </FormControl>
                                <div className="d-flex mb-2 px-5" style={{border:'1px solid',borderRadius:'4px',padding:'1%',justifyContent:'space-evenly'}}>
                                    <h5 style={{alignSelf:'center'}}>Current Image</h5>
                                    <img className="rounded-circle article-img" src={this.state.image} />

                                    </div>
                                <FormControl sx={{ mb: 1, width: '100%'}} variant="outlined">
                                <div className="form-group d-flex justify-content-center m-0" style={{color:'white'}}>
                                    <div style={{backgroundColor:'black',padding:'2%',borderRadius:'100px'}}>
                                    <input type="file" style={{borderRadius:'inherit'}} className="form-control-file" name="post_image" accept="image/png, image/jpeg"  onChange={this.handleImageChange}/>
                                    </div>
                                </div>
                                </FormControl>
        
                                <div style={{display:"flex",justifyContent:"space-around"}}>
        
                                <FormControl sx={{ mb: 1, width: '90%',margin:'0' }} variant="outlined">
                                <InputLabel id="categories">Category</InputLabel>
                                <Select
                                labelId="categories"
                                id="category"
                                label="Category"
                                name="category"
                                onChange={this.handleChangeInputs}
                                defaultValue={`${this.state.category}`}
                                >
                                {this.state.categories.map((h)=>
                                 <MenuItem value={h.id} >{h.category}</MenuItem>
                                )}
                                
                                </Select>
                                </FormControl>
                                <div style={{ alignSelf: "center"}}>
                                <button type="button" href="#" className="btn btn-primary active" role="button" data-target="#exampleModal" data-toggle="modal" aria-pressed="true"><i data-toggle="tooltip" data-placement="top" title="Add New Category" className="fas fa-arrow-up"></i></button>
                                </div>
                                </div>
        
                                    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Add Category</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                            <FormControl sx={{ mb: 1, width: '100%' }} variant="outlined">
                                            <TextField id="outlined-basic"  size="small" onChange={this.handleChange} value={this.state.new_category} required fullWidth name="new_category" label="Category" variant="outlined" color="success"  />
                                            </FormControl>
                                            <p className="new_category_help" style={{ fontSize: '84%',marginLeft: '4%',color: 'grey', display: 'none',marginBottom:'0' }}></p>
        
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary add_category_btn" disabled>Add</button>
        
                                                <button type="button" className="btn btn-primary add_category_btn_new" style={{display:'none'}} onClick={this.addCategory} data-dismiss="modal">Add</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4 text-center">
                                        <div className="col-6">
                                        <button type="submit" className="btn btn-success">Update Post</button>

                                            </div>
                                        <div className="col-6">
                                            <div className="modal fade" id="deletePost" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Confirmation</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are You Sure You Want to Delete This Post?
                                                        <input type="text" id="delete_input_id" className="d-none"/>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={this.handleDeletePost}>Yes </button>
                                                    </div>
                                                    </div>
                                                </div>
                                                </div>

                                                <button type="button" className="btn btn-danger" onClick={this.OpenModel}>
                                                Delete 
                                                </button>
                                            </div>
                                    </div>
                                </form>
                                <div className="d-flex justify-content-center mt-4">
                                <button className="btn btn-info" onClick={this.GoBackPage}>Go Back!</button>
 
                                </div>
                            </fieldset>
                            
        
                        </div>
                    </div>
                    :
                    ''
            }
                 
            </div>

        )
    }
}

export default PostDetail