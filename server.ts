import { existsSync, writeFile, mkdirSync } from 'fs';
import { exec } from 'child_process';
import { getPuzzle } from './helpers/getPuzzle';

const now = new Date();
const thisDay = now.getDate();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();

const [, , day = thisDay, year = thisYear] = process.argv;

const BOILERPLATE = `import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\\n');

  console.log(input);

  showTheResult({ star1: 'WIP...', star2: 'WIP...', path: __filename });
  console.timeEnd('time');
})();
`;

const execDay = () => {
  exec(
    `ts-node solutions/year_${year}/day_${day}.ts`,
    (error, stdout, stderr) => {
      console.log(`\x1b[1;95m%s\x1b[0m`, stdout);
      console.log(stderr);

      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    },
  );
};

const addBoilerPlate = (path: string) => {
  writeFile(path, BOILERPLATE, execDay);
};

const go = async () => {
  const solutionsDirFolderPath = `solutions/year_${year}`;
  const inputsDirFolderPath = `inputs/year_${year}`;

  if (!existsSync(solutionsDirFolderPath)) {
    mkdirSync(solutionsDirFolderPath, { recursive: true });
  }

  if (!existsSync(inputsDirFolderPath)) {
    mkdirSync(inputsDirFolderPath, { recursive: true });
  }

  const inputDayPath = `${inputsDirFolderPath}/day_${day}.in`;

  !existsSync(inputDayPath) && (await getPuzzle(+day, +year));

  const solutionDayPath = `${solutionsDirFolderPath}/day_${day}.ts`;

  existsSync(solutionDayPath) ? execDay() : addBoilerPlate(solutionDayPath);
};

(() => {
  if (+day > 25) {
    console.log(`\x1b[1;91m%s\x1b[0m`, ` !! - Day out of range - !! [1, 25]`);

    return;
  }

  if (+year < 2015 || +year > thisYear) {
    console.log(
      `\x1b[1;91m%s\x1b[0m`,
      ` !! - Year out of range - !! [2015, ${thisYear}]`,
    );

    return;
  }

  if (+year === thisYear && thisMonth < 11) {
    console.log(
      `\x1b[1;91m%s\x1b[0m`,
      ` !! - Date not valid - !! ${thisDay}-${thisMonth}-${thisYear}`,
    );

    return;
  }

  go();
})();
