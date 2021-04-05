import styled from "styled-components";
import {
  GiCargoShip,
  GiSheep,
  GiWheat,
  GiBrickPile,
  GiStoneBlock,
  GiWoodPile,
} from "react-icons/gi";
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
  color: rgb(0, 0, 0);
  top: ${(props) => (props.tileWidth / 4) * Math.sqrt(3)}px;
  left: ${(props) => props.tileWidth / 2}px;
  z-index: 6;
  font-size: ${(props) => props.tileWidth / 6}px;
  -webkit-transform: translate(-50%, -0%);
  transform: translate(-50%, -0%);
`;

export const Ship = (props: any) => {
  return (
    <>
      <StyledShip width={props.width}
        height={props.height} tileWidth={props.tileWidth} ship={props.ship}>
        <GiCargoShip />
        {props.ship.type === "sheep" ? <GiSheep /> : null}
        {props.ship.type === "wheat" ? <GiWheat /> : null}
        {props.ship.type === "brick" ? <GiBrickPile /> : null}
        {props.ship.type === "stone" ? <GiStoneBlock /> : null}
        {props.ship.type === "forest" ? <GiWoodPile /> : null}
      </StyledShip>
      <StyledShipRoute
        width={props.width}
        height={props.height}
        rotation={props.ship.tradeSettlement1.rotation}
        playerColor={null}
        tileWidth={props.tileWidth}
      />
      <StyledShipRoute
        width={props.width}
        height={props.height}
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
  width: number;
  height: number;
}

const StyledShipRoute = styled.h1<ShipRouteProps>`
  position: absolute;
  color: ${(props) =>
    props.playerColor !== null ? props.playerColor : "black"};
  border-style: dashed;
  /* width: ${5}px;
  height: ${50}px; */
  width: ${(props) => props.width*6/7}px;
  height: ${(props) => props.height*6/7}px;
  opacity: 75%;
  top: 50%;
  left: 50%;
  z-index: 6;
  transform-origin: 0px 0px;
  transform: ${(props) => "rotate(" + props.rotation + "deg)"};
`;
