import colors from 'colors';

import {
  LabyrinthData,
  LabyrinthField,
  LabyrinthPoint,
  LabyrinthPointData,
} from '../shared/labyrinth.type';

import { Vertex } from './vertex.class';

/**
 * Function to build the point list based on {@link LabyrinthData}
 *
 * @param data data generated through input
 * @returns Walkable points, start and (multiple) exits position
 */
export function buildPointListFromLabyrinthData(
  data: LabyrinthData
): LabyrinthPointData {
  const points: LabyrinthPoint[] = [];
  const exits: LabyrinthPoint[] = [];
  let start: LabyrinthPoint | undefined = undefined;
  const width = data.dimension.width;

  // go through each layer...
  data.layers.forEach((layer, z) => {
    layer.fields.forEach((field, index) => {
      switch (field) {
        case LabyrinthField.START:
        case LabyrinthField.EXIT:
        case LabyrinthField.AIR:
          {
            // ... and generate for walkable fields the x,y,z position
            points.push([index % width, Math.floor(index / width), z]);

            if (field === LabyrinthField.START) {
              // this layer has a start position
              start = points[points.length - 1];
            } else if (field === LabyrinthField.EXIT) {
              // this layer has a exit position
              exits.push(points[points.length - 1]);
            }
          }
          break;
        default:
          return; // no walkable node
      }
    });
  });

  return { points, start, exits };
}

/**
 * Debug function to print out the generated labyrinth with optional path to exit
 *
 * @param data labyrinth data to generate lab output
 * @param path optional path which will be displayed in green
 * @returns the output as string, ready for print
 */
export function printLabyrinth(data: LabyrinthData, path?: Vertex[]): string {
  let output = '';

  const pathKeyList = path?.map((p) => p.key);

  data.layers.forEach((l, z) => {
    const isLastLayer = z === data.layers.length - 1;
    l.fields.forEach((f, i) => {
      const x = i % data.dimension.width;
      const y = Math.floor(i / data.dimension.width);

      const isLastField = i === l.fields.length - 1;
      const isLastInWidth = x === data.dimension.width - 1;

      const inPath =
        pathKeyList && pathKeyList.includes(Vertex.KeyFromPoint([x, y, z]));
      if (inPath) {
        output += colors.green(f);
      } else {
        switch (f) {
          case LabyrinthField.EXIT:
            output += colors.blue(f);
            break;
          case LabyrinthField.START:
            output += colors.cyan(f);
            break;
          case LabyrinthField.STONE:
            output += colors.gray(f);
            break;
          default:
            output += f;
        }
      }

      if ((!isLastLayer || !isLastField) && isLastInWidth) {
        output += '\n';
      }
    });
    if (!isLastLayer) output += '\n';
  });

  return output;
}
