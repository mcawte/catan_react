import React, { useEffect, useRef, useState } from "react";
import { socket } from "../service/socket";
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
  Button,
  Box,
  Divider,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import useChatMessages from "../hooks/useChatMessages";
import useCurrentPlayers from "../hooks/useCurrentPlayers";
import { PublicGameState} from "../../shared_types/types";



interface Player {
  name: string;
  avatar: number;
}

interface GameChatProps {
  gameState: PublicGameState;
  setGameState: React.Dispatch<
    React.SetStateAction<PublicGameState>
  >;
  setTradeModal: (
    value: React.SetStateAction<{
      open: boolean;
    }>
  ) => void;
}

export default function GameChat(
  props: React.PropsWithChildren<GameChatProps>
) {
  //const classes = useStyles();

  const [gameChat, setGameChat] = useState({
    message: "",
  });

  

  const chatMessages = useChatMessages(props.gameState.gameName);
  const currentPlayers = useCurrentPlayers(props.gameState.gameName);



  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const proposeOrRescindTrade = () => {
    if (!props.gameState.currentTrade.active) {
      socket.emit(
        "proposeTrade",
        props.gameState.gameName,
        props.gameState.player.name,
        props.gameState
      );
    } else {
      socket.emit(
        "rescindTrade",
        props.gameState.gameName,
        props.gameState.player.name
      );
    }
  };

  const enoughResourcesToAcceptTrade = (): boolean => {
    if (
      props.gameState.currentTrade.inReturnFor.brick <=
        props.gameState.player.inventory.resources.brick &&
      props.gameState.currentTrade.inReturnFor.wheat <=
        props.gameState.player.inventory.resources.wheat &&
      props.gameState.currentTrade.inReturnFor.forest <=
        props.gameState.player.inventory.resources.forest &&
      props.gameState.currentTrade.inReturnFor.stone <=
        props.gameState.player.inventory.resources.stone &&
      props.gameState.currentTrade.inReturnFor.sheep <=
        props.gameState.player.inventory.resources.sheep
    ) {
      return true;
    } else {
      return false;
    }
  };

  const setPropose = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    offersOrFor: string
  ) => {
    console.log(
      "Set offers with " + e.target.value + " and name " + e.target.name
    );
    props.setGameState((state) => {
      return state !== undefined
        ? offersOrFor === "offers"
          ? {
              ...props.gameState,
              currentTrade: {
                ...props.gameState.currentTrade,
                offers: {
                  ...props.gameState.currentTrade.offers,
                  [e.target.name]: parseInt(e.target.value),
                },
              },
            }
          : {
              ...props.gameState,
              currentTrade: {
                ...props.gameState.currentTrade,
                inReturnFor: {
                  ...props.gameState.currentTrade.inReturnFor,
                  [e.target.name]: parseInt(e.target.value),
                },
              },
            }
        : state;
    });
  };

  useEffect(() => {
    socket.emit("getGames");
    return () => {};
  }, []);

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
                      ??
                    </span>
                  </button> */}
                </div>
                {/*body*/}
                <div className="relative p-6 pt-0  flex-auto">
                  <div
                    className="shadow  h-70v mt-4 mx-auto bg-green-200 
                    rounded-lg flex"
                  >
                    <div className="w-1/3 bg-gray-300">
                      <div className="bg-gray-300 h-10v">

{/* top */}
<Box paddingLeft={2}>
                <Typography variant="h5">
                  In: {props.gameState.gameName}
                </Typography>
              </Box>
              <List>
                <ListItem button key="JJ">
                  <ListItemIcon>
                    <Avatar
                      alt="JJ"
                      src={`avatars/a${currentPlayers.find(eachPlayer => eachPlayer.name === props.gameState.player.name)?.avatar}.svg`}
                    />
                  </ListItemIcon>
                  <ListItemText>{props.gameState.player.name}</ListItemText>
                </ListItem>
              </List>

                    
                      </div>
                      
                        
                        
                        {/* bottom */}
                        <div>
                        <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();

                    console.log("Should be trying to go back to game");

                    props.setTradeModal({ open: false });
                  }}
                >
                  Return to Game
                </Button>
                <Box mt={1}>
                  {props.gameState.player.name ===
                  props.gameState.playerTurn.player.name ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => proposeOrRescindTrade()}
                      
                    >
                      {!props.gameState.currentTrade.active
                        ? "Propose Trade"
                        : "Rescind Offer"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={
                        !props.gameState.currentTrade.active ||
                        !enoughResourcesToAcceptTrade()
                      }
                      onClick={(e) => {
                        e.preventDefault();

                        console.log("Should be accepting trade");
                        socket.emit(
                          "acceptTrade",
                          props.gameState.gameName,
                          props.gameState.player.name
                        );

                        //beginGame();
                      }}
                    >
                      Accept Trade
                    </Button>
                  )}
                </Box>
                <Divider />
              <List>
                <ListItem>
                  <ListItemText>Players</ListItemText>
                </ListItem>

                {currentPlayers.map((player) => avatarBlock(player))}
              </List>
                        
                        </div>
                    </div>

                    <div className="w-2/3 flex-row">

                    <div className="bg-green-200 h-55% overflow-y-scroll border-2 border-indigo-300">
                      <div>
                      
              Propose
              <div className="flex-row">
              <TextField
                id="forest"
                name="forest"
                label="forest"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.forest,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.offers.forest}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="brick"
                name="brick"
                label="brick"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.brick,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.offers.brick}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="sheep"
                name="sheep"
                label="sheep"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.sheep,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.offers.sheep}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="stone"
                name="stone"
                label="stone"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.stone,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.offers.stone}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="wheat"
                name="wheat"
                label="wheat"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.wheat,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.offers.wheat}
                onChange={(e) => setPropose(e, "offers")}
              />
            </div>
            
            
              For
              <div className="flex-row">
              <TextField
                id="forest"
                name="forest"
                label="forest"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.inReturnFor.forest}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="brick"
                name="brick"
                label="brick"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.inReturnFor.brick}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="sheep"
                name="sheep"
                label="sheep"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.inReturnFor.sheep}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="stone"
                name="stone"
                label="stone"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.inReturnFor.stone}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="wheat"
                name="wheat"
                label="wheat"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                
                value={props.gameState.currentTrade.inReturnFor.wheat}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />



            </div>

            </div>
                      </div>

                      <div className="bg-gray-300 h-35% overflow-y-scroll border-2 border-indigo-300">
                        
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
                  value={gameChat.message}
                  onChange={(e) =>
                    setGameChat((state) => ({
                      ...state,
                      message: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      socket.emit(
                        "chatMessage",
                        props.gameState.gameName,
                        props.gameState.player.name,
                        gameChat.message
                      );

                      setGameChat((state) => ({
                        ...state,
                        message: "",
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
                        props.gameState.gameName,
                        props.gameState.player.name,
                        gameChat.message
                      );

                      setGameChat((state) => ({
                        ...state,
                        message: "",
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


    {/* <div>
      <Box m={2}>
        <Container maxWidth="md">
          <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
              <Box paddingLeft={2}>
                <Typography variant="h5">
                  In: {props.gameState.gameName}
                </Typography>
              </Box>
              <List>
                <ListItem button key="JJ">
                  <ListItemIcon>
                    <Avatar
                      alt="JJ"
                      src="https://material-ui.com/static/images/avatar/1.jpg"
                    />
                  </ListItemIcon>
                  <ListItemText>{props.gameState.player.name}</ListItemText>
                </ListItem>
              </List>
              <Divider />

              <Grid item xs={12} style={{ padding: "10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();

                    console.log("Should be trying to go back to game");

                    props.setTradeModal({ open: false });
                  }}
                >
                  Return to Game
                </Button>
                <Box mt={1}>
                  {props.gameState.player.name ===
                  props.gameState.playerTurn.player.name ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => proposeOrRescindTrade()}
                      
                    >
                      {!props.gameState.currentTrade.active
                        ? "Propose Trade"
                        : "Rescind Offer"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={
                        !props.gameState.currentTrade.active ||
                        !enoughResourcesToAcceptTrade()
                      }
                      onClick={(e) => {
                        e.preventDefault();

                        console.log("Should be accepting trade");
                        socket.emit(
                          "acceptTrade",
                          props.gameState.gameName,
                          props.gameState.player.name
                        );

                        //beginGame();
                      }}
                    >
                      Accept Trade
                    </Button>
                  )}
                </Box>
              </Grid>

              <Divider />
              <List>
                <ListItem>
                  <ListItemText>Players</ListItemText>
                </ListItem>

                {currentPlayers.map((player) => avatarBlock(player))}
              </List>
            </Grid>
            
            <Grid item xs={2}>
              Propose
              <TextField
                id="forest"
                name="forest"
                label="forest"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.forest,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.offers.forest}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="brick"
                name="brick"
                label="brick"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.brick,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.offers.brick}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="sheep"
                name="sheep"
                label="sheep"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.sheep,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.offers.sheep}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="stone"
                name="stone"
                label="stone"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.stone,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.offers.stone}
                onChange={(e) => setPropose(e, "offers")}
              />
              <TextField
                id="wheat"
                name="wheat"
                label="wheat"
                type="number"
                InputProps={{
                  inputProps: {
                    max: props.gameState.player.inventory.resources.wheat,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.offers.wheat}
                onChange={(e) => setPropose(e, "offers")}
              />
            </Grid>
            
            <Grid item xs={2}>
              For
              <TextField
                id="forest"
                name="forest"
                label="forest"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.inReturnFor.forest}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="brick"
                name="brick"
                label="brick"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.inReturnFor.brick}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="sheep"
                name="sheep"
                label="sheep"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.inReturnFor.sheep}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="stone"
                name="stone"
                label="stone"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.inReturnFor.stone}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
              <TextField
                id="wheat"
                name="wheat"
                label="wheat"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 19,
                    min: 0,
                  },
                }}
                fullWidth
                value={props.gameState.currentTrade.inReturnFor.wheat}
                onChange={(e) => setPropose(e, "inReturnFor")}
              />
            </Grid>
            <Divider />
            <Grid item xs={12} className={classes.messageArea}>
              <Container style={{ height: "45vh" }}>
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
                  value={gameChat.message}
                  onChange={(e) =>
                    setGameChat((state) => ({
                      ...state,
                      message: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      socket.emit(
                        "chatMessage",
                        props.gameState.gameName,
                        props.gameState.player.name,
                        gameChat.message
                      );

                      setGameChat((state) => ({
                        ...state,
                        message: "",
                      }));
                    }
                  }}
                />
              </Grid>
              
                <Grid item xs={1}>
                  <Fab
                    color="primary"
                    aria-label="add"
                    onClick={(e) => {
                      e.preventDefault();
                      socket.emit(
                        "chatMessage",
                        props.gameState.gameName,
                        props.gameState.player.name,
                        gameChat.message
                      );

                      setGameChat((state) => ({
                        ...state,
                        message: "",
                      }));
                    }}
                  >
                    <Send />
                  </Fab>
                
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div> */}
    </>
  );
}

function chatMessageBlock(
  index: any,
  message: any,
  playerName: any,
  time: number
) {
  return (
    <ListItem key={index}>
      <Grid container>
        <Grid item xs={12}>
          <ListItemText style={{ textAlign: "right" }}>{message}</ListItemText>
        </Grid>
        <Grid item xs={12}>
          <ListItemText
            style={{ textAlign: "right" }}
            secondary={`${playerName} - ${new Date(time).toLocaleString()}`}
          ></ListItemText>
        </Grid>
      </Grid>
    </ListItem>
  );
}

function avatarBlock(player: Player, players?: any) {
  return (
    <ListItem button key={player.name + player.avatar}>
      <ListItemIcon>
        <Avatar
          alt="JJ"
          //src={`https://material-ui.com/static/images/avatar/${Math.floor(Math.random() * 6) + 1}.jpg`}
          src={`avatars/a${player.avatar}.svg`}
        />
      </ListItemIcon>

      <ListItemText>{player.name}</ListItemText>

      <ListItemText
        secondary={players ? `${players} Players` : "red"}
        style={{ textAlign: "right" }}
      ></ListItemText>
    </ListItem>
  );
}
