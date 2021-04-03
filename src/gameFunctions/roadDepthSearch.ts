import findJoinedRoads from "./findJoinedRoads";

export function roadDepthSearch(
  thisRoad: {
    row: number;
    column: number;
    direction: string;
    player: string;
  },
  roads: {
    direction: string;
    player: string;
    row: number;
    column: number;
  }[],
  markedRoads: {
    row: number;
    column: number;
    direction: string;
    player: string;
  }[]
) {
  // console.log("recurseRoad function begins:");
  // console.log("The current road inside recurseRoad is: ", thisRoad);
  // console.log("The current marked roads are: ", markedRoads);

  if (
    markedRoads.some(
      (road) =>
        road.row === thisRoad.row &&
        road.column === thisRoad.column &&
        road.direction === thisRoad.direction &&
        road.player === thisRoad.player
    )
  ) {
    // console.log(
    //   "The current road inside recurseRoad is included in the markedRoads array, so the function is now returning 0 for length."
    // );
    return 0;
  }

  markedRoads.push(thisRoad);
  // console.log(
  //   "The following road in recurseRoad has been added to markedRoads: ",
  //   thisRoad
  // );
  // console.log("The marked roads are now: ", markedRoads);

  let childRoads = findJoinedRoads(
    thisRoad.row,
    thisRoad.column,
    thisRoad.direction,
    thisRoad.player,
    roads
  );


  // console.log(
  //   "The found childRoads for the current road in recurseRoads are: ",
  //   childRoads
  // );


  let currentLongest = 0

  childRoads.forEach((childRoad) => {
    //console.log("The child road being pushed into recurseRoad is: ", childRoad);
    let otherPaths = childRoads.filter(paths => paths !== childRoad)
    let newMarkedRoads = otherPaths ? [...markedRoads, ...otherPaths] : markedRoads
    let thisLength = roadDepthSearch(childRoad, roads, newMarkedRoads)
    //console.log('thisLength: ', thisLength)
    currentLongest = currentLongest > thisLength ? currentLongest : thisLength
  });

  //console.log("The longest is ", currentLongest);


  return currentLongest + 1
}
