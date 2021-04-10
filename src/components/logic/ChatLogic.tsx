import React, { useEffect, useState } from "react";
import { socket } from "../../service/socket";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import useChatMessages from "../../hooks/useChatMessages";
import useCurrentPlayers from "../../hooks/useCurrentPlayers";
import { Socket } from "socket.io-client";
import ChatBox from "../display/ChatBox";
import ChatSideBar from "../display/ChatSideBar";

interface GameList {
  gameName: string;
  players: number;
  playerNames: string[];
}

export default function Lobby() {
  const [playerNameTaken, setPlayerNameTaken] = useState(false);
  const [chatState, setChatState] = useState({
    playerName: "",
    gameName: "lobby",
    open: true,
  });
  const [games, setGames] = useState<GameList[]>([]);

  const chatMessages = useChatMessages(chatState.gameName);
  const currentPlayers = useCurrentPlayers(chatState.gameName);
  const lobbyPlayers = useCurrentPlayers("lobby");

  useEffect(() => {
    socket.on("newPlayer", (msg: any) => {
      console.log("The new player message is: ", msg);
      if (msg === false) setPlayerNameTaken(true);
      msg === true
        ? console.log("Joined the lobby")
        : console.log("Player name already exists");
      msg === true
        ? setChatState((state) => ({
            ...state,
            open: false,
          }))
        : setChatState((state) => ({
            ...state,
            open: true,
          }));
      return;
    });

    socket.on("playerName", (msg: any) => {
      setChatState({ ...chatState, playerName: msg, open: false });
    });

    socket.on("gameJoined", (newGameName: string, playerName: string) => {
      setChatState({...chatState, gameName: newGameName, playerName: playerName, open: false})
    })

   

    socket.on("currentGames", (msg: any) => {
      //console.log("The current games are: ", msg);
      setGames(msg);
    });

    return () => {
      //socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[socket]);

  return (
    <>
      <div>
        {dialogBlock(
          socket,
          chatState,
          playerNameTaken,
          setChatState,
          setPlayerNameTaken
        )}
      </div>

      <ChatBox
        gameName={chatState.gameName}
        playerName={chatState.playerName}
        chatMessages={chatMessages}
      >
        <ChatSideBar
          lobby={chatState.gameName === "lobby" ? true : false}
          gameName={chatState.gameName}
          playerName={chatState.playerName}
          lobbyPlayers={lobbyPlayers.length}
          players={currentPlayers}
          games={games}
        ></ChatSideBar>
      </ChatBox>
    </>
  );
}

function dialogBlock(
  socket: Socket,
  chatState: { open: boolean; playerName: unknown },
  playerNameTaken: boolean,
  setChatState: (arg0: (state: any) => any) => void,
  setPlayerNameTaken: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (
    <Dialog open={chatState.open} aria-labelledby="enter-username">
      <DialogTitle id="form-dialog-title">Player name</DialogTitle>
      <DialogContent>
        <DialogContentText>Please choose a player name.</DialogContentText>
        <TextField
          onChange={(e) => {
            setChatState((state) => ({
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
          value={chatState.playerName}
          label="Player Name"
          type="string"
          fullWidth
          onKeyDown={(e) => {
            if (!playerNameTaken && e.key === "Enter") {
              socket.emit("newPlayer", chatState.playerName);
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (!playerNameTaken) {
              socket.emit("newPlayer", chatState.playerName);
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
