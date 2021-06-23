import styled, { keyframes } from "styled-components";
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
  randPush: number;
}

let directions = new Map();

let shipMove = (tileWidth: number, rot1: number, rot2: number) => keyframes`
  from, 50%, to {
    top: ${(tileWidth / 4) * Math.sqrt(3)}px;
    left: ${tileWidth / 2}px;
    -webkit-transform: translate(-50%, -0%);
    transform: translate(-50%, -0%);
  }
  25% {
    top: ${
      (directions.get(rot1).top * tileWidth) / 2 +
      (tileWidth / 4) * Math.sqrt(3)
    }px;
    left: ${(directions.get(rot1).left * tileWidth) / 2 + tileWidth / 2}px; 
    -webkit-transform: translate(-50%, -0%);
    transform: translate(-50%, -0%);
  }
  75% {
    top: ${
      (directions.get(rot2).top * tileWidth) / 2 +
      (tileWidth / 4) * Math.sqrt(3)
    }px;
    left: ${(directions.get(rot2).left * tileWidth) / 2 + tileWidth / 2}px; 
    -webkit-transform: translate(-50%, -0%);
    transform: translate(-50%, -0%);
  }
`;

const StyledShip = styled.h1<ShipProps>`
  position: absolute;
  color: black;
  top: ${(props) => (props.tileWidth / 4) * Math.sqrt(3)}px;
  left: ${(props) => props.tileWidth / 2}px;
  z-index: 6;
  font-size: ${(props) => props.tileWidth / 4.3}px;
  -webkit-transform: translate(-50%, -0%);
  transform: translate(-50%, -0%);
  animation: ${(props) =>
      shipMove(
        props.tileWidth,
        props.ship.tradeSettlement1.rotation,
        props.ship.tradeSettlement2.rotation
      )}
    25s infinite;
`;

directions.set(0, { top: 1, left: 0 }); //
directions.set(60, {
  top: Math.sin((150 * Math.PI) / 180),
  left: Math.cos((150 * Math.PI) / 180),
});
directions.set(-60, {
  top: Math.sin((30 * Math.PI) / 180),
  left: Math.cos((30 * Math.PI) / 180),
});
directions.set(120, {
  top: Math.sin((210 * Math.PI) / 180),
  left: Math.cos((210 * Math.PI) / 180),
});
directions.set(-120, {
  top: Math.sin((330 * Math.PI) / 180),
  left: Math.cos((330 * Math.PI) / 180),
});
directions.set(180, { top: -1, left: 0 });

export const Ship = (props: any) => {
  const emojis: {
    [key: string]: string;
    wheat: string;
    sheep: string;
    forest: string;
    stone: string;
    brick: string;
  } = { brick: "🧱", forest: "🌲", stone: "⛰️", wheat: "🌾", sheep: "🐏" };

  let testPush = () => (Math.random() < 0.5 ? -1 : 1);

  console.log(`The testPush is: ${testPush} + ${Math.random()}`);

  //   let dynamicStyles: any = null;

  //   function addAnimation(name: string, body: string) {
  //     if (!dynamicStyles) {
  //       dynamicStyles = document.createElement('style');
  //       dynamicStyles.type = 'text/css';
  //       document.head.appendChild(dynamicStyles);
  //     }

  //     dynamicStyles.sheet.insertRule(`@keyframes ${ name } {
  //       ${ body }
  //     }`, dynamicStyles.length);
  //   }

  //   addAnimation(`shipAnimation-${props.ship.type}-${props.ship.tradeSettlement1.row}-${props.ship.tradeSettlement1.column}`, `
  //     0% { transform: rotate(0); }
  //     20% { transform: rotate(${ props.ship.tradeSettlement1.rotation}deg); }
  //     60% { transform: rotate(${ props.ship.tradeSettlement2.rotation }deg); }
  //     90% { transform: rotate(${ -props.ship.tradeSettlement1.rotation }deg); }
  //     100% { transform: rotate(${ 0 }deg); }
  //   `);

  //   addAnimation('myAnimation1', `
  //   0% { transform: rotate(0); }
  //   20% { transform: rotate(${ 10}deg); }
  //   60% { transform: rotate(${ 20 }deg); }
  //   90% { transform: rotate(${ 30 }deg); }
  //   100% { transform: rotate(${ 0 }deg); }
  // `);

  //document.getElementById("test").style.animation = 'myAnimation 3s infinite';

  return (
    <>
      {/* <div style={{animation: `shipAnimation-${props.ship.type}-${props.ship.tradeSettlement1.row}-${props.ship.tradeSettlement1.column}`, zIndex: 51}}>   */}
      <StyledShip
        width={props.width}
        height={props.height}
        tileWidth={props.tileWidth}
        ship={props.ship}
        randPush={Math.random() < 0.5 ? -1 : 1}
      >
        {/* <GiCargoShip /> */}
        <span style={{ fontSize: `${props.tileWidth / 3.5}px`, zIndex: 50 }}>
          🚢
        </span>
        {Object.keys(emojis).includes(props.ship.type) ? (
          <span style={{ fontSize: `${props.tileWidth / 5}px`, zIndex: 50 }}>
            {emojis[props.ship.type]}
          </span>
        ) : null}
      </StyledShip>
      {/* </div> */}
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
      {/* </div> */}
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
    props.playerColor !== null ? props.playerColor : "white"};
  border-style: dashed;
  z-index: 190;
  /* width: ${5}px;
  height: ${50}px; */
  width: ${(props) => props.tileWidth / 10}px;
  height: ${(props) => props.tileWidth / 2.25}px;
  opacity: 50%;
  top: 50%;
  left: 50%;
  z-index: 6;
  transform-origin: 0px 0px;
  transform: ${(props) => "rotate(" + props.rotation + "deg)"};
`;
