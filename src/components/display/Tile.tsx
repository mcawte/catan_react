import React from "react";
import { GiRobber } from "react-icons/gi";
import styled from "styled-components";

interface TileProps {
  tileType: string;
  tileNumber: number | null;
  tileSize: number;
  row: number;
  column: number;
  gridSpace: number;
  robber: boolean;
  moveRobber: boolean;
  updateRobber: (tile: {
    row: number;
    column: number;
    tileNumber: number | null;
  }) => void;
}

function dotRepeats(roll: number | null) {
  let dots;
  switch (roll) {
    case 2:
    case 12:
      dots = 1;
      break;
    case 3:
    case 11:
      dots = 2;
      break;
    case 4:
    case 10:
      dots = 3;
      break;
    case 5:
    case 9:
      dots = 4;
      break;
    case 6:
    case 8:
      dots = 5;
      break;
    default:
      dots = 0;
  }
  return dots;
}

export default function Tile(props: React.PropsWithChildren<TileProps>) {
  const tileWidth = props.tileSize;
  const tileHeight = (props.tileSize * 2) / Math.sqrt(3);
  const leftShift = (props.tileSize / 2) * props.column * props.gridSpace;
  const topShift =
    (props.tileSize / 2) * Math.sqrt(3) * props.row * props.gridSpace;

  const textFontSize = tileWidth / 6;

  return (
    <>
      <div //hex container
        style={{
          position: "absolute",
          top: `${topShift}px`,
          left: `${leftShift}px`,
        }}
      >
        <TileContainer
          tileWidth={tileWidth}
          onClick={() =>
            props.updateRobber({
              row: props.row,
              column: props.column,
              tileNumber: props.tileNumber,
            })
          }
        >
          <div
            className="tile"
            style={{
              width: `${tileWidth}px`,
              height: `${tileHeight}px`,
              backgroundImage: `url('/${props.tileType}.jpeg')`,
            }}
          >
            <div>
              <div
                className="tileNumber"
                style={{
                  fontSize: `${textFontSize}px`,
                  // textShadow: `-${textFontSize}px -${textFontSize}px 0 #000, ${textFontSize}px -${textFontSize}px 0 #000, -${textFontSize}px ${textFontSize}px 0 #000, ${
                  //   0.05 * textFontSize
                  // }px ${0.05 * textFontSize}px 0 #000`,
                  textShadow: `${0.1 * textFontSize}px ${0.1 * textFontSize}px #000`,
                  // WebkitTextStroke: "10px black",
                  WebkitTextFillColor: "white",
                  WebkitTextStrokeWidth: `${0.075 * textFontSize}px`,
                  WebkitTextStrokeColor: "black"
                }}
              >
                {props.robber ? (
                  <Robber tileWidth={tileWidth}>
                    {/* <GiRobber style={{fontSize: "1.5x", color: "black"}} > <GiRobber style={{position: "absolute",fontSize: "1.3x", color: "white"}} /></GiRobber> */}
                    <GiRobber style={{ fontSize: "1.5x", color: "black" }} />
                  </Robber>
                ) : (
                  <h1>{props.tileNumber}</h1>
                )}

                {/* <h1>{props.tileNumber}</h1> */}
                <div
                  className="tileDots"
                  style={{
                    color: `${
                      dotRepeats(props.tileNumber) === 5 ? "green" : "blue"
                    }`,
                    WebkitTextFillColor: `${
                      dotRepeats(props.tileNumber) === 5 ? "green" : "blue"
                    }`,
                  }}
                >
                  <h1
                    style={{
                      top: `${(-1 / 5) * tileWidth}px`,
                    }}
                  >
                    {".".repeat(dotRepeats(props.tileNumber))}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </TileContainer>
        {props.children}
      </div>
    </>
  );
}

interface RobberProps {
  tileWidth: number;
}

export const Robber = styled.h2<RobberProps>`
  font-size: ${(props) => props.tileWidth / 4}px;
  color: "purple";
  &:hover {
    opacity: 50%;
  }
`;

interface TileContainerProps {
  tileWidth: number;
}

export const TileContainer = styled.h1<TileContainerProps>`
  font-size: ${(props) => props.tileWidth / 8}px;
`;
