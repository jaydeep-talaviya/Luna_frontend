import React,{useState,useEffect} from 'react'
import axiosInstance from './axios';

const baseURL = process.env.REACT_APP_BASE_URL;;
function Chat({roomName}) {
    console.log(">>>>Step 1",roomName)
    const user_id = localStorage.getItem("user_id")

    const [messages, setMessages] = useState([])
    
    useEffect(() => {
        if (roomName.length > 0) 
        {
            const fetchData = async () => {
                axiosInstance.get(`room/${roomName}/`)
                .then(response => setMessages(response.data))
                .catch(err => console.log(">>>>>> got error",err))
                }
                // const timer = setInterval(() => {fetchData()}, 1000)
                fetchData()
                // return () => clearInterval(timer)
        }
        
    }, [])

    const Send = async (e) => {
        e.preventDefault()
        // let data = {'message': e.target.message.value, "image": [e.target.image.files[0], e.target.image.files[0].name]}
        let data = new FormData()
        data.append("message", e.target.message.value)
        data.append("image", e.target.image.files[0])
        
        axiosInstance.post(`room/${roomName}`,{data: data}).then(response => console.log(response.json()))
        e.target.reset()
        let messagesContainer = document.getElementById("messagesContainer")
        messagesContainer.scrollTo(0, 0)
    }

    console.log(">>>>>>name",roomName)

    
  return (
            <>
                   <nav>
                <h2>{roomName}</h2>
            </nav>
            <div className="chat_messages">
                <div className="chat_message" id='messagesContainer'>
                    {messages && messages.map((message) => {
                        return <div className={`${Number(user_id) === Number(message.user_id) ? 'chat_owner' : 'chat_another'}`} key={message.id}><h3>{message.user}</h3> <p>{message.message} {message.user_id} {user_id}</p>
                            {message.image ? <img className='chat_image' style={{'width': 'auto', 'height': "100px", "display": "block"}} src={`${baseURL}/${message.image}`} loading="lazy" width={300} height={150} /> : ''}
                        </div>
                    })}
                </div>
            </div>
            <form className='chat_send' onSubmit={Send}>
                <input type="text" name="message" />
                <input type="file" name="image" />
                <input type="submit" value="Send" />
            </form>
            </>
          
       
    )
}

export default Chat