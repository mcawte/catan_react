import React from "react";
import { DiceFace } from "./DiceFaces";

interface DiceProps {
  dice1: number;
  dice2: number;
}

export default function Dice(props: React.PropsWithChildren<DiceProps>) {


  return (
    <div
      style={{
        marginLeft: "60vw",
        marginTop: "10vh",
      }}
    >
      

      <div>The current roll is {props.dice1 + props.dice2}.</div>

      <DiceFace faceNumber={props.dice1} />
      <DiceFace faceNumber={props.dice2} />
    </div>
  );
}
