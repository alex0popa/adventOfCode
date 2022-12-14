import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n\n');

  type Packet = number | Array<any>;

  const compare = (left: Packet, right: Packet): number => {
    if (typeof left === 'number') {
      if (typeof right === 'number') {
        return left - right;
      } else {
        return compare([left], right);
      }
    } else if (typeof right === 'number') {
      return compare(left, [right]);
    }

    for (let i = 0; i < Math.min(left.length, right.length); ++i) {
      const res = compare(left[i], right[i]);

      if (res) {
        return res;
      }
    }

    return left.length - right.length;
  };

  const star1 = input
    .map((line) => line.split('\n').map((str) => JSON.parse(str)) as Packet[])
    .reduce(
      (res, [left, right], i) => (compare(left, right) < 0 ? ++res + i : res),
      0
    );

  const dividerPackets = ['[[2]]', '[[6]]'];

  const star2 = [...input, dividerPackets.join('\n')]
    .map((line) => line.split('\n'))
    .flat()
    .sort((left, right) => compare(JSON.parse(left), JSON.parse(right)))
    .reduce(
      (res, line, i) => (dividerPackets.includes(line) ? res * (i + 1) : res),
      1
    );

  showTheResult({ star1, star2, path: __filename });
})();
