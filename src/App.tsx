import { PublicGameState } from "../shared_types/types";
import React, { useEffect, useState } from "react";
import "./App.css";
import BoardLogic from "./components/logic/BoardLogic";
import { socket } from "./service/socket";
import ChatLogic from "./components/logic/ChatLogic";

function App() {
  const [startGame, setStartGame] = useState(false);
  const [gameState, setGameState] = useState<PublicGameState>();
  //const [tiles, setTiles] = useState<TileInterface[]>([]);

  useEffect(() => {
    socket.on("beginGame", () => setStartGame(true));

    socket.on("gameState", (msg: PublicGameState) => {
      console.log("The new game state is: ", msg);
      setGameState(msg);
    });

    return () => {};
  }, []);

  //socket.current.emit("tokenSt", token)

  return (
    <>
      {startGame && gameState !== undefined && setGameState !== undefined ? (
        <BoardLogic
          gameState={gameState}
          setGameState={
            setGameState as React.Dispatch<
              React.SetStateAction<PublicGameState>
            >
          }
        />
      ) : (
        <ChatLogic />
      )}
    </>
  );
}

export default App;
