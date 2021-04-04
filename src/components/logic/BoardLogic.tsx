import React, { useEffect, useState } from "react";
import { socket } from "../../service/socket";
import Dice from "../display/Dice";
import {
  PublicGameState,
  ItemTypes,
  Settlement as SettlementInterface,
  RoadPiece,
  Resources,
  DevCardTypes,
} from "../../../shared_types/types";
import {
  Button,
  Container,
  Grid,
  makeStyles,
  Modal,
  Paper,
  TextField,
} from "@material-ui/core";
import GameChat from "../GameChat";
import Tiles from "../containers/Tiles";
import ActionPrompt from "../display/ActionPrompt";
import TradeOptions from "../display/TradeOptions";
//import ShipTradeOptions from "../display/ShipTradeOptions";
import MonopolyCardOptions from "../display/MonopolyCardOptions";
import YearOfPlentyCardOptions from "../display/YearOfPlentyCardOptions";
//import { RoadInterface } from "../types";

const useStyles = makeStyles({
  table: {
    minHeight: "500px",
  },
  chatSection: {
    width: "100%",
    height: "80vh",
    minHeight: "500px",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    minHeight: "400px",
    overflowY: "auto",
  },
});

interface BoardLogicProps {
  gameState: PublicGameState;
  setGameState: React.Dispatch<React.SetStateAction<PublicGameState>>;
}

export default function BoardLogic({
  gameState,
  setGameState,
}: React.PropsWithChildren<BoardLogicProps>) {
  const classes = useStyles();
  const [tradeModal, setTradeModal] = useState({ open: false });
  const [modals, setModals] = useState({
    trade: false,
    monopoly: false,
    yearOfPlenty: false,
  });

  const initialDebt: Resources = {
    wheat: 0,
    forest: 0,
    stone: 0,
    brick: 0,
    sheep: 0,
  };

  const emojis: {
    [key: string]: string;
    wheat: string;
    sheep: string;
    forest: string;
    stone: string;
    brick: string;
  } = {brick: "🧱",forest: "🌲", stone: "⛰️", wheat: "🌾", sheep: "🐏" }


  const [robberPayment, setRobberPayment] = useState(initialDebt);
  const [boardUpdate, setBoardUpdate] = useState(false);
  const itemTypes: ItemTypes[] = ["road", "town", "city", "devCard"];

  useEffect(() => {
    socket.on("openTradeModal", () => setTradeModal({ open: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    socket.emit(
      "updateGameState",
      gameState.gameName,
      gameState.player.name,
      gameState
    );
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardUpdate]);

  const robberDebtMet = (): boolean => {
    let resourceSelected =
      robberPayment.brick +
      robberPayment.forest +
      robberPayment.sheep +
      robberPayment.stone +
      robberPayment.wheat;
    let cardsRequired = gameState.robber.robberDebt.find(
      (player) => player.playerName === gameState.player.name
    )!.cardsRequired;
    if (resourceSelected === cardsRequired && cardsRequired !== 0) {
      return true;
    } else {
      return false;
    }
  };

  const isDevCardDisabled = (devCardKey: DevCardTypes): boolean => {
    let disable = false;
    if (gameState.playerTurn.stage < 4) {
      disable = true;
    } else if (gameState.playerTurn.stage === 0) {
      disable = false;
    }

    if (
      gameState.player.inventory.devCards[devCardKey].every(
        (eachCard) => eachCard.roundReceived === gameState.round
      )
    ) {
      disable = true;
    }

    if (
      gameState.player.inventory.devCards[devCardKey].every(
        (eachCard) => eachCard.roundReceived < eachCard.roundPlayed
      )
    ) {
      disable = true;
    }

    Object.keys(gameState.devCards).forEach(devCardKey => {
      if (
        gameState.player.inventory.devCards[(devCardKey as DevCardTypes)].some(
          (eachCard) => eachCard.roundPlayed === gameState.round
        )
      ) {
        disable = true;
      }})


    return disable;
  };

  // roads should hover and be clickable only if player has a road
  const updateRoad = (
    tile: { row: number; column: number },
    road: RoadPiece
  ) => {
    console.log("called");
    setGameState((prevState) => {
      const tileIndex = prevState.tiles.findIndex(
        (item) => item.row === tile.row && item.column === tile.column
      );
      const roadIndexToUpdate = prevState.tiles[tileIndex].roads.findIndex(
        (item) => item.direction === road.direction
      );
      let roadCount = 0;
      if (
        prevState.playerTurn.stage > 3 &&
        prevState.playerTurn.player.name === gameState.player.name
      ) {
        if (road.playerName === null) {
          if (prevState.player.inventory.roads > 0) {
            console.log("adding new road " + gameState.player.name);
            prevState.tiles[tileIndex].roads[roadIndexToUpdate] = {
              direction: road.direction,
              playerColor: gameState.player.color,
              playerName: gameState.player.name,
              roundPlaced: gameState.round,
            };
            roadCount = prevState.player.inventory.roads - 1;
          }
        } else if (
          prevState.tiles[tileIndex].roads[roadIndexToUpdate].playerName ===
            gameState.player.name &&
          prevState.tiles[tileIndex].roads[roadIndexToUpdate].roundPlaced ===
            gameState.round
        ) {
          console.log("Should be setting road to null");
          roadCount = prevState.player.inventory.roads + 1;
          console.log("The road count is now: ", roadCount);
          prevState.tiles[tileIndex].roads[roadIndexToUpdate] = {
            direction: road.direction,
            playerColor: null,
            playerName: null,
            roundPlaced: 0,
          };

          // return newState;
        }
      }

      console.log("the new state is", prevState);

      return {
        ...prevState,
        player: {
          ...prevState.player,
          inventory: { ...prevState.player.inventory, roads: roadCount },
        },
      };
    });
    setBoardUpdate((prevState) => !prevState);
  };

  // towns should only hover and be clickable if player has a town in inventory.
  // if the player has a city in inventory, their towns should change into a city
  // on hover and be clickable
  // if a town exists on the other end of a road, then it should not be built

  const updateSettlement = (
    tile: { row: number; column: number },
    settlement: SettlementInterface
  ) => {
    setGameState((prevState) => {
      const tileIndex = prevState.tiles.findIndex(
        (item) => item.row === tile.row && item.column === tile.column
      );
      const settlementToUpdateIndex = prevState.tiles[
        tileIndex
      ].settlements.findIndex(
        (item) => item.direction === settlement.direction
      );

      let settlementToUpdate =
        prevState.tiles[tileIndex].settlements[settlementToUpdateIndex];

      console.log(
        "the clicked settlement is: ",
        JSON.stringify(settlementToUpdate)
      );

      let settlementCase: null | "town" | "city" | "" = "";

      // 1 if the settlement node is free
      if (
        settlementToUpdate.playerName === null &&
        prevState.player.inventory.towns > 0
      ) {
        console.log("statement 1");
        settlementCase = "town";
      }

      // 2 if player has a town there and placed it in the current round
      // and has no cities
      if (
        settlementToUpdate.playerName === gameState.player.name &&
        prevState.player.inventory.cities === 0 &&
        settlementToUpdate.roundTownPlaced === gameState.round
      ) {
        console.log("statement 2");
        settlementCase = null;
      }

      // 3 if player has a town there and and has cities
      if (
        settlementToUpdate.playerName === gameState.player.name &&
        settlementToUpdate.type === "town" &&
        prevState.player.inventory.cities > 0
      ) {
        console.log("statement 3");
        settlementCase = "city";
      }

      // 4 if player has a city there and placed it in the current round
      // but the town was placed in a previous round
      if (
        settlementToUpdate.playerName === gameState.player.name &&
        settlementToUpdate.type === "city" &&
        settlementToUpdate.roundTownPlaced < gameState.round
      ) {
        console.log("statement 4");
        settlementCase = "town";
      }

      // 5 if player has a city there and placed it in the current round
      // and the town in the current round
      if (
        settlementToUpdate.playerName === gameState.player.name &&
        settlementToUpdate.roundTownPlaced === gameState.round &&
        settlementToUpdate.roundCityPlaced === gameState.round
      ) {
        console.log("statement 5");
        settlementCase = null;
      }

      let newState: PublicGameState = JSON.parse(JSON.stringify(prevState));

      switch (settlementCase) {
        case null:
          console.log("got to null case");
          let noTown = {
            type: null,
            direction: settlement.direction,
            playerName: null,
            playerColor: null,
            roundTownPlaced: 0,
            roundCityPlaced: 0,
          };
          newState.tiles[tileIndex].settlements[
            settlementToUpdateIndex
          ] = noTown;
          break;
        case "town":
          console.log("got to town case");
          let newTown = {
            type: "town",
            direction: settlement.direction,
            playerName: gameState.player.name,
            playerColor: gameState.player.color,
            roundTownPlaced:
              settlementToUpdate.roundTownPlaced < gameState.round
                ? settlementToUpdate.roundTownPlaced
                : gameState.round,
            roundCityPlaced: 0,
          };
          newState.tiles[tileIndex].settlements[
            settlementToUpdateIndex
          ] = newTown;
          newState.player.inventory.towns--;
          break;
        case "city":
          console.log("got to city case");
          let newCity = {
            type: "city",
            direction: settlement.direction,
            playerName: gameState.player.name,
            playerColor: gameState.player.color,
            roundTownPlaced: settlementToUpdate.roundTownPlaced,
            roundCityPlaced: gameState.round,
          };
          newState.tiles[tileIndex].settlements[
            settlementToUpdateIndex
          ] = newCity;
          newState.player.inventory.cities--;
          break;
        default:
          console.log("got to default");
      }

      console.log(
        "The new settlement is: ",
        newState.tiles[tileIndex].settlements[settlementToUpdateIndex]
      );

      return {
        ...newState,
      };
    });
    setBoardUpdate((prevState) => !prevState);
  };

  const updateRobber = (tile: {
    row: number;
    column: number;
    tileNumber: number | null;
  }) => {
    setGameState((prevState) => {
      console.log("Should be updating robber");
      if (
        prevState.playerTurn.stage === 2 &&
        prevState.playerTurn.player.name === prevState.player.name &&
        tile.tileNumber !== null
      ) {
        prevState.robber.row = tile.row;
        prevState.robber.column = tile.column;
        prevState.robber.tileNumber = tile.tileNumber;
      }

      return { ...prevState };
    });
  };

  return (
    <>
      <ActionPrompt
        message={gameState.actionMessage.message}
        messageColor={gameState.actionMessage.color}
      />

      <Tiles
        gameName={gameState.gameName}
        playerName={gameState.player.name}
        tiles={gameState.tiles}
        playerColor={gameState.player.color}
        updateRoad={updateRoad}
        updateSettlement={updateSettlement}
        updateRobber={updateRobber}
        robber={gameState.robber}
        moveRobber={
          gameState.playerTurn.player.name === gameState.player.name &&
          gameState.playerTurn.stage === 2
        }
      />

      <div>
        <Dice
          dice1={gameState?.diceRoll.dice1}
          dice2={gameState?.diceRoll.dice2}
        />

        <div style={{ marginLeft: "60vw", marginTop: "15vh" }}>
          <button
            onClick={() =>
              socket.emit(
                "rollDice",
                gameState?.gameName,
                gameState?.player.name
              )
            }
            disabled={
              !(
                gameState.player.name === gameState.playerTurn.player.name &&
                gameState.playerTurn.stage === 0
              )
            }
          >
            Roll Dice
          </button>
          <button
            onClick={() =>
              setModals((prevState) => ({ ...prevState, trade: true }))
            }
            disabled={
              !(
                gameState.playerTurn.stage > 3 &&
                gameState.player.name === gameState.playerTurn.player.name &&
                gameState.round > 1
              )
            }
          >
            Trade
          </button>

          <button
            onClick={() => setTradeModal({ open: true })}
            disabled={gameState.playerTurn.stage !== 4}
          >
            Player Trade
          </button>

          <button
            onClick={() =>
              socket.emit(
                "endTurn",
                gameState.gameName,
                gameState.player.name,
                gameState
              )
            }
            disabled={
              !(
                gameState.player.name === gameState.playerTurn.player.name &&
                gameState.playerTurn.stage > 3
              )
            }
          >
            End Turn
          </button>
        </div>

        <div style={{ marginLeft: "60vw", marginTop: "1vh" }}>
          {itemTypes.map((itemToBuy) => (
            <button
              onClick={() =>
                socket.emit(
                  "buyItem",
                  gameState.gameName,
                  gameState.player.name,
                  itemToBuy
                )
              }
              disabled={
                !(
                  gameState.player.name === gameState.playerTurn.player.name &&
                  gameState.playerTurn.stage > 3 &&
                  gameState.round > 1
                )
              }
            >
              {`Buy ${itemToBuy}`}
            </button>
          ))}
        </div>
        {/* dev cards here */}
        <div style={{ marginLeft: "60vw", marginTop: "1vh" }}>
          {gameState.playerTurn.player.name === gameState.player.name &&
          gameState.playerTurn.stage > 3
            ? Object.keys(gameState.player.inventory.devCards).map(
                (devCardKey) => {
                  return gameState.player.inventory.devCards[devCardKey]
                    .length > 0 && devCardKey !== "victory" ? (
                    <button
                      onClick={() => {
                        if (devCardKey === "monopoly") {
                          setModals((prevState) => ({
                            ...prevState,
                            monopoly: true,
                          }));
                        } else if (devCardKey === "yearOfPlenty") {
                          setModals((prevState) => ({
                            ...prevState,
                            yearOfPlenty: true,
                          }));
                        } else {
                          socket.emit(
                            "playDevCard",
                            gameState.gameName,
                            gameState.player.name,
                            devCardKey
                          );
                        }
                      }}
                      disabled={isDevCardDisabled(devCardKey as DevCardTypes)}
                    >
                      {`Play ${devCardKey} devCard`}
                    </button>
                  ) : null;
                }
              )
            : null}
        </div>
        {/* here */}
        <div style={{ marginLeft: "60vw", marginTop: "4vh" }}>
          {gameState.playerTurn.player.name === gameState.player.name &&
          gameState.playerTurn.stage === 2 ? (
            <button
              onClick={() =>
                socket.emit(
                  "newRobberPosition",
                  gameState.gameName,
                  gameState.player.name,
                  gameState
                )
              }
              disabled={
                !(
                  gameState.playerTurn.stage === 2 &&
                  gameState.playerTurn.player.name === gameState.player.name
                )
              }
            >
              Submit Robber Position
            </button>
          ) : null}
        </div>
        <div style={{ marginLeft: "60vw", marginTop: "1vh" }}>
          {gameState.playerTurn.player.name === gameState.player.name &&
          gameState.playerTurn.stage === 3
            ? gameState.robber.playersToStealFrom.map((playerToStealFrom) => (
                <button
                  onClick={() =>
                    socket.emit(
                      "stealFrom",
                      gameState.gameName,
                      gameState.player.name,
                      playerToStealFrom
                    )
                  }
                >
                  {`Steal from ${playerToStealFrom}`}
                </button>
              ))
            : null}
        </div>
        <div style={{ marginLeft: "60vw", marginTop: "4vh" }}>
          Resources:{" "}
          {/* {Object.entries(gameState.player.inventory.resources).map(
            ([key, value]) => `${key}: ${value}, `
          )} */}
          {Object.entries(gameState.player.inventory.resources).map(
            ([key, value]) => `${key}: ${emojis[key].repeat(value)}, `
          )}
          {/* {JSON.stringify(gameState.player.inventory.resources)} */}
          <br />
          Played devCards:{" "}
          {Object.entries(gameState.player.inventory.devCards).map(
            ([key, value]) => {
              return `${key}: ${
                value.filter((eachValue) => eachValue.roundPlayed > 0).length
              }, `;
            }
          )}
          {/* {JSON.stringify(gameState.player.inventory.devCards)} */}
          <br />
          DevCards in hand:{" "}
          {Object.entries(gameState.player.inventory.devCards).map(
            ([key, value]) => {
              return `${key}: ${
                value.filter((eachValue) => eachValue.roundPlayed === 0).length
              }, `;
            }
          )}
          <br />
          {/* Your roads, towns, and cities are:{" "} */}
          Roads: {JSON.stringify(gameState.player.inventory.roads)}, Towns:{" "}
          {JSON.stringify(gameState.player.inventory.towns)}, Cities:{" "}
          {JSON.stringify(gameState.player.inventory.cities)}
          <br />
          {gameState.longestRoad.playerName !== ""
            ? `The longest road belongs to ${gameState.longestRoad.playerName} and is ${gameState.longestRoad.length} pieces long.`
            : null}
          <br />
          {gameState.largestArmy.playerName !== ""
            ? `The largest army belongs to ${gameState.largestArmy.playerName} and is ${gameState.largestArmy.size} units strong.`
            : null}
          {/* The largest army is: {JSON.stringify(gameState.largestArmy)} */}
          <br />
          {`Your points are: ${gameState.player.points}`}
          <br />
          <br />
          {`You have ${gameState.player.inventory.devCards.victory.length} victory points.`}
          <br />
          <br />
          {`There are ${gameState.resourceCards} resource cards left and ${gameState.devCards} devCards left.`}
          <br />
          Road cost: 🧱 🌲
          <br />
          Town cost: 🧱 🌲 🐏 🌾
          <br />
          City cost: ⛰️ ⛰️ ⛰️ 🌾 🌾
          <br />
          Dev card costs:  💎 🐏 🌾
        </div>
      </div>

      <Modal
        open={tradeModal.open}
        onClose={() => setTradeModal({ open: false })}
        aria-labelledby="trade modal"
        aria-describedby="modal to propose domestic trade"
      >
        <GameChat
          gameState={gameState}
          setGameState={setGameState}
          setTradeModal={setTradeModal}
        />
      </Modal>

      <Modal
        open={gameState.playerTurn.stage === 1}
        //onClose={() => setRobber({ loseResourceModal: false })}
        aria-labelledby="robber modal"
        aria-describedby="modal to lose resource from robber"
      >
        <>
          <Container maxWidth="md">
            <Grid container component={Paper} className={classes.chatSection}>
              <Grid item xs={2} className={classes.borderRight500}>
                {gameState.robber.robberDebt.map((robber) => (
                  <Button
                    color={robber.complete ? "primary" : "secondary"}
                    variant="contained"
                  >
                    {robber.playerName}
                  </Button>
                ))}
              </Grid>
              <Grid item xs={2} className={classes.borderRight500}>
                <TextField
                  id="forest"
                  name="forest"
                  label="forest"
                  type="number"
                  InputProps={{
                    inputProps: {
                      max: gameState.player.inventory.resources.forest,
                      min: 0,
                    },
                  }}
                  fullWidth
                  value={robberPayment.forest}
                  onChange={(e) =>
                    setRobberPayment((prevState) => ({
                      ...prevState,
                      forest: parseInt(e.target.value),
                    }))
                  }
                >
                  
                </TextField>
                <TextField
                  id="brick"
                  name="brick"
                  label="brick"
                  type="number"
                  InputProps={{
                    inputProps: {
                      max: gameState.player.inventory.resources.brick,
                      min: 0,
                    },
                  }}
                  fullWidth
                  value={robberPayment.brick}
                  onChange={(e) =>
                    setRobberPayment((prevState) => ({
                      ...prevState,
                      brick: parseInt(e.target.value),
                    }))
                  }
                >
                
                </TextField>
                <TextField
                  id="sheep"
                  name="sheep"
                  label="sheep"
                  type="number"
                  InputProps={{
                    inputProps: {
                      max: gameState.player.inventory.resources.sheep,
                      min: 0,
                    },
                  }}
                  fullWidth
                  value={robberPayment.sheep}
                  onChange={(e) =>
                    setRobberPayment((prevState) => ({
                      ...prevState,
                      sheep: parseInt(e.target.value),
                    }))
                  }
                >
                
                </TextField>
                <TextField
                  id="stone"
                  name="stone"
                  label="stone"
                  type="number"
                  InputProps={{
                    inputProps: {
                      max: gameState.player.inventory.resources.stone,
                      min: 0,
                    },
                  }}
                  fullWidth
                  value={robberPayment.stone}
                  onChange={(e) =>
                    setRobberPayment((prevState) => ({
                      ...prevState,
                      stone: parseInt(e.target.value),
                    }))
                  }
                >
               
                </TextField>
                <TextField
                  id="wheat"
                  name="wheat"
                  label="wheat"
                  type="number"
                  InputProps={{
                    inputProps: {
                      max: gameState.player.inventory.resources.wheat,
                      min: 0,
                    },
                  }}
                  fullWidth
                  value={robberPayment.wheat}
                  onChange={(e) =>
                    setRobberPayment((prevState) => ({
                      ...prevState,
                      wheat: parseInt(e.target.value),
                    }))
                  }
                >
                
                </TextField>
                
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() =>
                    socket.emit(
                      "payRobberDebt",
                      gameState.gameName,
                      gameState.player.name,
                      robberPayment
                    )
                  }
                  disabled={!robberDebtMet() || gameState.robber.robberDebt!.find(
                    (player) => player.playerName === gameState.player.name
                  )!.complete}
                >
                  Pay Robber
                </Button>
                You must pay{" "}
                {
                  gameState.robber.robberDebt!.find(
                    (player) => player.playerName === gameState.player.name
                  )!.cardsRequired
                }{" "}
                resource cards.
              </Grid>
              <Grid item xs={2} className={classes.borderRight500}>
              {`You have ${gameState.player.inventory.resources["forest"]} 🌲`}
              <br/>
                {`You have ${gameState.player.inventory.resources["brick"]} 🧱`}
                <br/>
                {`You have ${gameState.player.inventory.resources["sheep"]} 🐏`}
                <br/>
                {`You have ${gameState.player.inventory.resources["stone"]} ⛰️`}
                <br/>
                {`You have ${gameState.player.inventory.resources["wheat"]} 🌾`}
              </Grid>
            </Grid>
          </Container>
        </>
      </Modal>

      <Modal
        open={modals.monopoly}
        onClose={() =>
          setModals((prevState) => ({ ...prevState, monopoly: false }))
        }
        aria-labelledby="monopoly modal"
        aria-describedby="modal to play monopoly devCard"
      >
        <MonopolyCardOptions gameState={gameState} setModals={setModals} />
      </Modal>

      <Modal
        open={modals.yearOfPlenty}
        onClose={() =>
          setModals((prevState) => ({ ...prevState, yearOfPlenty: false }))
        }
        aria-labelledby="yearOfPlenty modal"
        aria-describedby="modal to play year of plenty devCard"
      >
        <YearOfPlentyCardOptions gameState={gameState} setModals={setModals} />
      </Modal>

      <Modal
        open={modals.trade}
        onClose={() =>
          setModals((prevState) => ({ ...prevState, trade: false }))
        }
        aria-labelledby="trade modal"
        aria-describedby="modal to trade with"
      >
        <TradeOptions gameState={gameState} setModals={setModals} />
      </Modal>
    </>
  );
}
