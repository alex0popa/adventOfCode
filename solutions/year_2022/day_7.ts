import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Tree = { [key: string]: number };

const MAX_SIZE = 100000;
const FILESYSTEM_SPACE = 70000000;
const MINIMUM_FREE_SPACE = 30000000;

(async () => {
  const input = (await getInputForDay(__filename)).trim().split('\n');

  const paths: string[] = [];

  const addSizeToPaths = (tree: Tree, size: number) => {
    for (let i = 0, key = paths[i]; i < paths.length; key += '-' + paths[++i]) {
      tree[key] += size;
    }
  };

  const tree = input.reduce<Tree>((tree, line) => {
    const [a, b, c] = line.trim().split(' ');

    `${a} ${b}` === '$ cd'
      ? c === '..'
        ? paths.pop()
        : paths.push(c) && (tree[paths.join('-')] = 0)
      : !isNaN(+a) && addSizeToPaths(tree, +a);

    return tree;
  }, {});

  const freeSpace = FILESYSTEM_SPACE - tree['/'];
  const spaceToFree = MINIMUM_FREE_SPACE - freeSpace;

  const { star1, star2 } = Object.values(tree).reduce(
    ({ star1, star2 }, size) => ({
      star1: size <= MAX_SIZE ? star1 + size : star1,
      star2: size > spaceToFree && size < star2 ? size : star2,
    }),
    { star1: 0, star2: Infinity }
  );

  showTheResult({ star1, star2, path: __filename });
})();
