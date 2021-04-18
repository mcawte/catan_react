import { faCity, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

interface SettlementProps {
  type: string; // town, city
  direction: string; // top, bottom
  color: string;
  occupied: boolean;
  tileHeight: number;
}

const StyledSettlement = styled.h1<SettlementProps>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.tileHeight / 6}px;
  position: absolute;
  left: 0px;
  top: ${(props) =>
    props.direction === "top"
      ? (1 / 4) * props.tileHeight
      : (3 / 4) * props.tileHeight}px;
  z-index: 20;
  opacity: ${(props) => (props.occupied ? "100" : "0")}%;
  outline: 1px solid transparent;
  stroke: black;
  stroke-width: 15;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

  &:hover {
    opacity: ${(props) => (props.occupied ? "100" : "80")}%;
    -webkit-transition: -webkit-transform 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out;
    outline: 1px solid transparent;
    -webkit-transform: translate(-50%, -50%) scale(1.15);
    transform: translate(-50%, -50%) scale(1.15);
    z-index: 12;
  }
`;

export const Settlement = (props: any) => {
  //console.log("The new type is: ", props.type)
  return (
    <>
    {/* <div style={{transform: "rotate(90deg)"}}> */}
      <StyledSettlement
        direction={props.direction}
        color={props.color}
        occupied={props.occupied}
        type={props.type}
        tileHeight={props.tileHeight}
      >
        <FontAwesomeIcon
          icon={props.type === "town" ? faHome : faCity}
          size="1x"
        />
      </StyledSettlement>
      {/* </div> */}
    </>
  );
};

// import { faCity, faHome } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import styled from "styled-components";

// interface SettlementProps {
//   type: string | null; // town, city
//   direction: string; // top, bottom
//   color: string;
//   occupied: boolean;
//   tileHeight: number;
// }

// interface UnoccupiedProps {
//   direction: string; // top, side, bottom
//   color: string;
//   tileHeight: number;
// }

// const StyledSettlement = styled.h1<SettlementProps>`
//   color: ${(props) => props.color};
//   font-size: ${(props) => props.tileHeight/7}px;
//   position: absolute;
//   left: 0px;
//   top: ${(props) => (props.direction === "top" ? 1/4*props.tileHeight : 3/4 *props.tileHeight)}px;
//   z-index: 20;
//   opacity: ${(props) => (props.occupied ? "100" : "40")}%;
//   outline: 1px solid transparent;
//   stroke: black;
//   stroke-width: 15;
//   -webkit-transform: translate(-50%, -50%);
//   transform: translate(-50%, -50%);

//   &:hover {
//     opacity: ${(props) => (props.occupied ? "100" : "100")}%;
//     -webkit-transition: -webkit-transform 0.3s ease-in-out;
//     -moz-transition: -moz-transform 0.3s ease-in-out;
//     -o-transition: -o-transform 0.3s ease-in-out;
//     transition: transform 0.3s ease-in-out;
//     outline: 1px solid transparent;
//     -webkit-transform: translate(-50%, -50%) scale(1.15);
//     transform: translate(-50%, -50%) scale(1.15);
//     z-index: 12;
//   }
// `;

// const Outer = styled.h1<UnoccupiedProps>`
//   opacity: 0%;
//   border-radius: 60%;
//   position: absolute;
//   background-color: ${(props) => props.color};
//   left: 0px;
//   top: ${(props) => (props.direction === "top" ? 1/4*props.tileHeight : 3/4 *props.tileHeight)}px;
//   //cursor:pointer;
//   width: ${(props) => props.tileHeight/9}px;
//   height: ${(props) => props.tileHeight/9}px;
//   z-index: 30;
//   -webkit-transform: translate(-50%, -50%);
//   transform: translate(-50%, -50%);
//   &:hover {
//     opacity: 100%;
//     transition: opacity .5s ease-in
//   }
// `;

// const Inner = styled.h1`
//   position: relative;
//   width: 50%;
//   height: 50%;
//   border-radius: 50%;
//   background-color: rgb(79, 167, 218);
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   -webkit-transform: translate(-50%, -50%);
//   z-index: 0;
//   &:hover {
//     z-index: 0;
//     transform: translate(-50%, -50%) scale(1.25);
//     -webkit-transform: translate(-50%, -50%) scale(1.25);
//     transition: all 0.2s ease-out;
//     -webkit-transition: all 0.2s ease-out;
//   }
// `;

// export const Settlement = (props: any) => {
//   //console.log("The new type is: ", props.type)
//   return (
//     <>
//       {props.occupied ? (
//         <StyledSettlement
//           direction={props.direction}
//           color={props.color}
//           occupied={props.occupied}
//           type={props.type}
//           tileHeight={props.tileHeight}
//         >
//           {props.type !== null ?
//           <FontAwesomeIcon
//             icon={props.type === "town" ? faHome : faCity}
//             size="1x"
//           />
// : null}

//         </StyledSettlement>
//       ) : (
//         <Outer tileHeight={props.tileHeight} direction={props.direction} color={props.color}>
//           <Inner />
//         </Outer>
//       )}
//     </>
//   );
// };
