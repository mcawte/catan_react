import React from "react";
import { Road } from "../display/Road";
import { Ship } from "../display/Ship";
import Tile from "../display/Tile";
//import { useResize } from "../../hooks/useResize";

import { Settlement } from "../display/Settlement";
import {
  PlayerColor,
  Tile as TileInterface,
  Settlement as SettlementInterface,
  RoadPiece,
  Robber,
} from "../../../shared_types/types";
import { socket } from "../../service/socket";

const boardWidth = 7;

interface NewBoardProps {
  gameName: string;
  playerName: string;
  tiles: TileInterface[];
  robber: Robber;
  moveRobber: boolean;
  playerColor: PlayerColor;
  updateRoad: (
    tile: {
      row: number;
      column: number;
    },
    road: RoadPiece
  ) => void;
  updateSettlement: (
    tile: {
      row: number;
      column: number;
    },
    settlement: SettlementInterface
  ) => void;
  updateRobber: (tile: {
    row: number;
    column: number;
    tileNumber: number | null;
  }) => void;
}

export default function Tiles({
  gameName,
  playerName,
  tiles,
  robber,
  moveRobber,
  playerColor,
  updateRoad,
  updateSettlement,
  updateRobber,
}: React.PropsWithChildren<NewBoardProps>) {
  //const { width } = useResize();
  const width = 800;
  const tileSize = (0.5 * width) / boardWidth;

  //const itemTypes: ItemTypes[] = ["road", "town", "city", "devCard"];

  // tile should be part of game state
  //setTiles(tiles)

  const gridSpace = 1.04;
  const tileWidth = tileSize;
  const tileHeight = (tileSize * 2) / Math.sqrt(3);
  const edgeLength = tileWidth / Math.sqrt(3);
  const roadWidth = (((gridSpace - 1) * 7) / 4) * tileWidth;
  const roadLeft = (1 - gridSpace) * tileWidth;
  const roadTop = (1 / 4) * tileHeight;

  return (
    <div
      style={{
        position: "absolute",
        top: `${tileSize / 10}px`,
        left: `${tileSize / 10}px`,
      }}
    >
      {/* The width is {width} and height {height} */}
      {tiles.map((tile) => {
        return (
          <div key={`Tile_r${tile.row}c${tile.column}`}>
            <Tile
              tileSize={tileSize} // in px
              tileNumber={tile.tileNumber}
              tileType={tile.tileType}
              row={tile.row}
              column={tile.column}
              gridSpace={1.04}
              updateRobber={updateRobber}
              moveRobber={moveRobber}
              robber={
                robber.row === tile.row && robber.column === tile.column
                  ? true
                  : false
              }
            >
              {tile.roads.map((road) => {
                return (
                  <Road
                    key={`Road_r${road.direction}_t${tile.tileNumber}_tr${tile.row}_tc${tile.column}`}
                    occupied={road.playerName === null ? false : true}
                    direction={road.direction}
                    width={roadWidth}
                    height={edgeLength}
                    color={
                      road.playerColor === null ? playerColor : road.playerColor
                    }
                    left={roadLeft}
                    top={roadTop}
                    //onClick={() => updateRoad(tile, road)}
                    //onMouseEnter={() => socket.emit("updateRoad",gameName, playerName, tile.row, tile.column, road.direction)}
                    onClick={() => socket.emit("updateRoad",gameName, playerName, tile.row, tile.column, road.direction)}
                  />
                );
              })}

              {tile.settlements.map((settlement) => {
                return (
                  <div
                    key={`Settlement_r${tile.row}c${tile.column}_d${settlement.direction}_p${settlement.playerName}`}
                    // onClick={() => updateSettlement(tile, settlement)}
                    onClick={() => {
                      console.log("Settlement clicked")
                      socket.emit("updateSettlement",gameName, playerName, tile.row,tile.column, settlement.direction)}}
                  >
                    <Settlement
                      type={settlement.type}
                      occupied={settlement.playerName === null ? false : true}
                      color={
                        settlement.playerColor === null
                          ? playerColor
                          : settlement.playerColor
                      }
                      direction={settlement.direction}
                      tileHeight={tileHeight}
                    />
                  </div>
                );
              })}

              {tile.ship ? (
                <Ship
                  key={`Ship_t${tile.tileNumber}`}
                  ship={tile.ship}
                  tileWidth={tileWidth}
                  width={roadWidth}
                    height={edgeLength}
                />
              ) : null}
            </Tile>
          </div>
        );
      })}
    </div>
  );
}
