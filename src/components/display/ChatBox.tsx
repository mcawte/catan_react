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
  makeStyles,
  Box,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";



const useStyles = makeStyles({
  table: {
    minHeight: "500px",
  },
  chatSection: {
    width: "100%",
    height: "80vh",
    minHeight: "500px",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    //height: "70vh",
    //minHeight: "400px",
    overflowY: "auto",
  },
});



interface ChatBoxInterface {
    gameName: string;
    playerName: string;
    chatMessages: { playerName: string; message: string; time: number }[];
    children: ReactNode | ReactNode[]
}

export default function ChatBox({gameName, playerName, chatMessages, children}: ChatBoxInterface) {
 // const classes = useStyles();

  const [localChatState, setLocalChatState] = useState({
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
                    onClick={() => chatProps.setShowChat(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button> */}
                </div>
                {/*body*/}
                <div className="relative p-6 pt-0  flex-auto">
                  <div
                    className="shadow  h-70v mt-4 mx-auto bg-green-200 
                    rounded-lg flex"
                  >
                    <div className="w-1/3 bg-red-400">
                      <div className="bg-blue-200 h-10v">

{/* top */}

                      <Box paddingLeft={2}>
                <Typography variant="h5">In: {gameName}</Typography>
              </Box>
              <List>
                <ListItem button key="JJ">
                  <ListItemIcon>
                    <Avatar
                      alt="JJ"
                      src="https://material-ui.com/static/images/avatar/1.jpg"
                    />
                  </ListItemIcon>
                  <ListItemText>{playerName}</ListItemText>
                </ListItem>
              </List>
                      </div>
                      <div>
                        
                        
                        {/* bottom */}
                        
                        {children}
                        
                        </div>
                    </div>

                    <div className="w-2/3 bg-yellow-200 flex-row">
                      <div className="bg-green-300 h-90%">
                        
                        {/* chat */}
                        <div className="overflow-y-auto">
              
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
                        </div>
                      <div className="bg-blue-500 bottom-0 h-10%">
                        
                        {/* input */}
                        <div className="flex justify-end content-end">
                      <div className="flex-1">
                <TextField
                  id="outlined-basic-email"
                  label="Type something"
                  fullWidth
                  value={localChatState.messageInputField}
                  onChange={(e) =>
                    setLocalChatState((state) => ({
                      ...state,
                      messageInputField: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      socket.emit(
                        "chatMessage",
                        gameName,
                        playerName,
                        localChatState.messageInputField
                      );

                      setLocalChatState((state) => ({
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
                      playerName,
                      localChatState.messageInputField
                    );

                    setLocalChatState((state) => ({
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
    
      {/* <Box m={2}>
        <Container maxWidth="md">
          <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
              <Box paddingLeft={2}>
                <Typography variant="h5">In: {gameName}</Typography>
              </Box>
              <List>
                <ListItem button key="JJ">
                  <ListItemIcon>
                    <Avatar
                      alt="JJ"
                      src="https://material-ui.com/static/images/avatar/1.jpg"
                    />
                  </ListItemIcon>
                  <ListItemText>{playerName}</ListItemText>
                </ListItem>
              </List>
              <Divider />
              {children}

              

              <Divider />    
            </Grid>
            
                  
                
            <Grid item xs={9} className={classes.messageArea}>
              <Container style={{ height: "65vh" }}>
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

                <Divider />
              </Container>
            </Grid>

            <Grid container justify="flex-end">
              <Grid item xs={8}>
                <TextField
                  id="outlined-basic-email"
                  label="Type something"
                  fullWidth
                  value={localChatState.messageInputField}
                  onChange={(e) =>
                    setLocalChatState((state) => ({
                      ...state,
                      messageInputField: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      socket.emit(
                        "chatMessage",
                        gameName,
                        playerName,
                        localChatState.messageInputField
                      );

                      setLocalChatState((state) => ({
                        ...state,
                        messageInputField: "",
                      }));
                    }
                  }}
                />
              </Grid>
              <Grid container alignItems="flex-end">
              <Grid item xs={1} >
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={(e) => {
                    e.preventDefault();
                    socket.emit(
                      "chatMessage",
                      gameName,
                      playerName,
                      localChatState.messageInputField
                    );

                    setLocalChatState((state) => ({
                      ...state,
                      messageInputField: "",
                    }));
                  }}
                >
                  <Send />
                </Fab>
              </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box> */}
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




  


