import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const day21 = async () => {
  console.time('Part 1 Time');
  const input = await getInputForDay(__filename);

  const Player = (position: number) => ({
    initialPosition: position,
    score: 0,
    position,
    increaseScore(val: number) {
      this.position += val;
      this.position > 10 && (this.position -= 10);
      this.score += this.position;
    },
    reset() {
      this.score = 0;
      this.position = this.initialPosition;
    },
  });

  const Dice = () => ({
    side: 0,
    roled: 0,
    roll() {
      let rollVal = 0;

      for (let rolls = 3; rolls; --rolls) {
        ++this.side > 100 && (this.side = 1);

        rollVal += this.side;
      }

      this.roled += 3;

      return rollVal % 10;
    },
  });

  const positions = input.split('\n').map((l) => +l.slice(-1));
  const player1 = Player(positions[0]);
  const player2 = Player(positions[1]);
  const dice = Dice();

  while (player1.score < 1000 && player2.score < 1000) {
    player1.increaseScore(dice.roll());
    player1.score < 1000 && player2.increaseScore(dice.roll());
  }

  const star1 = dice.roled * Math.min(player1.score, player2.score);
  player1.reset();
  player2.reset();

  console.timeEnd('Part 1 Time');
  console.time('Part 2 Time');

  //create a map of the dice and outcomes, so we done have to calculate it for each dimension
  const diceMap: { [key: string]: number } = {};
  for (let diceOne = 1; diceOne <= 3; diceOne++) {
    for (let diceTwo = 1; diceTwo <= 3; diceTwo++) {
      for (let diceThree = 1; diceThree <= 3; diceThree++) {
        const outcome = diceOne + diceTwo + diceThree;

        if (!diceMap.hasOwnProperty(outcome)) diceMap[outcome] = 0;

        diceMap[outcome]++;
      }
    }
  }

  const outcomes = Object.keys(diceMap).map(Number);
  const maxOutcome = Math.max(...outcomes);
  const minOutcome = Math.min(...outcomes);

  type Player = { score: number; position: number };

  const quantum = (p1: Player, p2: Player, turn = true) => {
    const currPlayer = turn ? p1 : p2;

    if (p1.score >= 21) return 1;
    if (p2.score >= 21) return 0;

    let sum = 0;

    //since created a map of combinations, can easily multiply instead of calculating each one manually
    for (let outcome = minOutcome; outcome <= maxOutcome; outcome++) {
      const oldPos = currPlayer.position;
      const oldScore = currPlayer.score;

      currPlayer.position = ((currPlayer.position - 1 + outcome) % 10) + 1;
      currPlayer.score += currPlayer.position;

      sum += diceMap[outcome] * quantum(p1, p2, !turn);

      currPlayer.position = oldPos;
      currPlayer.score = oldScore;
    }

    return sum;
  };

  const star2 = quantum(player1, player2);

  console.timeEnd('Part 2 Time');

  showTheResult({ star1, star2, path: __filename });
};

day21();
