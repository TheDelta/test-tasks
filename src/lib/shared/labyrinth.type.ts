/**
 * Type to represent one Labyrinth
 */
export type LabyrinthData = {
  /**
   * Dimension information of all layers
   */
  dimension: {
    /**
     * Amount of layer
     */
    layers: number;
    /**
     * Length of layer
     */
    length: number;
    /**
     * Width of layer
     */
    width: number;
  };
  /**
   * List of layers
   */
  layers: LabyrinthLayer[];
  /**
   * Layer index where the start is (or undefined if there is none)
   */
  layerSpawn: number | undefined;
  /**
   * Layer index where exits are
   */
  layerExits: number[];
};

/**
 * Type to represent a layer within a {@link LabyrinthData}
 */
export type LabyrinthLayer = {
  /**
   * Fields in this layer
   */
  fields: LabyrinthField[];
  /**
   * Has this layer at least one exit?
   */
  hasExit: boolean;
  /**
   * Has this layer a spawn?
   */
  hasSpawn: boolean;
};

/**
 * Labyrinth point data
 */
export type LabyrinthPointData = {
  /**
   * Points of Labyrinth
   */
  points: LabyrinthPoint[];
  /**
   * Start point of Labyrinth if found
   */
  start: LabyrinthPoint | undefined;
  /**
   * Exits of Labyrinth (multiple possible)
   */
  exits: LabyrinthPoint[];
};

/**
 * Possible Labyrinth field representations ans enum
 */
export enum LabyrinthField {
  START = 'S',
  EXIT = 'E',
  AIR = '.',
  STONE = '#',
}

/**
 * Type to define a position in the Labyrinth
 */
export type LabyrinthPoint = [number, number, number];
