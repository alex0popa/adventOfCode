export const directionsVectorMap = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
} as const;

/** up right down left */
export const directionsVector = Object.values(directionsVectorMap);

/** Visit all adjacent positions from a given point */
export const visitDirections = <T>(
  row: number,
  col: number,
  callback: (newRow: number, newCol: number) => T,
): T[] => {
  return directionsVector.map(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    return callback(newRow, newCol);
  });
};

export const aroundDirectionsVector = [
  [-1, 0], // N
  [-1, 1], // NE
  [0, 1], // E
  [1, 1], // SE
  [1, 0], // S
  [1, -1], // SW
  [0, -1], // W
  [-1, -1], // NW
] as const;

export const visitAround = <T>(
  row: number,
  col: number,
  callback: (newRow: number, newCol: number) => T,
): T[] => {
  return aroundDirectionsVector.map(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;

    return callback(newRow, newCol);
  });
};
