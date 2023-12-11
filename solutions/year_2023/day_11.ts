import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { Point } from '../../helpers/typescript';

const GALAXY = '#';
const EXPANSION_EMPTY_SPACE_PART_1 = 2 - 1;
const EXPANSION_EMPTY_SPACE_PART_2 = 1000000 - 1;

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const galaxies: Point[] = [];
  const noGalaxiesRows: number[] = [];
  const noGalaxiesCols: number[] = [];

  for (let row = 0; row < input.length; row++) {
    const setRows = new Set<string>();
    const setCols = new Set<string>();

    for (let col = 0; col < input[row].length; col++) {
      setRows.add(input[row][col]);
      setCols.add(input[col][row]);

      if(input[row][col] === GALAXY) galaxies.push({ row, col });
    }

    if(setRows.size === 1) noGalaxiesRows.push(row);
    if(setCols.size === 1) noGalaxiesCols.push(row);
  }

  let star1 = 0;
  let star2 = 0;

  for (let i = 0; i < galaxies.length -1; i++) {
    const galaxy = galaxies[i];
    
    for (let j = i + 1; j < galaxies.length; j++) {
      const nextGalaxy = galaxies[j];
      
      const manhattanDistance = (Math.abs(galaxy.row - nextGalaxy.row) + 
        Math.abs(galaxy.col - nextGalaxy.col));

      const emptyRowsIntersect = noGalaxiesRows.filter(row => {

        return row > galaxy.row && row < nextGalaxy.row;
      }).length;

      const emptyColsIntersect = noGalaxiesCols.filter(col => {
        if(nextGalaxy.col >= galaxy.col) {
          return col > galaxy.col && col < nextGalaxy.col;
        }

        return col < galaxy.col && col > nextGalaxy.col;
      }).length;
      
      star1 +=
        manhattanDistance +
        emptyRowsIntersect * EXPANSION_EMPTY_SPACE_PART_1 +
        emptyColsIntersect * EXPANSION_EMPTY_SPACE_PART_1;

      star2 +=
        manhattanDistance +
        emptyRowsIntersect * EXPANSION_EMPTY_SPACE_PART_2 +
        emptyColsIntersect * EXPANSION_EMPTY_SPACE_PART_2;
    }
  }

  showTheResult({ star1, star2, path: __filename });
})();
