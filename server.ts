import { existsSync, writeFile } from 'fs';
import { exec } from 'child_process';
import { getPuzzle } from './helpers/getPuzzle';

const day = process.argv[2] ?? new Date().getDate().toString();
const year = process.argv[3] ?? new Date().getFullYear().toString();

const BOILERPLATE = `

import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\\n');

  console.log({ input });

  showTheResult({ star1: 'WIP...', star2: 'WIP...', path: __filename });
})();
`;

const execDay = () =>
  exec(
    `ts-node solutions/year_${year}/day_${day}.ts`,
    (error, stdout, stderr) => {
      console.log(`\x1b[1;95m%s\x1b[0m`, stdout);
      console.log(stderr);

      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    }
  );

const addBoilerPlate = () =>
  writeFile(`solutions/year_${year}/day_${day}.ts`, BOILERPLATE, execDay);

const go = async () => {
  const finalPath = `/year_${year}/day_${day}`;

  !existsSync(`inputs${finalPath}.in`) && (await getPuzzle(+day, +year));

  existsSync(`solutions${finalPath}.ts`) ? execDay() : addBoilerPlate();
};

+day > 25
  ? console.log(`\x1b[1;91m%s\x1b[0m`, ` !! - Day out of range - !! [1, 25]`)
  : +year < 2015 || +year > new Date().getFullYear()
  ? console.log(
      `\x1b[1;91m%s\x1b[0m`,
      ` !! - Year out of range - !! [2015, ${new Date().getFullYear()}]`
    )
  : go();
