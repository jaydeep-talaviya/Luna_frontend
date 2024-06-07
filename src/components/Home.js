import React,{Component} from "react";
import './style.css';
import SinglePost from "./SinglePost.js";
import Slider from "./Slider.js";
import axiosInstance from "./axios.js";
import "./Loader.css";
import regeneratorRuntime from "regenerator-runtime";

const baseURL = process.env.REACT_APP_BASE_URL;;

class Home extends Component{
    
      
    constructor(props){
        super(props);
        this.state={
          posts:[],
          search_value:'',
          allcategory:[],
          found_data:true,
          page:1,
          loading:false,
          filter_url: "",
          next:null
        }
        
        this.handleChange=this.handleChange.bind(this);
        this.searchPost=this.searchPost.bind(this);
        this.clearPost=this.clearPost.bind(this);
        this.FilterPost=this.FilterPost.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

      }
      

      handleChange(e){
        e.preventDefault();
        this.setState({search_value:e.target.value})
      }
      async fetchPosts() {
        try {
          const res = await fetch(`${baseURL}?page=${this.state.page}`);
          const responsepost = await res.json();
          console.log(">>>>>>step 1",responsepost)
          const next_page= responsepost.next && responsepost.next.includes("page=")?responsepost.next.split("page=")[responsepost.next.split("page=").length-1][0]:1
          const old_posts = this.state.posts.filter((existingPost)=> !(existingPost.id in responsepost.results.map((x)=>x.id)))

          this.setState((prevState) => ({
            posts: [...old_posts, ...responsepost.results],
            page:next_page,
            loading: false,
            next: responsepost.next
          }));
        } catch (e) {
          console.log(e);
        }
      }

      async fetchCategories() {
        try {
          const res = await axiosInstance.get(`categorylist`);
          this.setState({ allcategory: res.data});
        } catch (e) {
          console.log(e);
        }
      }
    

      async clearPost(e) {
        this.setState({ search_value: "", found_data: true, filter_url: "",page:1,next:null,posts:[] });
        this.fetchPosts();
      }
      searchPost(e){
        e.preventDefault();
        var self=this;
        axiosInstance.get(`post/search/?search=${this.state.search_value}`).then(function (res) {
              console.log(res,"search result>>>>>>")
              const next_page= res.data.next && res.data.next.includes("page=")?res.data.next.split("page=")[res.data.next.split("page=").length-1][0]:1
              self.setState({posts:res.data.results,found_data:res.data.results.length>0?true:false, page:next_page, loading: false,next: res.data.next})
          })
      }
      FilterPost(filter_url){
        var self=this;
        this.setState({filter_url:filter_url})
        axiosInstance.get(`post/filter/?${filter_url}`).then(function (res) {
              console.log(res,"filter result>>>>>>")
              const next_page= res.data.next && res.data.next.includes("page=")?res.data.next.split("page=")[res.data.next.split("page=").length-1][0]:1
              self.setState({posts:res.data.results,page: next_page, loading: false,next:res.data.next})
          })
      }
      

   
      async componentDidMount() {
        console.log("componentDidMount called")
        this.fetchPosts();
        this.fetchCategories();
        window.addEventListener("scroll", this.handleScroll);
      }
      componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
      }
      handleScroll() {
        const threshold = 1; // Adjust this value as needed

        if (
          window.innerHeight + document.documentElement.scrollTop + threshold >=
          document.documentElement.offsetHeight
        ) {
          this.loadMoreItems();
        }
      }

      async loadMoreItems() {
        const { page, posts, search_value, filter_url } = this.state;
        console.log(">>>page", page, posts,this.state.next, "search_value", search_value, "filter_url", filter_url);
        this.setState({ loading: true });
        
        if (this.state.next !== null) {
          try {
            let url = `?page=${page}`;
            
            if (search_value !== '') {
              url = `post/search/?search=${this.state.search_value}&page=${page}`;
            }
            
            if (filter_url !== '') {
              url = `post/filter/?${filter_url}&page=${page}`;
            }
            
            const response = await axiosInstance.get(url);
            console.log(">>>>>responsepost",response)

            const responsepost = response.data;
            const old_posts = posts.filter((existingPost)=> !(existingPost.id in responsepost.results.map((x)=>x.id)))
            // const newPosts = responsepost.results.filter((newPost) => !posts.filter((existingPost) => existingPost.id === newPost.id));
            const next_page= responsepost.next && responsepost.next.includes("page=")?responsepost.next.split("page=")[responsepost.next.split("page=").length-1][0]:1

            this.setState((prevState) => ({
              posts: [...old_posts, ...responsepost.results],
              page: next_page,
              loading: false,
              next: responsepost.next
            }));
          } catch (e) {
            console.log(e);
          }
        }
      }
      
     

    render(){
      var user_id=localStorage.getItem('user_id')
        var allcategory=this.state.allcategory
        return(
              <div>
              <div className="wrap col-md-10 offset-md-1">
              <div className="search">
                  <input type="text" className="searchTerm" onChange={this.handleChange} placeholder="What are you looking for?" value={this.state.search_value}/>
                  <button type="submit" onClick={this.searchPost} className="searchButton">
                    <i className="fa fa-search"></i>
                </button>
                <button type="submit" onClick={this.clearPost} className="clearButton">
                    <i className="fa fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div className="row">
            <div className="col-md-4">
           
                <Slider allcategory={allcategory} FilterPost={this.FilterPost}/>
                </div>
                <div className="col-md-8">
                    {this.state.posts.length==0?
                    <div className="content-section">
                      <div className="media">
                        {this.state.found_data && this.state.posts.length !==0?
                          <div className="loader"></div>

                        :
                        <h1>Oops! Data not found!Please Try again</h1>
                        }
                        {this.state.loading && <div className="loader"></div>}
                        </div>
                      </div>
                    :
                      
                    
                    this.state.posts.map(h=>
                      <SinglePost key={h.id} postdata={h} user_id={Number(user_id)}/>
                    )
                    
                    }
                    
              
                </div>
                
            </div>
            </div>

        )
    }
}

export default Home