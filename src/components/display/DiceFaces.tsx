import React from "react";

interface DiceFaceProps {
  faceNumber: number;
}

export function DiceFace(props: React.PropsWithChildren<DiceFaceProps>) {
  switch (props.faceNumber) {
    case 0:
      return (
        <div className="dice zero-face">
          
        </div>
      );
      //break;
    case 1:
      return (
        <div className="dice first-face">
          <span className="dot"></span>
        </div>
      );
      //break;
    case 2:
      return (
        <div className="dice second-face">
          <span className="dot"> </span>
          <span className="dot"> </span>
        </div>
      );
      //break;
    case 3:
      return (
        <div className="dice third-face">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      );
     // break;
    case 4:
      return (
        <div className="fourth-face dice">
          <div className="column">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="column">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      );
     // break;
    case 5:
      return (
        <div className="fifth-face dice">
          <div className="column">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>

          <div className="column">
            <span className="dot"></span>
          </div>

          <div className="column">
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      );
     // break;

    case 6:
      return (
        <div className="sixth-face dice">
          <div className="column">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="column">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      );
      //break;
    default:
      return <div> no dice</div>;
  }
}
