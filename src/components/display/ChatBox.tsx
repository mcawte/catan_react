import React, { ReactNode, useEffect, useRef, useState } from "react";
import { socket } from "../../service/socket"
import {
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fab,
  Box,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import DropDown from "./DropDown";






interface ChatBoxInterface {
    gameName: string;
    player: {name: string, avatar: number};
    chatState: {
      playerName: string;
      avatar: number;
      gameName: string;
      open: boolean;
  };
    setChatState: React.Dispatch<React.SetStateAction<{
      playerName: string;
      avatar: number;
      gameName: string;
      open: boolean;
  }>>;
    chatMessages: { playerName: string; message: string; time: number }[];
    children: ReactNode | ReactNode[]
}

export default function ChatBox({chatState, setChatState,gameName, player, chatMessages, children}: ChatBoxInterface) {
 // const classes = useStyles();

  const [inputChatState, setInputChatState] = useState({
      gameNameInputField: "",
      messageInputField: ""
  })


  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };



  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const openProfile = () => {
    setChatState((state) => ({
      ...state,
      open: !state.open,
    }))
  }
 
let dropDownOptions = [{name: "Profile", id: 1, onClick: openProfile}];

  return (
    <>
    
    <div className="min-h-screen">
        {/* body */}
        <div className="h-90v">
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-2/3 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 pb-0 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Catan</h3>



                  {/* <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button> */}
                  <DropDown options={dropDownOptions}/>
                </div>
                {/*body*/}
                <div className="p-6 pt-0  flex-auto">
                  <div
                    className="shadow  h-70v mt-4 mx-auto bg-gray-300 
                    rounded-lg flex"
                  >
                    <div className="w-1/3 bg-gray-300">
                      <div className="bg-gray-300 h-10v">

{/* top */}

                      <Box paddingLeft={2}>
                <Typography variant="h5">In: {gameName}</Typography>
              </Box>
              <List>
                <ListItem button key="JJ">
                  <ListItemIcon>
                    <Avatar
                      alt="JJ"
                      src={`/avatars/a${player.avatar}.svg`}
                    />
                  </ListItemIcon>
                  <ListItemText>{player.name}</ListItemText>
                </ListItem>
              </List>
                      </div>
                      <div>
                        
                        
                        {/* bottom */}
                        
                        {children}
                        
                        </div>
                    </div>

                    <div className="w-2/3 flex-row">
                      <div className="bg-gray-300 h-90% overflow-y-scroll border-2 border-indigo-300">
                        
                        {/* chat */}
                        
              
                <List>
                  {chatMessages.map((chatMessage, index) =>
                    chatMessageBlock(
                      index,
                      chatMessage.message,
                      chatMessage.playerName,
                      chatMessage.time
                    )
                  )}
                  <div ref={messagesEndRef} />
                </List>

                
            
                        </div>
                      <div className="bg-gray-300 bottom-0 h-10%">
                        
                        {/* input */}
                        <div className="flex justify-end content-end">
                      <div className="flex-1">
                <TextField
                  id="outlined-basic-email"
                  label="Type something"
                  fullWidth
                  value={inputChatState.messageInputField}
                  onChange={(e) =>
                    setInputChatState((state) => ({
                      ...state,
                      messageInputField: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      socket.emit(
                        "chatMessage",
                        gameName,
                        player.name,
                        inputChatState.messageInputField
                      );

                      setInputChatState((state) => ({
                        ...state,
                        messageInputField: "",
                      }));
                    }
                  }}
                />
                </div>
              
              <div>
              <Grid item xs={1} >
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={(e) => {
                    e.preventDefault();
                    socket.emit(
                      "chatMessage",
                      gameName,
                      player.name,
                      inputChatState.messageInputField
                    );

                    setInputChatState((state) => ({
                      ...state,
                      messageInputField: "",
                    }));
                  }}
                >
                  <Send />
                </Fab>
              </Grid>
              </div>
              </div>
            
                        
                        </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </div>
    </div>
    
    
      </>
    
  );
}

function chatMessageBlock(index: any, message: any, playerName: any, time: number) {
  return (
    <ListItem key={index}>
      <Grid container>
        <Grid item xs={12}>
          <ListItemText style={{ textAlign: "right" }}>{message}</ListItemText>
        </Grid>
        <Grid item xs={12}>
          <ListItemText
            style={{ textAlign: "right" }}
            secondary={`${playerName} - ${(new Date(time)).toLocaleString()}`}
          ></ListItemText>
        </Grid>
      </Grid>
    </ListItem>
  );
}




  


