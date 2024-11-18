import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

enum XmasKey {
  x = 'x',
  m = 'm',
  a = 'a',
  s = 's',
}

type X_Mas = { [key in XmasKey]: number };

type X_MasRange = { [key in XmasKey]: [number, number] };

const SEPARATOR = ' -> ' as const;

const testInput = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;


class ParteOne {
  private ratings: X_Mas[];
  private workflows: Map<string, string>;
  private star = 0;
  private key = 'in';
  private isAcceptedOrRejected = false;

  constructor(ratings: X_Mas[], workflows: Map<string, string>) {
    this.ratings = ratings;
    this.workflows = workflows;
  }

  private checkNextKey(nextKey: string, { x, m, a, s }: X_Mas) {
    if (['A', 'R'].includes(nextKey)) {
      this.isAcceptedOrRejected = true;

      if (nextKey === 'A') this.star += (x + m + a + s);

      return;
    }

    this.key = nextKey;
  }

  private execute() {
    for (const rating of this.ratings) {
      this.key = 'in';
      this.isAcceptedOrRejected = false;

      while (!this.isAcceptedOrRejected) {
        const workflow = this.workflows.get(this.key)!;
        const rules = workflow.split(',');

        for (let i = 0; i < rules.length; ++i) {
          const rule = rules[i];

          if (rule.includes('<')) {
            const [part, rest] = rule.split('<') as [XmasKey, string];
            const [value, nextKey] = rest.split(':');

            if (rating[part] < +value) {
              this.checkNextKey(nextKey, rating);

              break;
            }

            continue;
          }

          if (rule.includes('>')) {
            const [part, rest] = rule.split('>') as [XmasKey, string];
            const [value, nextKey] = rest.split(':');

            if (rating[part] > +value) {
              this.checkNextKey(nextKey, rating);

              break;
            }

            continue;
          }

          this.checkNextKey(rule, rating);

          break;
        }
      }
    }
  }

  getStar() {
    this.execute();

    return this.star;
  }
}

const parseInput = (input: string[]) => {
  const workflows = new Map<string, string>();
  const ratings: X_Mas[] = [];

  for (const line of input) {
    if (line.length) {
      if (line.startsWith('{x=')) {
        const xMas = line.slice(1, -1).split(',').reduce<X_Mas>((obj, part) => {
          const [key, value] = part.split('=') as [XmasKey, string];

          return { ...obj, [key]: +value };
        }, { x: 0, m: 0, a: 0, s: 0 });

        ratings.push(xMas)
      } else {
        const [key, value] = line.split('{');

        workflows.set(key, value.slice(0, -1));
      }
    }
  }

  return { ratings, workflows };
}

class PartTwo {
  private workflows: Map<string, string>;
  private map: { [key: string]: string[] } = {};
  private paths: string[] = [];
  private star = 0;

  constructor(workflows: Map<string, string>) {
    this.workflows = workflows;
  }

  private getPaths(tail = ['in'], paths: string[] = [], path = ['in']) {
    const currentNode = tail.shift()!;
    const neighbors = this.map[currentNode];

    for (const neighbor of neighbors) {
      path.push(neighbor);

      if (!['A', 'R'].includes(neighbor)) {
        tail.push(neighbor);

        this.getPaths(tail, paths, path);

      } else if (neighbor === 'A') {
        paths.push(path.join(SEPARATOR));
      }

      path.pop();
    }

    if (!tail.length) {
      this.paths = paths;
    };
  }

  private handleNextKey(key: string, nextKey: string) {
    this.map[key].push(nextKey);

    !(['A', 'R'].includes(nextKey)) && this.addKey(nextKey);
  }


  private addKey(key: string) {
    if (!this.map[key]) {
      this.map[key] = []
    }

    const workflow = this.workflows.get(key)!;
    const rules = workflow.split(',');

    for (let i = 0; i < rules.length; ++i) {
      const rule = rules[i];

      if (rule.includes('<')) {
        const [, rest] = rule.split('<') as [XmasKey, string];
        const [, nextKey] = rest.split(':');


        this.handleNextKey(key, nextKey);
      } else if (rule.includes('>')) {
        const [, rest] = rule.split('>') as [XmasKey, string];
        const [, nextKey] = rest.split(':');

        this.handleNextKey(key, nextKey);
      } else {
        this.handleNextKey(key, rule);
      }
    }
  }

  private computeStar() {
    this.paths.forEach(path => {
      const ranges = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
      const keys = path.split(SEPARATOR);

      for (let i = 0; i < keys.length - 1; ++i) {
        const workflow = this.workflows.get(keys[i])!;
        const rules = workflow.split(',');
        const nextKey = keys[i + 1];
        const ruleIdx = rules.findIndex(actualRule => {

          return actualRule.includes(nextKey)
        });


        if (ruleIdx > -1) {
          for (let i = 0; i < ruleIdx; ++i) {
            const rule = rules[i];

            if (rule.includes('<')) {
              const [part, rest] = rule.split('<') as [XmasKey, string];
              const [value, nextKey] = rest.split(':');
              const [min, max] = ranges[part];

              ranges[part] = [Math.max(min, +value), max];

            } else if (rule.includes('>')) {
              const [part, rest] = rule.split('>') as [XmasKey, string];
              const [value, nextKey] = rest.split(':');
              const [min, max] = ranges[part];


              ranges[part] = [min, Math.min(max, +value)];


            }
          }

          const rule = rules[ruleIdx];

          if (rule.includes('<')) {
            const [part, rest] = rule.split('<') as [XmasKey, string];
            const [value, nextKey] = rest.split(':');
            const [min, max] = ranges[part];


            ranges[part] = [min, Math.min(max, +value - 1)];


          } else if (rule.includes('>')) {
            const [part, rest] = rule.split('>') as [XmasKey, string];
            const [value, nextKey] = rest.split(':');
            const [min, max] = ranges[part];


            ranges[part] = [Math.max(min, +value + 1), max];


          }


        }
      };

      const prod = Object.values(ranges).reduce((prod, [min, max]) => {
        return prod *= ((max - min) + 1);
      }, 1);

      this.star += prod;
    });
  }

  private execute() {
    this.addKey('in');
    this.getPaths();
    this.computeStar();
  }

  getStar() {
    this.execute();

    return this.star;
  }
}

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  // const input = testInput.trim().split('\n');

  const { ratings, workflows } = parseInput(input);

  const partOne = new ParteOne(ratings, workflows);
  const star1 = partOne.getStar();

  const partTwo = new PartTwo(workflows);
  const star2 = partTwo.getStar();

  showTheResult({ star1, star2: 'WIP...', path: __filename });
})();


// 725976000000000
// 342133200000000
// 327346481868000
// 167409079868000
// 177215671868000
