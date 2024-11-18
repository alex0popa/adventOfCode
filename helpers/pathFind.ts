import Heap from "heap-js";
import { Direction } from "./typescript";

export type Neighbor = { key: string; value: number, direction: Direction };
export type Nodes = { [neighbors: string]: Neighbor[] };

type Previous = {
  node: string,
  distance: number,
  sameDirection: number 
};

export class PathFind {
  private nodes: Nodes = {};
  private heuristicEstimates: Record<string, number> = {};
  private previous: Record<string, Previous> = {};
  private visited: Record<string, boolean> = {};
  private queue = new Heap<{ priority: number, node: string }>((a, b) => a.priority - b.priority);
  private startNode: string;
  private endNode: string;

  constructor(startNode: string, endNode: string) {
    this.startNode = startNode;
    this.endNode = endNode;
  }

  addNode(node: string, neighbors: Neighbor[], estimate?: number): void {
    this.nodes[node] = neighbors;

    if(typeof estimate === 'number') {
      this.addHeuristicEstimate(node, estimate);
    }
  }

  private addHeuristicEstimate(node: string, estimate: number) {
    this.heuristicEstimates[node] = estimate;
  }

  private shortestPath() {
    const shortestPath: { [key: string]: number } = {};
    let traceNode = this.endNode;

    while (traceNode !== this.startNode) {
      shortestPath[traceNode] = this.previous[traceNode].distance;
      traceNode = this.previous[traceNode].node;
    }

    shortestPath[this.startNode] = 0;

    return shortestPath;
  }

  private visit(currentNode: string) {
    if (this.visited[currentNode]) return;

    this.visited[currentNode] = true;
    const neighbors = this.nodes[currentNode];

    for (const { key: node, value: distanceToNeighbor } of neighbors) {
      const currentDistance = this.previous[currentNode].distance;
      const totalDistance = currentDistance + distanceToNeighbor;

      if (totalDistance < this.previous[node].distance) {

        this.previous[node] = { 
          ...this.previous[node],
          distance: totalDistance, 
          node: currentNode,
        };
        
        this.queue.add({ 
          priority: totalDistance + (this.heuristicEstimates[node] ?? 0), 
          node
        });
      }
    }
  }

  private dijkstra() {
    for (const node in this.nodes) {
      
      this.previous[node] = {
        distance: Infinity,
        node: '',
        sameDirection: 0
      };
    }

    this.previous[this.startNode].distance = 0;

    this.queue.add({ 
      priority: this.heuristicEstimates[this.startNode] ?? 0,
      node: this.startNode
    });

    let currentNode: string | undefined;

    while (currentNode = this.queue.pop()?.node) {
      if (currentNode === this.endNode) {
        return this.shortestPath();
      }
 
      this.visit(currentNode);      
    }

    throw('No path found');
  }
  
  executeAStar() {
    return this.dijkstra();
  }
  
  log() {
    Object
      .entries(this.nodes)
      .forEach(([key, value]) => {
        console.log(key, ' -> ', JSON.stringify(value))
      });
  }
}