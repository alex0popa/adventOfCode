

import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const testInput = 
`##.#..#######.###
#....##..#..#.#.#
#...###..#..#.#.#
##.#..#######.###
##.#...#.##...###
##.#...#.##...###
##.#..#######.###
#...###..#..#.#.#
#....##..#..#.#.#
##.#..#######.###
#..#......###...#
.#..###..#.......
......#..##.##...
.#.#...##.#..####
..#..##..#.#.###.

#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#

##.#..#.###
..##..##...
##.#..#.###
....##.....
#.#....#.##
.###..###..
#.#....#.##
#.##..##.##
#.######.##
.#......#..
###....####
.###..###..
#.#.##.#.##
#.#....#.##
.####.###..`;

const isPerfectReflection = (model: string[], idx: number) => {
  for (let i = 0; i <= idx / 2; ++i) {
    if(model[i] !== model[idx - i]) {
      return false;
    }
  }

  return true;
}

const checkHorizontally = (model: string[]): number => {
  let targetLine = model[0];

  for(let i = 1; i < model.length; i += 2) {
    if(targetLine === model[i]) {
      if(isPerfectReflection(model, i)) {

        return ( i + 1) / 2;
      }
    }
  }

  model.reverse();

  targetLine = model[0];

  for(let i = 1; i < model.length; i += 2) {
    if(targetLine === model[i]) {
      if(isPerfectReflection(model, i)) {

        return model.length - ( i + 1) / 2;
      }
    }
  }

  return 0;
};

const extractPatterns = (input: string[]) => {
  const patterns: string[][] = [];

  let model: string[] = [];

  for (const line of input) {
    if(line.length > 0) {
      model.push(line);
    } else {
      patterns.push([...model]);

      model = []
    }
  }

  return patterns;
}

const getStar1 = (patterns: string[][]) => {
  let star1 = 0;

  for (const pattern of patterns) {
    let targetLines = 100 * checkHorizontally([...pattern]);

    if(targetLines === 0 || (targetLines % 2)) {
      const matrix = [...pattern];
      const verticalModel: string[] = [];

      for (let j = 0; j < matrix[0].length; j++) {
        let line = '';
        
        for (let i = matrix.length - 1; i >= 0; --i) {
          line += matrix[i][j];
        }

        verticalModel.push(line);
      }

      targetLines = checkHorizontally([...verticalModel]);
    }
    
    star1 += targetLines;
  }

  return star1;
}

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).split('\n');
  // const input = [...testInput.trim().split('\n'), ''];

  const patterns = extractPatterns(input);
  const star1 = getStar1([...patterns]);
  

  showTheResult({ star1, star2: 'WIP...', path: __filename });
})();
