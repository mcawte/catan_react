import { Button, Container, Grid, TextField, makeStyles, Paper } from '@material-ui/core'
import { PublicGameState } from 'catan_types/types';
import React from 'react'

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

  interface ShipTradeOptionsProps {
      gameState: PublicGameState
  }

export default function ShipTradeOptions({ gameState}: ShipTradeOptionsProps) {
  const classes = useStyles();
    return (
        <div>
            
        
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
                  // value={robberPayment.forest}
                  // onChange={(e) =>
                  //   setRobberPayment((prevState) => ({
                  //     ...prevState,
                  //     forest: parseInt(e.target.value),
                  //   }))
                  // }
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
                  // value={robberPayment.brick}
                  // onChange={(e) =>
                  //   setRobberPayment((prevState) => ({
                  //     ...prevState,
                  //     brick: parseInt(e.target.value),
                  //   }))
                  // }
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
                  // value={robberPayment.sheep}
                  // onChange={(e) =>
                  //   setRobberPayment((prevState) => ({
                  //     ...prevState,
                  //     sheep: parseInt(e.target.value),
                  //   }))
                  // }
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
                  // value={robberPayment.stone}
                  // onChange={(e) =>
                  //   setRobberPayment((prevState) => ({
                  //     ...prevState,
                  //     stone: parseInt(e.target.value),
                  //   }))
                  // }
                />
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
                  // value={robberPayment.wheat}
                  // onChange={(e) =>
                  //   setRobberPayment((prevState) => ({
                  //     ...prevState,
                  //     wheat: parseInt(e.target.value),
                  //   }))
                  // }
                />
                <Button
                  color="primary"
                  variant="contained"
                  // onClick={() =>
                  //   socket.emit(
                  //     "payRobberDebt",
                  //     gameState.gameName,
                  //     gameState.player.name,
                  //     robberPayment
                  //   )
                  // }
                  // disabled={!robberDebtMet()}
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
            </Grid>
          </Container>
        
        </div>
    )
}
