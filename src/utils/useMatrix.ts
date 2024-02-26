import { useReducer } from "react";
import { Settings, useSettingsContext } from "./useSettingsContext";

export enum ACTIONS {
  TOGGLE_CELL = 'TOGGLE_CELL',
  UPDATE_MATRIX = 'UPDATE_MATRIX',
  RANDOMIZE_MATRIX = 'RANDOMIZE_MATRIX',
  CLEAR_MATRIX = 'CLEAR_MATRIX'
}


export type Coord = {
  x: number,
  y: number
}

export type Action = {
  type: 'TOGGLE_CELL',
  payload: Coord
} | {
  type: 'UPDATE_MATRIX'
} | {
  type: 'RANDOMIZE_MATRIX'
} | {
  type: 'CLEAR_MATRIX'
}

const getNeighbors = (matrix: number[][]) => (rowIndex: number, colIndex: number) => {
  let neighbors = 0
  for (let row = rowIndex - 1; row <= rowIndex + 1; row++) {
    for (let col = colIndex - 1; col <= colIndex + 1; col++) {
      if (row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length) {
        if (row !== rowIndex || col !== colIndex) {
          neighbors += matrix[row][col]
        }
      }
    }
  }
  return neighbors
}

const matrixReducer = ({ seed: { birth, survive } }: Settings) => (state: number[][], action: Action) => {

  switch (action.type) {
    case 'TOGGLE_CELL':
      return state.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === action.payload.x && cellIndex === action.payload.y
            ? Number(!cell)
            : cell
        )
      );
    case 'UPDATE_MATRIX':
      return state.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          const neighbors = getNeighbors(state)(rowIndex, cellIndex);
          if (cell === 0 && (neighbors >= birth[0] && neighbors <= birth[1])) {
            return 1;
          } else if (cell === 1 && (neighbors < survive[0] || neighbors > survive[1])) {
            return 0;
          } else {
            return cell;
          }
        })
      );
    case 'RANDOMIZE_MATRIX':
      return state.map(row => row.map(() => Math.round(Math.random())))
    case 'CLEAR_MATRIX':
      return state.map(row => row.map(() => 0))
    default:
      return state;
  }
}

const useMatrix = (x: number, y: number) => {
  const { settings } = useSettingsContext()
  return useReducer(matrixReducer(settings), Array.from({ length: y }, () => Array.from({ length: x }, () => 0)))
}
export default useMatrix