

import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { typedObjEntries } from '../../helpers/typescript';

type Direction = typeof DIRECTIONS[number];
type Vector = [-1 |0 | 1, -1 | 0 |1];
type DirectionsMap = { 
  [key in Direction]: { 
    vector: Vector, 
    tiles: Tile[]  
  } 
}

type Grid = (Tile | 'S' | '.')[][];
type Point = { row: number, col: number };
type Tile = typeof TILES[number];

const DIRECTIONS = ['N', 'S', 'E', 'W'] as const;
const TILES = [ '|', '-', 'L', 'J', '7', 'F'] as const;
const TILES_MAP: { [key in Tile]: [Direction, Direction] } = {
  "|": ['N', 'S'],
  "-": ['E', 'W'],
  L: ['N', 'E'],
  J: ['N', 'W'],
  "7": ['S', 'W'],
  F: ['S', 'E']
};

const directionsMap: DirectionsMap = {
  N : { 
    vector: [-1, 0],
    tiles: ['|', 'F', '7']
  },
  S: {
    vector: [1, 0],
    tiles: ['|', 'L', 'J']
  },
  E: {
    vector: [0, 1],
    tiles: ['-', '7', 'J']
  }, 
  W: {
    vector: [0, -1],
    tiles: ['-', 'F', 'L']
  }
};

const findStartPoint = (grid: Grid, visited: Set<string>) => { 
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; ++col) {
      if (grid[row][col] === 'S') {
        visited.add(`${row}-${col}`);

        const dirs: Direction[] = [];
        const points: Point[] = [];

        for (const [dir, { vector: [x, y], tiles }] of typedObjEntries(directionsMap)) {
          const char = grid[row + x][col + y];

          if (tiles.map(String).includes(char)) {
            dirs.push(dir);
            points.push({ row: row + x, col: col + y })
          }
        }

        const [tile] = typedObjEntries(TILES_MAP).find(([, directions]) => directions.every(direction => dirs.includes(direction))) ?? TILES;

        grid[row][col] = tile;

        return points[0];
      };
    }
  }

  return { row: 0, col: 0 }
}

const drawLoop = (grid: Grid, visited: Set<string>) => {
  const stack = [findStartPoint(grid, visited)];

  while(stack.length) {
    const point = stack.pop()!;
    visited.add(`${point.row}-${point.col}`);

    const tile = grid[point.row][point.col];
    const tilesDirections = TILES_MAP[tile as Tile];
      
    for (let i = 0; i < tilesDirections.length; i++) {
      const direction = tilesDirections[i];
      const [x, y] = directionsMap[direction].vector;
      const row = point.row + x;
      const col = point.col + y;
      const futureTile = grid[row][col];

      if(
        !visited.has(`${row}-${col}`) && 
        directionsMap[direction].tiles.map(String).includes(futureTile)
      ) {
        stack.push({ row, col })
      } 
    }
    
  }
};

// check horizontally, left to right, so walls are vertical, N or S tiles
const getIntersectedWalls = (row: number, col: number, grid: Grid, visited: Set<string>) => {
  const walls = directionsMap.N.tiles.map(String);
  let intersectedWalls = 0;

  for (let idx = 0; idx < col; ++idx) {
    if(visited.has(`${row}-${idx}`) &&  walls.includes(grid[row][idx])) {
      ++intersectedWalls
    }
  }

  return intersectedWalls;
}

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const grid = input.map(line => line.split('')) as Grid;
  const visited = new Set<string>();
  
  drawLoop(grid, visited);

  const star1 = visited.size / 2;

  let star2 = 0;
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if(!(visited.has(`${i}-${j}`))) {
        const walls = getIntersectedWalls(i, j, grid, visited);

        // cross an even number of walls -> outside the loop
        // cross an odd number of walls  -> inside the loop
        star2 += (walls % 2);
      }
    }
  }

  showTheResult({ star1, star2, path: __filename });
})();
