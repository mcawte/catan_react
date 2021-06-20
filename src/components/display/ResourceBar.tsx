import { Grid } from "@material-ui/core";
import { marginBottom } from "styled-system";
import {  PublicGameState } from "../../../shared_types/types";


interface ResourceBarInterface {
  gameState: PublicGameState
}



export default function ResourceBar({
  gameState
}: ResourceBarInterface) {

  const emojis: {
    [key: string]: string;
    wheat: string;
    sheep: string;
    forest: string;
    stone: string;
    brick: string;
  } = { brick: "🧱", forest: "🌲", stone: "⛰️", wheat: "🌾", sheep: "🐏" };

  return (
   
    <div className="fixed left-0 bottom-0 w-full h-14 bg-blue-300 z-50">
         {/* <Grid container direction="column"  spacing={2}>
           <Grid item> */}
         <Grid container direction="row" justify="center" alignItems="center"  spacing={10}>
      {Object.entries(gameState.player.inventory.resources).map(
  ([key, value]) => {
    return (
      <Grid item>
      <div>
        {`${key}: `}{" "}
        <span style={{ fontSize: "1.5rem" }}>
          {" "}
          {`${`${emojis[key]} `.repeat(value)}`}
        </span>
        <br />
      </div>
      </Grid>
    );
  }
)}
<Grid item>
Roads: {JSON.stringify(gameState.player.inventory.roads)}, Towns:{" "}
        {JSON.stringify(gameState.player.inventory.towns)}, Cities:{" "}
        {JSON.stringify(gameState.player.inventory.cities)}
</Grid>
{/* </Grid>
</Grid> */}
{/* <Grid item>
<Grid container direction="row" justify="center" alignItems="center"  spacing={10}>
DevCards in hand: <br />
            {Object.entries(gameState.player.inventory.devCards).map(
              ([key, value]) => {
                return (
                  <Grid item>
                  <div>
                    {`${key}: ${
                      value.filter((eachValue) => eachValue.roundPlayed === 0)
                        .length
                    } `}
                    <br />
                  </div>
                  </Grid>
                );
              }
            )}
</Grid>
</Grid> */}
{/* <Grid item>
<Grid container direction="row" justify="center" alignItems="center"  spacing={8}>
Played devCards: <br />
            {Object.entries(gameState.player.inventory.devCards).map(
              ([key, value]) => {

                return (
                  <Grid item>
                  <div>
                    {`${key}: ${
                      value.filter((eachValue) => eachValue.roundPlayed > 0)
                        .length
                    // } `}
                    <br />
                  </div>
                  </Grid>
                );
              }
            )}
</Grid>
</Grid> */}
</Grid>
    </div>
  );
}
