/** Get all path of a tree from start node to end node */
export const getRoutes = (
  routes: { [key: string]: string[] },
  start: string,
  end: string,
  visitedCondition = (param: string) => true,
) => {
  const stack: [string, string[]][] = [[start, []]];
  const result: string[][] = [];

  while (stack.length) {
    const [node, visited] = stack.shift()!;

    visitedCondition(node) && visited.push(node);

    node === end
      ? result.push(visited)
      : routes[node].forEach((n) => {
          !visited.includes(n) && stack.push([n, [...visited]]);
        });
  }

  return result;
};

type NodeId = `${number}-${number}`; // row-col
type TreeMap = Map<NodeId, NodeId[]>;

export const countPathsToLeaves = (
  rootId: NodeId,
  tree: TreeMap,
  withDebug = false,
): number => {
  const memo = new Map<NodeId, number>();
  let callCount = 0;

  const recurse = (nodeId: NodeId): number => {
    callCount++;
    withDebug && console.log(`\n📍 Visiting ${nodeId} (call #${callCount})`);
    withDebug &&
      console.log(
        `   Cache before:`,
        Array.from(memo.entries())
          .map(([k, v]) => `${k}:${v}`)
          .join(', ') || 'empty',
      );

    const cached = memo.get(nodeId);
    if (cached !== undefined) {
      withDebug && console.log(`   ✅ HIT! Returning cached: ${cached}`);
      return cached;
    }

    const children = tree.get(nodeId) ?? [];
    withDebug && console.log(`   Children: [${children.join(', ')}]`);

    let result: number;
    if (children.length === 0) {
      result = 1;
      withDebug && console.log(`   🍃 LEAF: result = 1`);
    } else {
      result = 0;

      for (const child of children) {
        result += recurse(child);
      }

      withDebug && console.log(`   🔢 Sum children: ${result}`);
    }

    memo.set(nodeId, result);
    withDebug && console.log(`   💾 CACHED ${nodeId}: ${result}`);
    withDebug &&
      console.log(
        `   Cache after: `,
        Array.from(memo.entries())
          .map(([k, v]) => `${k}:${v}`)
          .join(', '),
      );

    return result;
  };

  const result = recurse(rootId);
  console.log(`\n🎯 FINAL: ${rootId} has ${result} paths to leaves`);
  console.log(
    `📊 Stats: ${callCount} total calls, ${memo.size} unique nodes cached`,
  );

  return result;
};
