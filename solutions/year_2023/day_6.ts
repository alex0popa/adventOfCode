
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import {extractNumbers} from '../../helpers/general';

const getWays = (recordDistance: number, time: number) => {
  let ways = 0;

  for (let speed = 0; speed <= time; ++speed) {
    const raceDistance = speed * (time - speed);

    if(raceDistance > recordDistance) ++ways;
  }

  return ways;
}

(async () =>  {
  const [times, distances] = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  const star1 = times.reduce((prod, time, idx) => {
    const recordDistance = distances[idx];
    const ways = getWays(recordDistance, time)

    return prod * ways;
  }, 1);

  const time = +times.join('');
  const recordDistance = +distances.join('');
  const star2 = getWays(recordDistance, time);

  showTheResult({ star1, star2, path: __filename });
})();
