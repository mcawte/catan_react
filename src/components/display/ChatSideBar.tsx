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
  players: number;
  playerNames: string[];
}

interface ChatSideBarInterface {
  lobby: boolean;
  gameName: string;
  playerName: string;
  lobbyPlayers?: number;
  games?: GameList[];
  players?: string[]
}

export default function ChatSideBar({
  lobby,
  gameName,
  playerName,
  lobbyPlayers,
  games,
  players,
}: ChatSideBarInterface) {
  

  const [localChatBarState, setLocalChatBarState] = useState({
    gameNameInputField: "",
  });

  const changeGame = (gameName: string, playerName: string) => {
    console.log("Should be trying to join game room");
    socket.emit("joinGame", gameName, playerName);
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
                      playerName
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
                    playerName
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

              (playerName !== "") ? socket.emit("joinGame", "lobby", playerName) : (<div></div>);

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
          ? games!.map((game) =>
              game.gameName === "lobby" || game.players < 1
                ? null
                : avatarBlock(game.gameName, changeGame, playerName, game.players)
            )
          : players!.map((player) => avatarBlock(player, changeGame, playerName))}
      </List>
    </>
  );
}

function avatarBlock(player: any, changeRoom: any, playerName: string, players?: any) {
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
      {players ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => changeRoom(player, playerName)}
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
