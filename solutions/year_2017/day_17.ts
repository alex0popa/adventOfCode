import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const [AOC_YEAR] = extractNumbers(__filename);
const FIFTY_MILLIONS = 5 * 10 ** 7;

(async () => {
  console.time('time');
  const skip = +(await getInputForDay(__filename)).trim().split('\n')[0];

  let buffer: number[] = [0];
  let position = 0;

  while (buffer.length - 1 < AOC_YEAR) {
    position = (position + skip) % buffer.length;

    // add new value (actual buffer length) on next position
    ++position;

    buffer = [
      ...buffer.slice(0, position),
      buffer.length,
      ...buffer.slice(position),
    ];
  }

  const star1 = buffer[position + 1];

  position = 0;
  let valueOfPosition1 = 0;

  /**
   * What is the value after 0 the moment FIFTY_MILLIONS?
   *
   * update only the position 1, is the value after 0
   */
  for (let bufferLength = 1; bufferLength <= FIFTY_MILLIONS; ++bufferLength) {
    position = ((position + skip) % bufferLength) + 1;

    if (position === 1) valueOfPosition1 = bufferLength;
  }

  showTheResult({ star1, star2: valueOfPosition1, path: __filename });
  console.timeEnd('time');
})();
