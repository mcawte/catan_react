import React, { useEffect, useRef, useState } from "react";
import { socket } from "../service/socket"
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@material-ui/core";
import { Send, AddBox } from "@material-ui/icons";
import useChatMessages from "../hooks/useChatMessages";
import useCurrentPlayers from "../hooks/useCurrentPlayers";
import { Socket } from "socket.io-client";


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

interface GameList {
  gameName: string;
  players: number;
  playerNames: string[];
}

export default function Lobby() {
  const classes = useStyles();
  const [playerNameTaken, setPlayerNameTaken] = useState(false);
  const [lobby, setLobby] = useState({
    playerName: "",
    gameName: "lobby",
    gameNameInputField: "",
    open: true,
    message: "",
  });
  const [games, setGames] = useState<GameList[]>([]);

  const chatMessages = useChatMessages( lobby.gameName);
  const currentPlayers = useCurrentPlayers( lobby.gameName);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const changeRoom = (player: any) => {
    console.log("Should be trying to join game room");
    socket.emit("joinGame", player, lobby.playerName);
    setLobby((prevState) => ({
      ...prevState,
      gameName: player,
      gameNameInputField: "",
    }));
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    socket.on("newPlayer", (msg: any) => {
      console.log("The new player message is: ", msg);
      if (msg === false) setPlayerNameTaken(true);
      msg === true
        ? console.log("Joined the lobby")
        : console.log("Player name already exists");
      msg === true
        ? setLobby((state) => ({
            ...state,
            open: false,
          }))
        : setLobby((state) => ({
            ...state,
            open: true,
          }));
      return;
    });

    socket.on("playerName", (msg: any) => {
      setLobby({...lobby, playerName: msg, open: false})
    })

    socket.on("playerJoinedLobby", (msg: any) => {
      console.log(msg + " has joined the lobby");
    });

    socket.on("currentGames", (msg: any) => {
      //console.log("The current games are: ", msg);
      setGames(msg);
    });

    return () => {
      //socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      {dialogBlock(
        socket,
        lobby,
        playerNameTaken,
        setLobby,
        setPlayerNameTaken
      )}
      <Box m={2}>
        <Container maxWidth="md">
          <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
              <Box paddingLeft={2}>
                <Typography variant="h5">In: {lobby.gameName}</Typography>
              </Box>
              <List>
                <ListItem button key="JJ">
                  <ListItemIcon>
                    <Avatar
                      alt="JJ"
                      src="https://material-ui.com/static/images/avatar/1.jpg"
                    />
                  </ListItemIcon>
                  <ListItemText>{lobby.playerName}</ListItemText>
                </ListItem>
              </List>
              <Divider />

              {lobby.gameName === "lobby" ? (
                <Grid item xs={12} style={{ padding: "10px" }}>
                  <Grid container>
                    <Grid item xs={10}>
                      <TextField
                        id="outlined-basic-email"
                        label="Create Game"
                        variant="outlined"
                        fullWidth
                        type="input"
                        value={lobby.gameNameInputField}
                        onChange={(e) => {
                          setLobby((state) => ({
                            ...state,
                            gameNameInputField: e.target.value,
                          }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            
                            socket.emit(
                              "joinGame",
                              lobby.gameNameInputField,
                              lobby.playerName
                            );
                            //setPrevMessages([])

                            setLobby((prevState) => ({
                              ...prevState,
                              gameName: prevState.gameNameInputField,
                              gameNameInputField: "",
                            }));
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();

                          console.log("Should be trying to create game room");
                          
                          socket.emit(
                            "joinGame",
                            lobby.gameNameInputField,
                            lobby.playerName
                          );
                          //setPrevMessages([])

                          setLobby((prevState) => ({
                            ...prevState,
                            gameName: prevState.gameNameInputField,
                            gameNameInputField: "",
                          }));
                        }}
                      >
                        <AddBox
                          fontSize="large"
                          style={{ color: "blue", marginRight: "20px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={12} style={{ padding: "10px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();

                      console.log("Should be trying to go back to lobby");
                      
                      socket.emit("joinGame", "lobby", lobby.playerName);

                      setLobby((prevState) => ({
                        ...prevState,
                        gameName: "lobby",
                        gameNameInputField: "",
                      }));
                    }}
                  >
                    Return to Lobby
                  </Button>
                  <Box mt={1}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault();

                      console.log("Should be trying to start game");
                      socket.emit("startGame", lobby.gameName);

                      //beginGame();
                    }}
                  >
                    Start Game
                  </Button>
                  </Box>
                </Grid>
              )}

              <Divider />
              <List>
                {" "}
                <ListItem>
                  <ListItemText>Lobby</ListItemText>

                  <ListItemText
                    secondary={`${
                      games.find((game) => game.gameName === "lobby")?.players
                    } Players`}
                    style={{ textAlign: "right" }}
                  ></ListItemText>
                </ListItem>
                <Divider />
                {lobby.gameName === "lobby" ? (
                  <ListItem>
                    <ListItemText>Games</ListItemText>
                  </ListItem>
                ) : (
                  <ListItem>
                    <ListItemText>Players</ListItemText>
                  </ListItem>
                )}
                {lobby.gameName === "lobby"
                  ? games.map((game) =>
                      game.gameName === "lobby" || game.players < 1
                        ? null
                        : avatarBlock(game.gameName, changeRoom, game.players)
                    )
                  : currentPlayers.map((player) =>
                      avatarBlock(player, changeRoom)
                    )}
              </List>
                  
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
                  value={lobby.message}
                  onChange={(e) =>
                    setLobby((state) => ({
                      ...state,
                      message: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      socket.emit(
                        "chatMessage",
                        lobby.gameName,
                        lobby.playerName,
                        lobby.message
                      );

                      setLobby((state) => ({
                        ...state,
                        message: "",
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
                      lobby.gameName,
                      lobby.playerName,
                      lobby.message
                    );

                    setLobby((state) => ({
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
          </Grid>
        </Container>
      </Box>
    </div>
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

function avatarBlock(player: any, changeRoom: any, players?: any) {
  return (
    <ListItem button key={player}>
      <ListItemIcon>
        <Avatar
          alt="JJ"
          src={`https://material-ui.com/static/images/avatar/${Math.floor(Math.random() * 6) + 1}.jpg`}
        />
      </ListItemIcon>
      {players ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => changeRoom(player)}
        >
          <ListItemText>{player}</ListItemText>
        </Button>
      ) : (
        <ListItemText>{player}</ListItemText>
      )}
      <ListItemText
        secondary={players ? `${players} Players` : "red"}
        style={{ textAlign: "right" }}
      ></ListItemText>
    </ListItem>
  );
}

function dialogBlock(
  socket: Socket,
  lobby: { open: boolean; playerName: unknown },
  playerNameTaken: boolean,
  setLobby: (arg0: (state: any) => any) => void,
  setPlayerNameTaken: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (
    <Dialog open={lobby.open} aria-labelledby="enter-username">
      <DialogTitle id="form-dialog-title">Player name</DialogTitle>
      <DialogContent>
        <DialogContentText>Please choose a player name.</DialogContentText>
        <TextField
          onChange={(e) => {
            setLobby((state) => ({
              ...state,
              playerName: e.target.value,
            }));
            setPlayerNameTaken(false);
          }}
          error={playerNameTaken}
          helperText={playerNameTaken ? "Player Name Already Taken" : ""}
          autoFocus
          margin="dense"
          id="name"
          value={lobby.playerName}
          label="Player Name"
          type="string"
          fullWidth
          onKeyDown={(e) => {
            if (!playerNameTaken && e.key === "Enter") {
              socket.emit("newPlayer", lobby.playerName);
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (!playerNameTaken) {
            socket.emit("newPlayer", lobby.playerName);
            }
            return;
          }}
          color="primary"
        >
          Enter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

