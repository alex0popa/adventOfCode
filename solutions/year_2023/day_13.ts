

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
  let ok = idx % 2 === 1;

  for (let i = 0; i <= idx / 2 && ok; ++i) {
    if(model[i] !== model[idx - i]) {
      ok = false;
    }
  }

  return ok;
}

const checkHorizontally = (model: string[]): number => {
  let targetLine = model[0];

  for(let i = 1; i < model.length; ++i) {
    if(targetLine === model[i]) {
      if(isPerfectReflection(model, i)) {

        return ( i + 1) / 2;
      }
    }
  }

  model.reverse();

  targetLine = model[0];

  for(let i = 1; i < model.length; ++i) {
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

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).split('\n');
  // const input = [...testInput.trim().split('\n'), ''];

  const patterns = extractPatterns(input);

  let star1 = 0;

  for (let idx = 0; idx < patterns.length; ++idx) {
    let targetLines = 100 * checkHorizontally([...patterns[idx]]);

    if(targetLines === 0 || (targetLines % 2)) {
      const matrix = [...patterns[idx]];
      const verticalModel: string[] = [];

      for (let j = 0; j < matrix[0].length; j++) {
        const element = matrix[j];
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

  showTheResult({ star1, star2: 'WIP...', path: __filename });
})();
