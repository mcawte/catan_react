export default function findJoinedRoads(
    row: number,
    column: number,
    direction: string,
    player: string,
    roads: {
        direction: string;
        player: string;
        row: number;
        column: number;
    }[]
  ): { row: number; column: number; direction: string; player: string }[] {
      // the first object in the array is always the road that was started with.
    let result = [] //[{ row: row, column: column, direction: direction, player: player }];
    switch (direction) {
      case "side":
        //check same top
        if (
          roads.some(function (r) {
            return (
              r.row === row &&
              r.column === column &&
              r.direction === "top" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row, column: column, direction: "top", player: player });
        }

        //check same bottom
        if (
          roads.some(function (r) {
            return (
              r.row === row &&
              r.column === column &&
              r.direction === "bottom" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row, column: column, direction: "bottom", player: player });
        }

        //check top row+1 col-1
        if (
          roads.some(function (r) {
            return (
              r.row === row+1 &&
              r.column === column-1 &&
              r.direction === "top" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row+1, column: column-1, direction: "top", player: player });
        }

        //check bottom row-1, col-1
        if (
          roads.some(function (r) {
            return (
              r.row === row-1 &&
              r.column === column-1 &&
              r.direction === "bottom" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row-1, column: column-1, direction: "bottom", player: player });
        }

        return result;
        

      case "top":

        //check same side
        if (
          roads.some(function (r) {
            return (
              r.row === row &&
              r.column === column &&
              r.direction === "side" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row, column: column, direction: "side", player: player });
        }

        //check bot row-1, col-1
        if (
          roads.some(function (r) {
            return (
              r.row === row-1 &&
              r.column === column-1 &&
              r.direction === "bottom" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row-1, column: column-1, direction: "bottom", player: player });
        }

        //check bot row-1, col+1
        if (
          roads.some(function (r) {
            return (
              r.row === row-1 &&
              r.column === column+1 &&
              r.direction === "bottom" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row-1, column: column+1, direction: "bottom", player: player });
        }

        //check side row-1, col+1
        if (
          roads.some(function (r) {
            return (
              r.row === row-1 &&
              r.column === column+1 &&
              r.direction === "side" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row-1, column: column+1, direction: "side", player: player });
        }

        return result;
       

      case "bottom":
        //check same side
        if (
          roads.some(function (r) {
            return (
              r.row === row &&
              r.column === column &&
              r.direction === "side" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row, column: column, direction: "side" , player: player});
        }

        //check top row+1, col-1
        if (
          roads.some(function (r) {
            return (
              r.row === row+1 &&
              r.column === column-1 &&
              r.direction === "top" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row+1, column: column-1, direction: "top" , player: player});
        }

        //check top row+1, col+1
        if (
          roads.some(function (r) {
            return (
              r.row === row+1 &&
              r.column === column+1 &&
              r.direction === "top" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row+1, column: column+1, direction: "top", player: player });
        }

        //check side row+1, col+1
        if (
          roads.some(function (r) {
            return (
              r.row === row+1 &&
              r.column === column+1 &&
              r.direction === "side" &&
              r.player === player
            );
          })
        ) {
          result.push({ row: row+1, column: column+1, direction: "side", player: player });
        }

        return result;
        

      default:
        return [];
    }
  }