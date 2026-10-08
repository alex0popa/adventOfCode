// -- DISCLAIMER -- //
// Solved by Hermes AI Agent

import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import { extractNumbers } from '../../helpers/string';

class UnionFind {
  private parent: number[];
  private size: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return;

    // Union by size
    if (this.size[rootX] < this.size[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    }
  }

  getAllComponentSizes(): number[] {
    const roots = new Set<number>();
    for (let i = 0; i < this.parent.length; i++) {
      roots.add(this.find(i));
    }
    return Array.from(roots).map((root) => this.size[root]);
  }
}

(async () => {
  console.time('time');
  const MAX_CONNECTIONS = 1000;
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map(extractNumbers);

  // Generate all pairs with distances
  const distances: { i: number; j: number; dist: number }[] = [];
  for (let i = 0; i < input.length - 1; i++) {
    const [x1, y1, z1] = input[i];

    for (let j = i + 1; j < input.length; j++) {
      const [x2, y2, z2] = input[j];
      const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
      distances.push({ i, j, dist });
    }
  }

  // Sort by distance ascending and take first 1000 connections
  distances.sort((a, b) => a.dist - b.dist);

  // Union-Find for Part One (first 1000 connections)
  const uf = new UnionFind(input.length);
  for (let k = 0; k < MAX_CONNECTIONS && k < distances.length; k++) {
    const { i, j } = distances[k];
    uf.union(i, j);
  }

  // Part One: multiply sizes of 3 largest circuits
  const sizes = uf.getAllComponentSizes().sort((a, b) => b - a);
  const result = sizes.slice(0, 3).reduce((acc, size) => acc * size, 1);

  // Part Two: continue connecting until single component
  // Find last two boxes connected
  let lastI = -1;
  let lastJ = -1;
  const uf2 = new UnionFind(input.length);
  let components = input.length;

  for (const edge of distances) {
    const { i, j } = edge;
    if (uf2.find(i) !== uf2.find(j)) {
      uf2.union(i, j);
      components--;
      lastI = i;
      lastJ = j;
      if (components === 1) break;
    }
  }

  const star2 = input[lastI][0] * input[lastJ][0]; // X coordinates product

  console.log(result);
  console.log(star2);

  showTheResult({
    star1: result.toString(),
    star2: star2.toString(),
    path: __filename,
  });

  console.timeEnd('time');
})();
