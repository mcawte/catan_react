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

interface MonopolyOptionsProps {
  gameState: PublicGameState;
  setModals: React.Dispatch<
    React.SetStateAction<{
      trade: boolean;
      monopoly: boolean
      yearOfPlenty: boolean;
    }>
  >;
}

export default function MonopolyOptions({
  gameState,
  setModals,
}: MonopolyOptionsProps) {
  const classes = useStyles();

  const [monopoly, setMonopoly] = useState("forest");

  return (
    <div>
      <Container maxWidth="md">
        <Grid container component={Paper} className={classes.chatSection}>
          <Grid item xs={2} className={classes.borderRight500}>
            {Object.entries(gameState.player.inventory.resources).map(
              ([key, value], index) => (
                <Button
                  color={monopoly === key ? "secondary" : "primary"}
                  variant="contained"
                  onClick={() => setMonopoly(key)}
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
                  "monopoly",
                  monopoly
                );
                setModals((prevState) => ({ ...prevState, monopoly: false }));
              }}
            >
              {`Take all ${monopoly} from everyone`}
            </Button>
          </Grid>
          <Grid>
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                setModals((prevState) => ({ ...prevState, monopoly: false }))
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
