import styled from "styled-components";
import { PlayerColor } from "../../../shared_types/types";

interface RoadProps {
  direction: string; // top, side, bottom
  left: number;
  top: number;
  height: number;
  width: number;
  color: PlayerColor;
  occupied: boolean;
}

export const Road = styled.h2<RoadProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background: ${(props) => props.color};
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  z-index: 10;
  opacity: ${(props) => (props.occupied ? "100" : "0")}%;
  outline: 1px solid transparent;
  transform-origin: ${(props) =>
    props.direction === "side" ? "top" : props.direction};
  transform: ${(props) =>
    props.direction === "side"
      ? null
      : props.direction === "top"
      ? "rotate(-120deg)"
      : "rotate(120deg)"};

&.can-hover &:hover {
    opacity: ${(props) => (props.occupied ? "100" : "100")}%;
    transform-origin: ${(props) =>
      props.direction === "side" ? "top" : props.direction};
    transition: transform 0.3s ease-in-out;
    outline: 1px solid transparent;
    transform: ${(props) =>
        props.direction === "side"
          ? null
          : props.direction === "top"
          ? "rotate(-120deg)"
          : "rotate(120deg)"}
      scaleX(1.5);
    z-index: 12;
  }
`;
