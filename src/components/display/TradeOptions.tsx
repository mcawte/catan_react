import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { PublicGameState, TradeType } from "../../../shared_types/types";
import React, { useState } from "react";
import { socket } from "../../service/socket";

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
    height: "100%",
    overflowY: "auto",
  },
});

interface TradeOptionsProps {
  gameState: PublicGameState;
  setModals: React.Dispatch<
    React.SetStateAction<{
      trade: boolean;
      monopoly: boolean;
      yearOfPlenty: boolean;
    }>
  >;
}

export default function TradeOptions({
  gameState,
  setModals,
}: TradeOptionsProps) {
  const classes = useStyles();

  const [trade, setTrade] = useState({
    receive: "forest",
  });

  const tradeRate = gameState.player.shipRoutes.includes("3to1")
    ? "3to1"
    : "4to1";

  return (
    <div>
      <Container maxWidth="md">
        <Grid container component={Paper} className={classes.chatSection}>
          <Grid container>
            {Object.entries(gameState.player.inventory.resources).map(
              ([key, value], index) => (
                <Grid
                  item
                  xs={2}
                  className={classes.borderRight500}
                  direction="row"
                >
                  <Button
                    color={trade.receive === key ? "secondary" : "primary"}
                    variant="contained"
                    onClick={() =>
                      setTrade((prevState) => ({
                        ...prevState,
                        receive: key,
                      }))
                    }
                    //disabled={!bankTrade.tradeIn[key]}
                  >
                    {`Receive 1 ${key}`}
                  </Button>
                </Grid>
              )
            )}
          </Grid>
          <Grid container>
            {gameState.player.shipRoutes.map((resourceKey, index) => {
              return gameState.player.inventory.resources[resourceKey] >= 2 ? (
                <Grid
                  item
                  xs={2}
                  className={classes.borderRight500}
                  direction="row"
                >
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      socket.emit(
                        "trade",
                        gameState.gameName,
                        gameState.player.name,
                        "2to1",
                        resourceKey,
                        trade.receive
                      );
                      setModals((prevState) => ({ ...prevState, trade: false }));
                    }}
                    disabled={resourceKey === trade.receive ? true : false}
                  >
                    {`Give up 2 ${resourceKey}`}
                  </Button>
                </Grid>
              ) : null;
            })}
          </Grid>
          <Grid container>
            {Object.entries(gameState.player.inventory.resources).map(
              ([resourceKey, value], index) => {
                return value >= 4 && tradeRate === "4to1" ? (
                  <Grid
                    item
                    xs={2}
                    className={classes.borderRight500}
                    direction="row"
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        socket.emit(
                          "trade",
                          gameState.gameName,
                          gameState.player.name,
                          "4to1",
                          resourceKey,
                          trade.receive
                        );
                        setModals((prevState) => ({
                          ...prevState,
                          trade: false,
                        }));
                      }}
                      disabled={
                        resourceKey === trade.receive ||
                        gameState.player.shipRoutes.includes(
                          resourceKey as TradeType
                        )
                          ? true
                          : false
                      }
                    >
                      {`Give up 4 ${resourceKey}`}
                    </Button>
                  </Grid>
                ) : null;
              }
            )}
            {Object.entries(gameState.player.inventory.resources).map(
              ([resourceKey, value], index) => {
                return value >= 3 && tradeRate === "3to1" ? (
                  <Grid
                    item
                    xs={2}
                    className={classes.borderRight500}
                    direction="row"
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        socket.emit(
                          "trade",
                          gameState.gameName,
                          gameState.player.name,
                          "3to1",
                          resourceKey,
                          trade.receive
                        );
                        setModals((prevState) => ({
                          ...prevState,
                          trade: false,
                        }));
                      }}
                      disabled={
                        resourceKey === trade.receive ||
                        gameState.player.shipRoutes.includes(
                          resourceKey as TradeType
                        ) ? true : false
                      }
                    >
                      {`Give up 3 ${resourceKey}`}
                    </Button>
                  </Grid>
                ) : null;
              }
            )}
          </Grid>

          <Grid>
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                setModals((prevState) => ({ ...prevState, trade: false }))
              }
            >
              Go Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
