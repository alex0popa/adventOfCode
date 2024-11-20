import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getGroup = (map: Map<number, number[]>, startNode: number) => {
  let toVisit = [startNode];
  const visited = new Set<number>();

  while (toVisit.length) {
    const node = toVisit.shift();

    if (typeof node !== 'number') continue;

    visited.add(node);

    for (const neighbor of map.get(node)!) {
      if (!visited.has(neighbor)) toVisit.push(neighbor);
    }
  }

  return visited;
};

const getGroups = (map: Map<number, number[]>) => {
  let groups = 0;
  let nodes = Array.from(map.keys());

  while (nodes.length) {
    const group = getGroup(map, nodes[0]);
    groups++;
    nodes = nodes.filter((node) => !group.has(node));
  }

  return groups;
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const map = new Map<number, number[]>();

  for (const line of input) {
    const [node, ...neighbors] = extractNumbers(line);
    map.set(node, neighbors);
  }

  const group = getGroup(map, 0);
  const groups = getGroups(map);

  showTheResult({ star1: group.size, star2: groups, path: __filename });
  console.timeEnd('time');
})();
