import React, { ReactNode, useEffect, useRef, useState } from "react";
import { socket } from "../../service/socket"
import {
  Paper,
  Grid,
  Divider,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fab,
  makeStyles,
  Container,
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
    height: "70vh",
    minHeight: "400px",
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
  const classes = useStyles();

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
    
      <Box m={2}>
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
      </Box>
    
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




  


