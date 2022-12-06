import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Close = { '(': ')'; '[': ']'; '{': '}'; '<': '>' };
type Points = { ')': number; ']': number; '}': number; '>': number };

const OPEN = '([{<';
const CLOSE: Close = { '(': ')', '[': ']', '{': '}', '<': '>' };
const POINTS1: Points = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const POINTS2: Points = { ')': 1, ']': 2, '}': 3, '>': 4 };

const day10 = async () => {
  let star1 = 0;
  let scores: number[] = [];

  (await getInputForDay(__filename))
    .split('\n')
    .map((chunk) => chunk.split(''))
    .forEach((chunk) => {
      const opened: string[] = [];
      let isIncomplete = true;

      chunk.forEach((character) => {
        if (OPEN.includes(character)) {
          opened.push(CLOSE[character as keyof Close]);
        } else if (character !== opened.pop()) {
          star1 += POINTS1[character as keyof Points];
          isIncomplete = false;
          return;
        }
      });

      isIncomplete &&
        scores.push(
          opened
            .reverse()
            .reduce((a, c) => a * 5 + POINTS2[c as keyof Points], 0)
        );
    });

  const star2 = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];

  showTheResult({ star1, star2, path: __filename });
};

day10();
