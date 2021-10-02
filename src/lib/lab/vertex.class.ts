import { LabyrinthPoint } from '../shared/labyrinth.type';

/**
 * Map type of key -> vertex|undefined
 */
export type KeyVertexMap = { [key: string]: Vertex | undefined };

/**
 * Class which represents a vertex
 */
export class Vertex {
  /**
   * Helper function to generate a key from point type
   *
   * @param p point array [x, y, z]
   * @returns generated key of point
   */
  public static KeyFromPoint(p: LabyrinthPoint) {
    return p.join(',');
  }

  /**
   * Helper function to build a list of vertex from a point list
   *
   * @param points array of points
   * @returns vertex list which represents the points and includes neighbors for each vertex
   */
  public static buildVertexListFromPoints(points: LabyrinthPoint[]): Vertex[] {
    const list: Vertex[] = [];
    const vertexMap: { [key: string]: Vertex } = {};

    points.forEach(([x, y, z]) => {
      const v = new Vertex(x, y, z);
      vertexMap[v.key] = v;
      list.push(v);
    });

    // get all neighbors for each vertex
    list.forEach((vert, listIndex) => {
      const neighbors: string[] = [];

      // iterate over each axis map
      [0, 1, 2].forEach((axisIndex) => {
        [1, -1].forEach((offset) => {
          // check if the given neighbor is set in the map
          const point = vert.point;
          point[axisIndex] += offset;

          const neighbor = vertexMap[Vertex.KeyFromPoint(point)];
          if (neighbor) {
            neighbors.push(neighbor.key);
          }
        });
      });

      list[listIndex].neighbors = neighbors;
    });

    return list;
  }

  /**
   * Stores x position
   */
  private _x = 0;
  /**
   * Stores y position
   */
  private _y = 0;
  /**
   * Stores z position
   */
  private _z = 0;

  /**
   * Assigned key of node, assigned on creation
   */
  private _key = '0,0,0';

  /**
   * Stores neighbors in key format
   */
  private _neighbors: string[] = [];

  /**
   * Constructor of class
   *
   * @param x X position
   * @param y Y position
   * @param z Z position
   */
  constructor(x = 0, y = 0, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;

    this._key = Vertex.KeyFromPoint([x, y, z]);
  }

  /**
   * @returns Get x position of vertex
   */
  get x(): number {
    return this._x;
  }

  /**
   * @returns Get y position of vertex
   */
  get y(): number {
    return this._y;
  }

  /**
   * @returns Get z position of vertex
   */
  get z(): number {
    return this._z;
  }

  /**
   * Set neighbor keys
   */
  set neighbors(value: string[]) {
    this._neighbors = value;
  }

  /**
   * @returns Get neighbor keys
   */
  get neighbors(): string[] {
    return this._neighbors;
  }

  /**
   * @returns Get point representation of vertex
   */
  get point(): LabyrinthPoint {
    return [this._x, this._y, this._z];
  }

  /**
   * @returns Get key of vertex
   */
  get key(): string {
    return this._key;
  }

  /**
   * Check if Vertex b is the same (key string compare)
   *
   * @param b other vertex
   * @returns True if this and b have the same key, otherwise false
   */
  equals(b: Vertex): boolean {
    return this.key === b.key;
  }
}
