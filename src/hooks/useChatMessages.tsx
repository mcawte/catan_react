import { useEffect, useState } from "react";
import { ChatMessage } from "../../shared_types/types";
import { socket } from "../service/socket";

export default function useChatMessages(
  gameName: string
): { playerName: string; message: string; time: number }[] {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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
    });

    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[socket]);

  return chatMessages.filter((room) => room.gameName === gameName);
}
