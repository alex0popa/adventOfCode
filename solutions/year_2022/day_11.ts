import { extractNumbers, getLcm } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Op = '+' | '*';
type Test = { value: number; true: number; false: number };

class Monkey {
  divide = 3;
  inspectedItems = 0;
  items: number[];
  op: Op;
  opValue: string | 'old';
  test: Test;

  constructor(op: Op, opValue: string, test: Test, items: number[]) {
    this.op = op;
    this.opValue = opValue;
    this.test = test;
    this.items = items;
  }

  inspect(monkeys: Monkey[], lcm?: number) {
    const isPartTwo = typeof lcm === 'number';

    this.inspectedItems += this.items.length;

    this.items.forEach((old) => {
      const opValue = this.opValue === 'old' ? old : +this.opValue;

      let item = this.op === '+' ? old + opValue : old * opValue;

      item = isPartTwo ? item % lcm : Math.floor(item / this.divide);

      const idx = !(item % this.test.value) ? this.test.true : this.test.false;

      const targetMonkey = monkeys[idx];

      targetMonkey.addItem(item);
    });

    this.items = [];
  }

  addItem(item: number) {
    this.items.push(item);
  }
}

const PART_1_ROUNDS = 20;
const PART_2_ROUNDS = 10000;

const getResults = (monkeysList: Monkey[][]) =>
  monkeysList.map((monkeys) =>
    monkeys
      .sort((a, b) => a.inspectedItems - b.inspectedItems)
      .slice(-2)
      .reduce((prod, b) => prod * b.inspectedItems, 1)
  );

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const monkeys1: Monkey[] = [];
  const monkeys2: Monkey[] = [];

  for (let i = 0; i < input.length; i += 7) {
    const items = extractNumbers(input[i + 1]);
    const [op, opValue] = input[i + 2].split('old ')[1].split(' ');
    const test: Test = {
      value: extractNumbers(input[i + 3])[0],
      true: extractNumbers(input[i + 4])[0],
      false: extractNumbers(input[i + 5])[0],
    };

    monkeys1.push(new Monkey(op as Op, opValue, { ...test }, [...items]));
    monkeys2.push(new Monkey(op as Op, opValue, { ...test }, [...items]));
  }

  /**
   * Part Two
   *
   * Performing operations (+, *) on normal numbers, the values ​​will reach
   * extremely high values ​​that cannot be held in a variable of type int or
   * bigint, so the solution is to use Least Common Multiple - lcm.
   */
  const lcmItems: number[] = monkeys1.map(({ test: { value } }) => value);
  const lcm = getLcm(lcmItems);

  for (let i = 0; i < PART_2_ROUNDS; ++i) {
    // Part One
    i < PART_1_ROUNDS && monkeys1.forEach((monkey) => monkey.inspect(monkeys1));

    // Part Two
    monkeys2.forEach((monkey) => monkey.inspect(monkeys2, lcm));
  }

  const [star1, star2] = getResults([monkeys1, monkeys2]);

  showTheResult({ star1, star2, path: __filename });
})();
