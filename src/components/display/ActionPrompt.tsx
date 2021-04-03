import { PlayerColor } from "catan_types/types";
import React from "react";

interface ActionPromptInterface {
  message: string;
  messageColor: PlayerColor;
}

export default function ActionPrompt({
  message,
  messageColor,
}: ActionPromptInterface) {
  return (
    <div className="action-prompt" style={{ background: `${messageColor}` }}>
      {message}
    </div>
  );
}
