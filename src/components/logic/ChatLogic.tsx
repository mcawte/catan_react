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
  Avatar,
} from "@material-ui/core";
import useChatMessages from "../../hooks/useChatMessages";
import useCurrentPlayers from "../../hooks/useCurrentPlayers";
import { Socket } from "socket.io-client";
import ChatBox from "../display/ChatBox";
import ChatSideBar from "../display/ChatSideBar";

interface GameList {
  gameName: string;
  numberOfPlayers: number;
  players: {
      name: string;
      avatar: number;
  }[];
}

export default function ChatLogic() {
  const [playerNameTaken, setPlayerNameTaken] = useState(false);
  const [chatState, setChatState] = useState({
    playerName: "",
    avatar: 0,
    gameName: "lobby",
    open: true,
  });
  const [games, setGames] = useState<GameList[]>([]);

  const chatMessages = useChatMessages(chatState.gameName);
  const currentPlayers = useCurrentPlayers(chatState.gameName);
  const lobbyPlayers = useCurrentPlayers("lobby");

  useEffect(() => {
    socket.on("newPlayer", (playerNameIsTaken: boolean) => {
      console.log("The player name is already taken?: ", playerNameIsTaken);
      if (playerNameIsTaken === false) setPlayerNameTaken(true);
      playerNameIsTaken === true
        ? console.log("Joined the lobby")
        : console.log("Player name already exists");
      playerNameIsTaken === true
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

    // socket.on("playerName", (msg: any) => {
    //   setChatState({ ...chatState, playerName: msg, open: false });
    // });

    socket.on("gameJoined", (newGameName: string, player: {name: string, avatar: number}) => {
      setChatState({
        ...chatState,
        gameName: newGameName,
        playerName: player.name,
        avatar: player.avatar,
        open: false,
      });
    });

    socket.on("currentGames", (msg: GameList[]) => {
      //console.log("The current games are: ", msg);
      setGames(msg);
    });

    return () => {
      //socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
      chatState={chatState}
      setChatState={setChatState}
        gameName={chatState.gameName}
        player={{name: chatState.playerName, avatar: chatState.avatar}}
        chatMessages={chatMessages}
      >
        <ChatSideBar
          lobby={chatState.gameName === "lobby" ? true : false}
          gameName={chatState.gameName}
          player={{name: chatState.playerName, avatar: chatState.avatar}}
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
  chatState: {
  playerName: string;
  avatar: number;
  gameName: string;
  open: boolean;
},
  playerNameTaken: boolean,
  setChatState: React.Dispatch<React.SetStateAction<{
    playerName: string;
    avatar: number;
    gameName: string;
    open: boolean;
}>>,
  setPlayerNameTaken: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (
    <Dialog open={chatState.open} aria-labelledby="enter-username">
      <DialogTitle id="form-dialog-title">Player name
      <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    // onClick={}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                  </DialogTitle>
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
          label="Type player name here"
          type="string"
          fullWidth
          onKeyDown={(e) => {
            if (!playerNameTaken && e.key === "Enter") {
              socket.emit("newPlayer", {name: chatState.playerName, avatar: chatState.avatar});
            }
          }}
        />
        <br/>
        <br/>
        <DialogContentText>Select your avatar</DialogContentText>
        <div className="flex flex-wrap">
          {Array.from(Array(54).keys()).map((index) => (
            <div className="m-2" key={index} onClick={() => setChatState((state) => ({...state, avatar: index}))}>
              <Avatar alt={`a${index}`} src={`avatars/a${index}.svg`}/>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (!playerNameTaken) {
              socket.emit("newPlayer", {name: chatState.playerName, avatar: chatState.avatar});
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
