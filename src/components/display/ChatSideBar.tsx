import React, { useState } from "react";
import { socket } from "../../service/socket";
import {
  Grid,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Box,
} from "@material-ui/core";
import {  AddBox } from "@material-ui/icons";


interface GameList {
  gameName: string;
  numberOfPlayers: number;
  players: {
      name: string;
      avatar: number;
  }[];
}

interface ChatSideBarInterface {
  lobby: boolean;
  gameName: string;
  player: {name: string, avatar: number};
  lobbyPlayers?: number;
  games?: GameList[];
  players?: {name: string, avatar: number}[]
}

interface Player {
  name: string;
  avatar: number
}

export default function ChatSideBar({
  lobby,
  gameName,
  player,
  lobbyPlayers,
  games,
  players,
}: ChatSideBarInterface) {
  

  const [localChatBarState, setLocalChatBarState] = useState({
    gameNameInputField: "",
  });

  const changeGame = (gameName: string, player: {name: string, avatar: number}) => {
    console.log("Should be trying to join game room");
    socket.emit("joinGame", gameName, player);
    setLocalChatBarState((prevState) => ({
      ...prevState,
      gameNameInputField: "",
    }));
  };

  return (
    <>
    
      {lobby ? (
        <Grid item xs={12} style={{ padding: "10px" }}>
          <Grid container>
            <Grid item xs={10}>
              <TextField
                id="outlined-basic-email"
                label="Create Game"
                variant="outlined"
                fullWidth
                type="input"
                value={localChatBarState.gameNameInputField}
                onChange={(e) => {
                  setLocalChatBarState((state) => ({
                    ...state,
                    gameNameInputField: e.target.value,
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    socket.emit(
                      "joinGame",
                      localChatBarState.gameNameInputField,
                      player
                    );
                    setLocalChatBarState((prevState) => ({
                      ...prevState,
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
                    localChatBarState.gameNameInputField,
                    player
                  );
                  //setPrevMessages([])

                  setLocalChatBarState((prevState) => ({
                    ...prevState,
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

              (player.name !== "") ? socket.emit("joinGame", "lobby", player) : (<div></div>);

              setLocalChatBarState((prevState) => ({
                ...prevState,
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
                socket.emit("startGame", gameName);
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
            secondary={`${lobbyPlayers} Players`}
            style={{ textAlign: "right" }}
          ></ListItemText>
        </ListItem>
        <Divider />
        {lobby ? (
          <ListItem>
            <ListItemText>Games</ListItemText>
          </ListItem>
        ) : (
          <ListItem>
            <ListItemText>Players</ListItemText>
          </ListItem>
          
        )}
        
        {lobby
          ? games!.map((game: GameList) =>
              game.gameName === "lobby" || game.players.length < 1
                ? null
                : avatarBlock(game.gameName, game.players[0].avatar, player, changeGame, game.numberOfPlayers)
            )
          : players!.map((eachPlayer) => avatarBlock(eachPlayer.name, eachPlayer.avatar))}
          
      </List>
      
    </>
  );
}

function avatarBlock(avatarName: string, avatarNumber: number, currentPlayer?: Player, changeRoom?: any , numberOfPlayers?: any) {
  return (
    <ListItem button key={avatarName + avatarNumber}>
      <ListItemIcon>
        <Avatar
          alt="JJ"
          //src={`https://material-ui.com/static/images/avatar/${Math.floor(Math.random() * 6) + 1}.jpg`}
          src={`avatars/a${avatarNumber}.svg`}
        />
      </ListItemIcon>
      {numberOfPlayers ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => changeRoom(avatarName, currentPlayer)}
        >
          <ListItemText>{avatarName}</ListItemText>
        </Button>
      ) : (
        <ListItemText>{avatarName}</ListItemText>
      )}
      <ListItemText
        secondary={numberOfPlayers ? `${numberOfPlayers} Players` : "red"}
        style={{ textAlign: "right" }}
      ></ListItemText>
    </ListItem>
  );
}
