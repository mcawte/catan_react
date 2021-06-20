import { useEffect, useState } from "react";
import { socket } from "../service/socket"


interface Players {
  gameName: string;
  players: {name: string, avatar: number}[];
}

interface CurrentGames {
  gameName: string;
  numberOfPlayers: number;
  players: {
      name: string;
      avatar: number;
  }[];
}

// This hook is called too often
export default function useCurrentPlayers(
  gameName: string
):  {
  name: string;
  avatar: number;
}[] {
  
  const [players, setPlayers] = useState<Players[]>();

  useEffect(() => {
    socket.on("currentGames", (currentGames: CurrentGames[]) => {
      console.log("The current games are: ", currentGames);
      let playerList = currentGames.map((eachGame) => ({
        gameName: eachGame.gameName,
        players: eachGame.players,
      }));
      console.log("The players list is: ", playerList)
      setPlayers(playerList);
    });

    return () => {
     // socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[socket]);

  

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
