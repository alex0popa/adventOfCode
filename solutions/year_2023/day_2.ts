import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

enum Color { blue = 'blue', green = 'green', red = 'red' };

type GameSet = [Color, number];

const POSSIBLE_CUBES = { 
  [Color.blue]: 14, 
  [Color.green]: 13, 
  [Color.red]: 12
} as const;

const extractDataStructure = (games: string[]) => games.map((game) => {
  const [gameInfo, sets] = game.split(': ');
  const gameId = extractNumbers(gameInfo)[0];
  const gameSets = sets
    .split(';')
    .join(',')
    .split(', ')
    .map<GameSet>((set) => {
      const [cubesNumber, cubesColor] = set.split(' ') as [string, Color];

      return [cubesColor, +cubesNumber]; 
    });

  return { gameId, gameSets };
});

const isPossibleGame = (gameSets: GameSet[]) => gameSets.every(
  ([color, value]) => POSSIBLE_CUBES[color] >= value
);

const getPower = (gameSets: GameSet[]) => {
  const colorsMap = {
    [Color.blue]: 0,
    [Color.green]: 0,
    [Color.red]: 0
  };

  for (const [color, value] of gameSets) {
    if(colorsMap[color] < value) colorsMap[color] = value;
  }

  const [blue, green, red] = Object.values(colorsMap);

  return blue * green * red;
};

(async () =>  {
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const records = extractDataStructure(input);
  let star1 = 0, star2 = 0;

  for (const { gameId, gameSets } of records) {
    if (isPossibleGame(gameSets)) star1 += gameId;

    star2 += getPower(gameSets);
  }

  showTheResult({ star1, star2, path: __filename });
})();
