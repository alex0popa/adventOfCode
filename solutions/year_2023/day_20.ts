

import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');

  console.log({ input });

  showTheResult({ star1: 'WIP...', star2: 'WIP...', path: __filename });
})();
