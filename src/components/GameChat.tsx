import React, { useEffect, useRef, useState } from "react";
import { socket } from "../service/socket";
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
  Button,
  Box,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import useChatMessages from "../hooks/useChatMessages";
import useCurrentPlayers from "../hooks/useCurrentPlayers";
import { PublicGameState} from "../../shared_types/types";

const useStyles = makeStyles({
  table: {
    minHeight: "500px",
  },
  chatSection: {
    width: "100%",
    height: "80vh",
    minHeight: "500px",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "5vh",
    minHeight: "300px",
    overflowY: "auto",
  },
});

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
  const classes = useStyles();

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
    <div>
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
              <Grid container alignItems="flex-end">
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
          </Grid>
        </Container>
      </Box>
    </div>
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

function avatarBlock(player: any, players?: any) {
  return (
    <ListItem button key={player}>
      <ListItemIcon>
        <Avatar
          alt="JJ"
          src={`https://material-ui.com/static/images/avatar/${
            Math.floor(Math.random() * 6) + 1
          }.jpg`}
        />
      </ListItemIcon>

      <ListItemText>{player}</ListItemText>

      <ListItemText
        secondary={players ? `${players} Players` : "red"}
        style={{ textAlign: "right" }}
      ></ListItemText>
    </ListItem>
  );
}
