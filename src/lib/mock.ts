import { Vertex } from './lab/vertex.class';
import {
  LabyrinthData,
  LabyrinthField,
  LabyrinthLayer,
  LabyrinthPoint,
} from './shared/labyrinth.type';

/**
 * Mock helper function to create {@link LabyrinthData} based on VALID input layers
 *
 * @param layers valid layers to create mock of
 * @param layerWidth the width of the layer (must be valid with data to get the correct length)
 * @returns mocked {@link LabyrinthData}
 */
export function mockLabData(
  layers: LabyrinthLayer[] = [],
  layerWidth = 0
): LabyrinthData {
  let length = 0;
  const layerExits: number[] = [];
  let layerSpawn: number | undefined = undefined;
  if (layers.length) {
    if (layerWidth > 0) {
      length = Math.floor(layers[0].fields.length / layerWidth);
    }
    layers.forEach((l, i) => {
      if (l.hasExit) {
        layerExits.push(i);
      }
      if (l.hasSpawn) {
        layerSpawn = i;
      }
    });
  }

  return {
    dimension: { layers: layers.length, length, width: layerWidth },
    layerExits,
    layerSpawn,
    layers: layers,
  };
}

/**
 * Mock helper function to create a layer from fields
 *
 * @param fields the fields (width x length) of the layer
 * @returns a mocked {@link LabyrinthLayer}
 */
export function mockLabLayer(fields: LabyrinthField[]): LabyrinthLayer {
  return {
    fields,
    hasExit: !!fields.find((f) => f === LabyrinthField.EXIT),
    hasSpawn: !!fields.find((f) => f === LabyrinthField.START),
  };
}

/**
 * Mock helper function to create multiple layers from fields array
 *
 * @param fields multi dimensional array of fields
 * @returns mocked {@link LabyrinthLayer} layers
 */
export function mockLabLayers(fields: LabyrinthField[][]): LabyrinthLayer[] {
  return fields.map((l) => mockLabLayer(l));
}

/**
 * Create a point list based on input params
 *
 * @param width width of each layer
 * @param length length of each layer
 * @param layers how many layers
 * @returns returns point list
 */
export function mockPointLayers(
  width = 1,
  length = 1,
  layers = 1
): LabyrinthPoint[] {
  const list: LabyrinthPoint[] = [];

  for (let z = 0; z < layers; z++) {
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < width; x++) {
        list.push([x, y, z]);
      }
    }
  }

  return list;
}

/**
 * Create a point list based on input params
 *
 * @param width width of each layer
 * @param length length of each layer
 * @param layers how many layers
 * @returns returns point list
 */
export function mockVertexList(width = 1, length = 1, layers = 1): Vertex[] {
  const list: Vertex[] = [];
  const vertexMap: { [key: string]: Vertex } = {};

  for (let z = 0; z < layers; z++) {
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < width; x++) {
        const v = new Vertex(x, y, z);
        vertexMap[v.key] = v;
        list.push(v);
      }
    }
  }

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
 * Example of readme for testing purpose
 */
export const mockExampleLabyrinth = `3 4 5
S....
.###.
.##..
###.#

#####
#####
##.##
##...

#####
#####
#.###
####E

1 3 3
S##
#E#
###

0 0 0`;
