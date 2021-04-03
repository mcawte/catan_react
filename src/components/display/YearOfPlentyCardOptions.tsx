import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { PublicGameState } from "catan_types/types";
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
    height: "70vh",
    minHeight: "400px",
    overflowY: "auto",
  },
});

interface YearOfPlentyOptionsProps {
  gameState: PublicGameState;
  setModals: React.Dispatch<
    React.SetStateAction<{
      trade: boolean;
      monopoly: boolean;
      yearOfPlenty: boolean;
    }>
  >;
}

export default function YearOfPlentyOptions({
  gameState,
  setModals,
}: YearOfPlentyOptionsProps) {
  const classes = useStyles();

  const [yearOfPlenty, setYearOfPlenty] = useState({resourceChoice1: "forest", resourceChoice2: "stone"});

  return (
    <div>
      <Container maxWidth="md">
        <Grid container component={Paper} className={classes.chatSection}>
          <Grid item xs={2} className={classes.borderRight500}>
            {Object.entries(gameState.player.inventory.resources).map(
              ([key, value], index) => (
                <Button
                  color={yearOfPlenty.resourceChoice1 === key ? "secondary" : "primary"}
                  variant="contained"
                  onClick={() => setYearOfPlenty((prevState) => ({...yearOfPlenty, resourceChoice1: key}))}
                >
                  {`${key}`}
                </Button>
              )
            )}
          </Grid>
          <Grid item xs={2} className={classes.borderRight500}>
            {Object.entries(gameState.player.inventory.resources).map(
              ([key, value], index) => (
                <Button
                  color={yearOfPlenty.resourceChoice2 === key ? "secondary" : "primary"}
                  variant="contained"
                  onClick={() => setYearOfPlenty((prevState) => ({...yearOfPlenty, resourceChoice2: key}))}
                >
                  {`${key}`}
                </Button>
              )
            )}
          </Grid>
          <Grid item xs={2} className={classes.borderRight500}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                socket.emit(
                  "playDevCard",
                  gameState.gameName,
                  gameState.player.name,
                  "yearOfPlenty",
                  yearOfPlenty.resourceChoice1,
                  yearOfPlenty.resourceChoice2
                );
                setModals((prevState) => ({ ...prevState, monopoly: false }));
              }}
            >
              {`Take both resource cards from bank`}
            </Button>
          </Grid>
          <Grid>
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                setModals((prevState) => ({ ...prevState, yearOfPlenty: false }))
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
