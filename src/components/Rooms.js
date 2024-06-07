import React, { useEffect, useState } from 'react'
import './rooms.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import axiosInstance from './axios';
import { useHistory } from "react-router-dom";
import Chat from './Chat';

const baseURL = process.env.REACT_APP_BASE_URL;;


function Rooms() {

        const [rooms,setRooms] = useState([])
        const [currentRoom,setCurrentRoom] = useState('')
        const history = useHistory()

        const enterRoom = (roomName) => {
            console.log(">>>>>>e",roomName)
            setCurrentRoom(roomName)
        }

        useEffect(async ()=>{
            var self=this;

                 axiosInstance.get(`room/all/`).then(function (res) {
                        console.log(">>>>res",res)
                        setRooms(res.data)
                    }).catch((e)=>{
                        console.log("error",e)
                    })
                
        },[])
    


    return (
        <div className="room_container">
            <div className='room_content_left'>
                {rooms.length > 0 &&
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {rooms.map((room)=> {
                  return  (<>
                     <ListItem alignItems="flex-start" onClick={()=>enterRoom(room.name)}>
                        <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={`${room.room_profile}`} />
                        </ListItemAvatar>
                        <ListItemText
                        id={`room_${room.name}`}
                        primary={`${room.name}`}
                        secondary={
                            <>
                             <React.Fragment>
                                {room.description && 
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {room.description.length > 50? room.description.substring(0,50)+'...':room.description}
                                </Typography>
                                }
                            </React.Fragment>
                            <br/>
                            <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {room.total_user}
                            </Typography>
                            {" total users "}
                            </React.Fragment>
                           
                            </>
                        }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    </>)
                })}
            </List>
            }
            </div>
            <div className='room_content_right'>
                {currentRoom && <Chat roomName={currentRoom}/>}
                
            </div>
        </div>
    )
}

export default Rooms