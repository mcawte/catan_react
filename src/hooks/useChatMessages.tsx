import { useEffect, useState } from "react";
import { ChatMessage } from "catan_types/types";
import { socket } from "../service/socket";

// interface ChatMessage {
//   playerName: string;
//   gameName: string;
//   message: string;
//   time: number;
// }

export default function useChatMessages(
  gameName: string
): { playerName: string; message: string; time: number }[] {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // const [chatMessages, setChatMessages] = useImmer([
  //   {
  //     gameName: "lobby",
  //     messages: [
  //       { playerName: "some guy", message: "yo yo", time: Date.now() },
  //       { playerName: "Important Individual", message: "Excuse me?", time: Date.now() },
  //     ],
  //   },
  // ]);

  useEffect(() => {
    socket.on("chatMessage", (msg: ChatMessage) => {
      console.log(
        "Message from server to frontend by player " +
          msg.playerName +
          " to room " +
          msg.gameName +
          ": " +
          msg.message +
          " at time: " +
          msg.time
      );

      //console.log("the chat messages state object is: ", chatMessages);

      // if (chatMessages.some((game) => game.gameName === msg.gameName)) {
      //   console.log("The game name is included");

      //   let newState: RoomMessages[] = chatMessages.map((eachGame) => {
      //     if (eachGame.gameName === msg.gameName) {
      //       console.log("Should have found lobby to append to here");
      //       const newGameMessages = eachGame.messages.concat({
      //         playerName: msg.playerName,
      //         message: msg.message,
      //         time: msg.time,
      //       });
      //       return { gameName: msg.gameName, messages: newGameMessages };
      //     } else {
      //       console.log("No lobby in this one");
      //       return eachGame;
      //     }
      //   });

      //   console.log("The new state chat messages object is: ", newState);

      setChatMessages((prevState) => {
        return [
          ...prevState,
          {
            gameName: msg.gameName,
            playerName: msg.playerName,
            message: msg.message,
            time: msg.time,
          },
        ];
      });

      // setChatMessages(prevState =>[
      //   {
      //     gameName: "lobby",
      //     messages: [{
      //       playerName: "some guy",
      //       message: "yo yo",
      //       time: Date.now(),
      //     }],
      //   },
      // ]);

      //console.log("The appended to game room state should be: ", newState);
      // console.log("up here");
      // } else {
      //   let newRoomHistory: RoomMessages = {
      //     gameName: msg.gameName,
      //     messages: [
      //       {
      //         playerName: msg.playerName,
      //         message: msg.message,
      //         time: msg.time,
      //       },
      //     ],
      //   };
      //   setChatMessages([
      //     {
      //       gameName: "test",
      //       messages: [{
      //         playerName: "some guy",
      //         message: "yo yo",
      //         time: Date.now(),
      //       }],
      //     },
      //   ]);

      // setChatMessages((prevState) => [...prevState, newRoomHistory]);
      // }

      // console.log("The current room messages are: ", chatMessages);
    });

    return () => {
      // socket.disconnect();
    };
  }, [socket]);

  // let messages = chatMessages.find(
  //   (messages) => messages.gameName === gameName
  // );

  // if (messages !== undefined) {
  //   return messages.messages;
  // } else {
  //   return [{ playerName: "", message: "", time: 0 }];
  // }

  //console.log("the chat messages state object is: ", chatMessages)

  return chatMessages.filter(room => room.gameName === gameName)
}
