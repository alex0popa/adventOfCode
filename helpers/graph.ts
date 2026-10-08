/** Get all path of a tree from start node to end node */
export const getRoutes = (
  routes: { [key: string]: string[] },
  start: string,
  end: string,
  visitedCondition = (_param: string) => true,
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

/** Count paths from startId to endId that must visit all requiredNodes (any order).
 * Assumes the graph is acyclic or that all valid paths are finite.
 * Uses DP with a bitmask representing which required nodes have been visited.
 */
export const countPathsBetweenWithRequiredVisits = ({
  startId,
  endId,
  tree,
  requiredNodes,
  withDebug = false,
}: {
  startId: string;
  endId: string;
  tree: Map<string, string[]>;
  requiredNodes: string[];
  withDebug?: boolean;
}) => {
  const requiredIndex = new Map<string, number>();
  requiredNodes.forEach((id, idx) => requiredIndex.set(id, idx));
  const fullMask =
    requiredNodes.length === 0 ? 0 : (1 << requiredNodes.length) - 1;

  const memo = new Map<string, number>(); // key: `${nodeId}|${mask}`
  let callCount = 0;

  const recurse = (nodeId: string, mask: number): number => {
    callCount++;
    withDebug &&
      console.log(
        `\n📍 Visiting ${nodeId} mask=${mask
          .toString(2)
          .padStart(requiredNodes.length, '0')} (call #${callCount})`,
      );
    withDebug &&
      console.log(
        `   Cache keys:`,
        Array.from(memo.keys()).slice(-5).join(', ') || 'empty',
      );

    const key = `${nodeId}|${mask}`;
    const cached = memo.get(key);
    if (cached !== undefined) {
      withDebug && console.log(`   ✅ HIT! Returning cached: ${cached}`);
      return cached;
    }

    let nextMask = mask;
    const idx = requiredIndex.get(nodeId);
    if (idx !== undefined) {
      nextMask = mask | (1 << idx);
      withDebug &&
        console.log(
          `   ⛳ Required node ${nodeId} visited → mask now ${nextMask
            .toString(2)
            .padStart(requiredNodes.length, '0')}`,
        );
    }

    if (nodeId === endId) {
      const result = nextMask === fullMask ? 1 : 0;
      withDebug &&
        console.log(
          `   🎯 Reached end ${endId}. mask=${nextMask
            .toString(2)
            .padStart(requiredNodes.length, '0')} ${
            result ? '✅ ALL MET' : '❌ MISSING'
          }`,
        );
      memo.set(key, result);
      return result;
    }

    const children = tree.get(nodeId) ?? [];
    withDebug && console.log(`   Children: [${children.join(', ')}]`);

    if (children.length === 0) {
      withDebug && console.log(`   🍂 DEAD END (no children, not target): +0`);
      memo.set(key, 0);
      return 0;
    }

    let result = 0;
    for (const child of children) {
      result += recurse(child, nextMask);
    }
    withDebug &&
      console.log(
        `   🔢 Sum children paths to ${endId} with constraints: ${result}`,
      );

    memo.set(key, result);
    withDebug && console.log(`   💾 CACHED ${key}: ${result}`);
    return result;
  };

  const result = recurse(startId, 0);
  console.log(
    `\n🎯 FINAL: ${startId} has ${result} constrained paths to ${endId} (required: [${requiredNodes.join(
      ', ',
    )}])`,
  );
  console.log(
    `📊 Stats: ${callCount} total calls, ${memo.size} memo states cached`,
  );
  return result;
};

export const countPathsBetween = ({
  startId,
  endId,
  tree,
  withDebug = false,
}: {
  startId: string;
  endId: string;
  tree: Map<string, string[]>;
  withDebug?: boolean;
}): number => {
  const memo = new Map<string, number>();
  let callCount = 0;

  const recurse = (nodeId: string): number => {
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

    // If we've reached the target node, count this path
    if (nodeId === endId) {
      withDebug && console.log(`   🎯 TARGET: ${nodeId} === ${endId} → +1`);
      memo.set(nodeId, 1);
      withDebug && console.log(`   💾 CACHED ${nodeId}: 1`);
      return 1;
    }

    const children = tree.get(nodeId) ?? [];
    withDebug && console.log(`   Children: [${children.join(', ')}]`);

    // If not at target and no children, this path does not reach the target
    if (children.length === 0) {
      withDebug && console.log(`   🍂 DEAD END (no children, not target): +0`);
      memo.set(nodeId, 0);
      withDebug && console.log(`   💾 CACHED ${nodeId}: 0`);
      return 0;
    }

    let result = 0;
    for (const child of children) {
      result += recurse(child);
    }
    withDebug && console.log(`   🔢 Sum children paths to ${endId}: ${result}`);

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

  const result = recurse(startId);
  console.log(`\n🎯 FINAL: ${startId} has ${result} paths to ${endId}`);
  console.log(
    `📊 Stats: ${callCount} total calls, ${memo.size} unique nodes cached`,
  );

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
