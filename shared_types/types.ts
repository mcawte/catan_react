import { Socket } from "socket.io";

export type ItemTypes = "road" | "town" | "city" | "devCard";
export type PluralItemTypes = "roads" | "towns" | "cities" | "devCards";
export type PlayerColor = "red" | "blue" | "green" | "white";
export type ResourceType = "brick" | "forest" | "sheep" | "stone" | "wheat"
export type TileType = "desert" | "ocean" | ResourceType
export type TradeType = "4to1" | "3to1" | "2to1" | ResourceType
export type DevCardTypes =
  | "knight"
  | "road"
  | "yearOfPlenty"
  | "monopoly"
  | "victory";

//export type ValidTiles = {row: 0, column: 2} | {row: 0, column: 4}

export type ItemCost = {
  [key in ItemTypes]: Resources;
};

export type ItemPlural = {
  [key in ItemTypes]: PluralItemTypes;
};

export const pluralItemTypes: ItemPlural = {
  road: "roads",
  town: "towns",
  city: "cities",
  devCard: "devCards",
};

export type ServerSocket = Socket & {
  playerName: string;
  handshake: {
    auth: {
      playerName: string;
    };
  };
};

export interface ChatMessage {
  playerName: string;
  gameName: string;
  message: string;
  time: number;
}

export interface Robber {
  tileNumber: number;
  row: number;
  column: number;
  rolledOnRound: number;
  robberDebt: RobberDebt[];
  playersToStealFrom: string[];
}

export interface Road {
  player: string;
  length: number;
}

export interface RoadPiece {
  direction: string;
  playerName: string | null;
  playerColor: PlayerColor | null;
  roundPlaced: number;
}

export interface Settlement {
  type: string | null;
  direction: string;
  playerName: string | null;
  playerColor: PlayerColor | null;
  roundTownPlaced: number;
  roundCityPlaced: number;
}

export interface Ship {
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
}

export interface Tile {
  tileNumber: number | null;
  tileType: string;
  row: number;
  column: number;
  roads: RoadPiece[];
  settlements: Settlement[];
  ship?: Ship;
}

export interface Players {
  [key: number]: Player;
}

export interface Player {
  color: PlayerColor;
  name: string;
  inventory: Inventory;
  points: number;
  shipRoutes: TradeType[]
}

export interface DiceRoll {
  dice1: number;
  dice2: number;
}

export interface RobberDebt {
  playerName: string;
  cardsRequired: number;
  complete: boolean;
}

export interface PublicGameState {
  actionMessage: {
    message: string;
    color: PlayerColor;
  };
  gameName: string;
  tiles: Tile[];
  playerTurn: {
    stage: number;
    player: {
      color: PlayerColor;
      name: string;
    };
  };
  player: Player;
  longestRoad: {
    playerName: string;
    length: number;
  };
  largestArmy: {
    playerName: string;
    size: number;
  };
  diceRoll: DiceRoll;
  currentTrade: Trade;
  round: number;
  robber: Robber;
}

export interface Resources {
  [key: string]: number;
  wheat: number;
  sheep: number;
  forest: number;
  stone: number;
  brick: number;
}

export interface DevCards {
  [key: string]: {
    roundReceived: number;
    roundPlayed: number;
  }[];
  knight: {
    roundReceived: number;
    roundPlayed: number;
  }[];
  road: {
    roundReceived: number;
    roundPlayed: number;
  }[];
  yearOfPlenty: {
    roundReceived: number;
    roundPlayed: number;
  }[];
  monopoly: {
    roundReceived: number;
    roundPlayed: number;
  }[];
  victory: {
    roundReceived: number;
    roundPlayed: number;
  }[];
}

export interface Inventory {
  resources: Resources;
  roads: number;
  towns: number;
  cities: number;
  devCards: DevCards;
}

export interface Trade {
  active: boolean;
  offers: Resources;
  inReturnFor: Resources;
}
