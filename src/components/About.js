import React,{Component} from "react";
import jaydeep from './images/jaydeep.jpg'

class About extends Component{
    render(){
        return(
            <div>
                <div className="row p-5">
                    <div className="col-md-4">
                    <img className="rounded-circle img-fluid rounded mx-auto d-block" src={jaydeep} />
                    </div>
                    <div className="col-md-8">
                        <div>
                            <h3 className="text-center">Jaydeep Talaviya</h3>
                            <div>
                                <span>
                                    Namaste, I am jaydeep , a self-tought Programmer. currrenty working as Python/Odoo Developer in IT Company Named Techultra Solution Pvt Ltd at Ahmedabad. After working ours of my office i am giving time to practice of my skills and problem-solving.i want to be Full-Stack Developer with the use of Python,Javascript technologies and its Frameworks,i am also interested in cutting-edge technologies like Machine Learning,Deep Learning and A.I. , so thanks for using this app!.
                                    
                                </span>
                            </div>

                            <div className="mt-5">
                            <h4 className="text-center">Contact Me</h4>
                            <ul className="list-group" style={{fontSize:'large'}}>
                                    <li className="list-group-item"><i className="fas fa-phone-square-alt" style={{color:'#007bff',fontSize:'larger'}}></i> +91 9586258025</li>
                                    <li className="list-group-item"><i className="fab fa-whatsapp-square" style={{color:'#2fff40',fontSize:'larger'}}></i> +91 6353701592</li>
                                    <li className="list-group-item"><i className="fas fa-envelope-square" style={{color:'rgb(255 47 47 / 87%)',fontSize:'larger'}}></i> jaydeeptalaviya@gmail.com</li>
                                    <li className="list-group-item" style={{overflowWrap:'break-word'}}><i className="fab fa-linkedin" style={{color:'rgb(47 129 255)',fontSize:'larger'}}></i> https://www.linkedin.com/in/jaydeep-talaviya-540901195/</li>
                                    
                                    </ul>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default About