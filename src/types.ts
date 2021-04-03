import { Socket } from "socket.io-client";

export interface RoadInterface {
    direction: string;
    player: string;
  }
  
  export interface SettlementInterface {
    type: string;
    direction: string;
    player: string;
  }
  
  export interface ShipInterface {
    type: string;
    angle1: number;
    angle2: number;
  }
  
  export interface SocketInterface {
    socket: Socket;
  }
  
  export interface GameStateInterface {
      gameName: string
      tiles: TileInterface[];
      playerTurn: {
        stage: number;
        player: {
          color: string;
          name: string;
          inventory: {
            cities: number;
            towns: number;
            roads: number;
            resources: {
              wheat: number;
              forest: number;
              brick: number;
              sheep: number;
              stone: number;
            }
          }
        }
      };
      longestRoad: {
        player: string;
      roadLength: number;
      };
      diceRoll: number;
  }
  
  export interface TileInterface {
      tileNumber: number | null;
      tileType: string;
      row: number;
      column: number;
      roads: RoadInterface[];
          settlements: SettlementInterface[];
          ship: ShipInterface;
  }
  

  export type devCards = "progress" | "knight" | "victory"

export interface RequestItems {
  roads: {
    row: number,
    column: number,
    direction: number,
  }[],
  towns: {
    row: number,
    column: number,
    direction: number,
  }[],
  cities: {
    row: number,
    column: number,
    direction: number,
  }[],
  devCards: devCards[]
}