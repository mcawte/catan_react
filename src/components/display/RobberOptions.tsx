import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import { PublicGameState, Resources } from "../../../shared_types/types";
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
  resourcePay: {
    borderRight: "1px solid #e0e0e0",
    height: "80vh"
  },
  messageArea: {
    height: "100%",
    overflowY: "auto",
  },
});

interface RobberOptionsProps {
  gameState: PublicGameState;
}

export default function RobberOptions({ gameState }: RobberOptionsProps) {
  const classes = useStyles();

  const emojis: {
    [key: string]: string;
    wheat: string;
    sheep: string;
    forest: string;
    stone: string;
    brick: string;
  } = { brick: `🧱`, forest: `🌲`, stone: `⛰️`, wheat: `🌾`, sheep: `🐏` };

  const initialDebt: Resources = {
    wheat: 0,
    forest: 0,
    stone: 0,
    brick: 0,
    sheep: 0,
  };

  const [robberPayment, setRobberPayment] = useState(initialDebt);

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

  return (
    <>
      <Container maxWidth="md">
        <Grid container component={Paper} className={classes.chatSection} direction="row">
          <Grid item xs={2} className={classes.resourcePay}>
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
            />
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
            />
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
            />

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
            />
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
            />
            </Grid>
            <Grid item sm={10} className={classes.resourcePay}>
              {Object.entries(gameState.player.inventory.resources).map(
                ([key, value]) => {
                  return (
                    <div>
                      {`${key}: `}{" "}
                      <span style={{ fontSize: "1.5rem" }}>
                        {" "}
                        {`${`${emojis[key]} `.repeat(value)}`}
                      </span>
                      <br />
                    </div>
                  );
                }
              )}
            </Grid>
          
          </Grid>
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
            disabled={
              !robberDebtMet() ||
              gameState.robber.robberDebt!.find(
                (player) => player.playerName === gameState.player.name
              )!.complete
            }
          >
            Pay Robber
          </Button>
          <br/>
          You must pay{" "}
          {
            gameState.robber.robberDebt!.find(
              (player) => player.playerName === gameState.player.name
            )!.cardsRequired
          }{" "}
          resource cards. <br/>
          {gameState.robber.robberDebt.map((robber) => {
            return robber.complete === false
              ? `waiting on ${robber.playerName}`
              : null;
          })}
        
      </Container>
    </>
  );
}
