import { useEffect, useState } from "react";
import { socket } from "../service/socket"


interface Players {
  gameName: string;
  players: string[];
}

// This hook is called too often
export default function useChatMessages(
  gameName: string
): string[] {
  
  const [players, setPlayers] = useState<Players[]>();

  useEffect(() => {
    socket.on("currentGames", (msg: any) => {
      console.log("The current games are: ", msg);
      let playerList = msg.map((game: any) => ({
        gameName: game.gameName,
        players: game.playerNames,
      }));
      setPlayers(playerList);
    });

    return () => {
     // socket.disconnect();
    };
  });

  

  if (players && players.some((game) => game.gameName === gameName)) {
    let gamePlayers = players.find((game) => game.gameName === gameName)
      ?.players;
    //console.log("The current players are: ", gamePlayers);
    gamePlayers = gamePlayers !== undefined ? gamePlayers : [];
    return gamePlayers;
  } else {
    return [];
  }
}
