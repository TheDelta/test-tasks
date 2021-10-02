import { KeyVertexMap, Vertex } from './vertex.class';

/**
 * Map type to store key -> distance
 */
type KeyDistanceMap = { [key: string]: number };

/**
 * Basic Dijkstra (short path) algorithm
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 *
 * @param vertexList list of vertex (nodes)
 * @param start position to start from
 * @param target end position to get path from
 * @returns Shortest path or empty array if not found
 */
export function dijkstra(
  vertexList: Vertex[],
  start: Vertex,
  target: Vertex
): Vertex[] {
  const dist: KeyDistanceMap = {};
  const prev: KeyVertexMap = {};

  const queue = [...vertexList];

  // sanity checks
  if (
    !queue.find((v) => v.equals(start)) ||
    !queue.find((v) => v.equals(target))
  ) {
    return []; // start or end is not in list, stop it right there
  }

  queue.forEach((v) => {
    dist[v.key] = Infinity;
    prev[v.key] = undefined;
  });

  dist[start.key] = 0;

  // iterate over vertex list
  while (queue.length) {
    const queueListIndex = get_next_queue_vertex(queue, dist);

    // ...and remove it from list
    const current = queue.splice(queueListIndex, 1)[0];

    if (target.equals(current)) {
      return build_shortest_path(start, target, prev);
    }

    current.neighbors.forEach((key) => {
      const neighbor = queue.find((v) => v.key === key);
      if (!neighbor) return;

      const distance = get_distance_to_neighbor(current, neighbor, dist);
      if (distance >= dist[neighbor.key]) {
        return; // next
      }

      dist[neighbor.key] = distance;
      prev[neighbor.key] = current;
    });
  }

  return []; // no shortest path available :(
}

/**
 * Helper Function for {@link dijkstra} function to check if the neighbor is the shortest
 *
 * @param current current vertex, which has neighbors
 * @param _neighbor the neighbor of vertex
 * @param dist the current distance map from {@link dijkstra}
 * @returns distance if it is smaller, otherwise false
 */
function get_distance_to_neighbor(
  current: Vertex,
  _neighbor: Vertex,
  dist: KeyDistanceMap
): number {
  // ! atm distance is always +1
  return dist[current.key] + 1;
}

/**
 * Helper Function for {@link dijkstra} function to get the next vertex of queue
 *
 * @param queue vertex queue
 * @param dist map of distances
 * @returns index of next queue node or -1 if not found (only if queue is empty!)
 */
function get_next_queue_vertex(queue: Vertex[], dist: KeyDistanceMap): number {
  let queueListIndex = -1;
  queue.forEach((v, i) => {
    if (
      queueListIndex === -1 ||
      dist[v.key] < dist[queue[queueListIndex].key]
    ) {
      queueListIndex = i;
    }
  });
  return queueListIndex;
}

/**
 * Helper function to build the path from the previous Vertex list of {@link dijkstra}
 *
 * @param start start position
 * @param target end position
 * @param prev previous vertex list, generated in {@link dijkstra}
 * @returns the shortest path from start to target or empty array if impossible
 */
function build_shortest_path(
  start: Vertex,
  target: Vertex,
  prev: KeyVertexMap
) {
  const path: Vertex[] = [];
  if (prev[target.key] || target.equals(start)) {
    let u: Vertex | undefined = target;
    while (u) {
      path.splice(0, 0, u);
      u = prev[u.key];
    }
  }

  return path;
}
