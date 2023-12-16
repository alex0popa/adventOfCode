import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { mapVectors } from '../../helpers/general';
import { Point } from '../../helpers/typescript';

type Direction = 'N' | 'E' | 'S' | 'W';
type GridElement = '.' | '/' | '\\' | '-' | '|';
type Coordinate = Point & { direction: Direction };
type Visited = `${Direction}#${number}-${number}`;

(async () =>  {
  console.time('time');
  
  const grid = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(line => line.split('')) as GridElement[][];

  let startCoordinate: Coordinate = { row: 0, col: 0, direction: 'E' };
  const star1 = getEnergizedTiles(grid, startCoordinate);
  let star2 = 0;

  for(let col = 0; col < grid[0].length; ++ col) {
    // first row to S
    startCoordinate = { row: 0, col, direction: 'S' };
    const energizedTilesFromTop = getEnergizedTiles(grid, startCoordinate);
 
    // last row to N
    startCoordinate = { row: grid.length - 1, col, direction: 'N' };
    const energizedTilesFromBottom = getEnergizedTiles(grid, startCoordinate);

    star2 = Math.max(star2, energizedTilesFromTop, energizedTilesFromBottom);
  }

  for (let row = 0; row < grid.length; ++row) {
    // first col to E
    startCoordinate = { row, col: 0, direction: 'E' };
    const energizedTilesFromLeft = getEnergizedTiles(grid, startCoordinate);

    // last col to W
    startCoordinate = { row, col: grid[0].length - 1, direction: 'W' };
    const energizedTilesFromRight = getEnergizedTiles(grid, startCoordinate);

    star2 = Math.max(star2, energizedTilesFromLeft, energizedTilesFromRight);
  }

  showTheResult({ star1, star2, path: __filename });
})();

function getEnergizedTiles(grid: GridElement[][], startCoordinate: Coordinate) {
  const tail: Coordinate[] = [startCoordinate];
  const visited = new Set<Visited>();

  while(tail.length) {
    const coordinate = tail.pop()!;
    const actualTile = grid[coordinate.row][coordinate.col];
    const directions = getDirections(coordinate.direction, actualTile);

    for (const direction of directions) {
      const [x, y] = mapVectors[direction];
      const row = coordinate.row + x;
      const col = coordinate.col + y;

      if(grid[row]?.[col] && !visited.has(`${direction}#${row}-${col}`)) {
        tail.push({ direction, row, col })
      }
    }

    visited.add(`${coordinate.direction}#${coordinate.row}-${coordinate.col}`);
  }

  return new Set(Array.from(visited).map(el => el.slice(2))).size;
}

function getDirections(actualDirection: Direction, element: GridElement): Direction[] {
  if(actualDirection === 'N') {
    if (element === '|' || element === '.') return [actualDirection];

    if(element === '/') return ['E'];

    if (element === '\\') return ['W'];

    if (element === '-') return ['E', 'W'];
  }

  if(actualDirection === 'E') {
    if (element === '-' || element === '.') return [actualDirection];

    if(element === '/') return ['N'];

    if (element === '\\') return ['S'];

    if (element === '|') return ['N', 'S'];
  }

  if(actualDirection === 'S') {
    if (element === '|' || element === '.') return [actualDirection];

    if(element === '/') return ['W'];

    if (element === '\\') return ['E'];

    if (element === '-') return ['E', 'W'];
  }

  if (actualDirection === 'W') {

    if (element === '-' || element === '.') return [actualDirection];
    
    if(element === '/') return ['S'];
    
    if (element === '\\') return ['N'];
    
    if (element === '|') return ['N', 'S'];
  }

  return [];
}