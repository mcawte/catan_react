import findJoinedRoads from "./findJoinedRoads";
import { roadDepthSearch } from "./roadDepthSearch";

export default function findLongestRoad(
  roads: {
    direction: string;
    player: string;
    row: number;
    column: number;
  }[],
  player: string
): number {
  let markedRoads: {
    row: number;
    column: number;
    direction: string;
    player: string;
  }[] = [];

  let playerRoads = roads.filter((road) => road.player === player);

  // console.log("the filtered player roads are: ", playerRoads);

  let longestRoadLength = 0;
  let loopTriedRoads: any = [];

  // add in player edge roads here

  while (loopTriedRoads.length < playerRoads.length) {
    //while (markedRoads.length < playerRoads.length) {
    let untriedRoad = playerRoads.find(
      (road) => !loopTriedRoads.includes(road)
    );
    loopTriedRoads.push(untriedRoad);

    // console.log("The found (from find) untriedRoad is: ", untriedRoad);

    let thisRoadLength = untriedRoad
      ? roadDepthSearch(untriedRoad, roads, markedRoads)
      : 0;

    markedRoads = [];
    // console.log(
    //   "The returned road length for the untried road when sent into recurseRoad is: ",
    //   thisRoadLength
    // );

    longestRoadLength =
      thisRoadLength > longestRoadLength ? thisRoadLength : longestRoadLength;
  }

  loopTriedRoads = [];
  console.log("the longestRoadLength is: ", longestRoadLength);
  return longestRoadLength;
}
