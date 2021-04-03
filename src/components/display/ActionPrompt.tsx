import { PlayerColor } from "../../../shared_types/types";


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
