import styled from "styled-components";
// import {
//   GiCargoShip,
//   //GiSheep,
//  // GiWheat,
//  // GiBrickPile,
//   //GiStoneBlock,
//   //GiWoodPile,
// } from "react-icons/gi";
import { PlayerColor, TradeType } from "../../../shared_types/types";

interface ShipProps {
  ship: {
    type: TradeType;
    tradeSettlement1: {
      row: number;
      column: number;
      direction: string;
      playerName: string | null;
      playerColor: PlayerColor | null;
      rotation: number;
    };
    tradeSettlement2: {
      row: number;
      column: number;
      direction: string;
      playerName: string | null;
      playerColor: PlayerColor | null;
      rotation: number;
    };
  };
  tileWidth: number;
  width: number;
  height: number;
}

const StyledShip = styled.h1<ShipProps>`
  position: absolute;
  color: white;
  top: ${(props) => (props.tileWidth / 4) * Math.sqrt(3)}px;
  left: ${(props) => props.tileWidth / 2}px;
  z-index: 6;
  font-size: ${(props) => props.tileWidth / 4.3}px;
  -webkit-transform: translate(-50%, -0%);
  transform: translate(-50%, -0%);
`;

export const Ship = (props: any) => {
  const emojis: {
    [key: string]: string;
    wheat: string;
    sheep: string;
    forest: string;
    stone: string;
    brick: string;
  } = { brick: "🧱", forest: "🌲", stone: "⛰️", wheat: "🌾", sheep: "🐏" };

  return (
    <>
      <StyledShip
        width={props.width}
        height={props.height}
        tileWidth={props.tileWidth}
        ship={props.ship}
      >
        {/* <GiCargoShip /> */}
        <span style={{ fontSize: `${props.tileWidth / 3.5}px`, zIndex: 50 }}>
          🚢
        </span>
        {Object.keys(emojis).includes(props.ship.type) ? (
          <span style={{ fontSize: `${props.tileWidth / 4.5}px`, zIndex: 50 }}>
            {emojis[props.ship.type]}
          </span>
        ) : null}
        
      </StyledShip>
      <StyledShipRoute
        rotation={props.ship.tradeSettlement1.rotation}
        playerColor={null}
        tileWidth={props.tileWidth}
      />
      <StyledShipRoute
        rotation={props.ship.tradeSettlement2.rotation}
        playerColor={null}
        tileWidth={props.tileWidth}
      />
    </>
  );
};

interface ShipRouteProps {
  rotation: string;
  playerColor: PlayerColor | null;
  tileWidth: number;
}

const StyledShipRoute = styled.h1<ShipRouteProps>`
  position: absolute;
  color: ${(props) =>
    props.playerColor !== null ? props.playerColor : "gray"};
  border-style: dashed;
  z-index: 20;
  /* width: ${5}px;
  height: ${50}px; */
  width: ${(props) => props.tileWidth / 10}px;
  height: ${(props) => props.tileWidth / 2.25}px;
  opacity: 60%;
  top: 50%;
  left: 50%;
  z-index: 6;
  transform-origin: 0px 0px;
  transform: ${(props) => "rotate(" + props.rotation + "deg)"};
`;
