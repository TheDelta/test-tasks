import { BaseCli } from '../base-cli.class';
import {
  dimensionLabelList,
  dimensionLabelShortList,
  dimensionNumberLimits,
} from '../shared/labyrinth.const';
import { LabyrinthData, LabyrinthField } from '../shared/labyrinth.type';

import { dijkstra } from './dijkstra';
import { buildPointListFromLabyrinthData, printLabyrinth } from './labyrinth';
import { Vertex } from './vertex.class';

/**
 * Enum of processing steps for labyrinth
 */
enum LabyrinthProcessingStep {
  /**
   * Dimension processing
   */
  Dimension,
  /**
   * Layer creation processing
   */
  LayerCreation,
}

/**
 * Handle the CLI input and flow
 */
export class LabyrinthCli extends BaseCli {
  /**
   * Current index (active) labData for processing
   */
  private currentLabIndex = 0;
  /**
   * Stores labyrinth data from processing
   */
  private labData: LabyrinthData[] = [];
  /**
   * Current processing step
   */
  private labStep: LabyrinthProcessingStep = LabyrinthProcessingStep.Dimension;

  /**
   * Return current lab which is processed
   *
   * @returns active lab data
   */
  private get currentLab(): LabyrinthData {
    return this.labData[this.currentLabIndex];
  }

  /**
   * Print some interactive instructions
   */
  public printInstructions(): void {
    if (!this.isInteractive) return;

    this.output.push('Labyrinth -- Definition:'.cyan);
    this.output.push(
      `[1] Define the labyrinth dimension as follow: ${dimensionLabelShortList.join(
        ' '
      )}`.yellow
    );
    this.output.push(`- ${dimensionLabelShortList[0]} number of layers`.yellow);
    this.output.push(
      `- ${dimensionLabelShortList[1]} length of labyrinth`.yellow
    );
    this.output.push(
      `- ${dimensionLabelShortList[2]} width of labyrinth`.yellow
    );
  }

  /**
   * Process the given line for Labyrinth task
   *
   * @param line stdin line
   */
  public processLine(line: string): void {
    line = line.trim(); // be forgiving if there are spaces at start / end

    switch (this.labStep) {
      case LabyrinthProcessingStep.Dimension:
        this.handleDimensions(line);
        break;
      case LabyrinthProcessingStep.LayerCreation:
        this.handleLayerCreation(line);
        break;
    }
  }

  /**
   * Validates the lab data for errors
   */
  private validateLabData(): void | never {
    // validate each lab
    this.labData.forEach((lab, labIndex) => {
      if (lab.layers.length !== lab.dimension.layers) {
        throw new Error(
          `Lab #${labIndex + 1} expected layer length (${
            lab.dimension.layers
          }) does not match with given input layers (=${lab.layers.length})!`
        );
      }

      if (lab.layerSpawn === undefined) {
        throw new Error(`Lab #${labIndex + 1} has no start!`);
      }

      if (!lab.layerExits.length) {
        throw new Error(`Lab #${labIndex + 1} has no exit!`);
      }
    });
  }

  /**
   * Does output the labyrinth runs to stdout
   */
  private outputLabyrinthRuns(): void {
    if (this.isInteractive) {
      this.output.push('=== Labyrinths ==='.cyan);
    }

    this.validateLabData();

    // run each lab
    this.labData.forEach((lab) => {
      this.runThroughLab(lab);
    });

    this.isDone = true;
  }

  /**
   * Run through the given labyrinth
   *
   * @param lab the labyrinth to check if we can escape
   */
  private runThroughLab(lab: LabyrinthData): void {
    // create vertex list from fields
    const pointData = buildPointListFromLabyrinthData(lab);
    if (!pointData.start) {
      return; // this should not happen and we silently ignore it (worst case we just print out no success)
    }

    const vertexList = Vertex.buildVertexListFromPoints(pointData.points);

    // run for each exit the shortest path
    const startKey = Vertex.KeyFromPoint(pointData.start);
    const startVertex = vertexList.find((v) => v.key === startKey);
    if (!startVertex) {
      return; // this should not happen and we silently ignore it (worst case we just print out no success)
    }

    // output
    const paths: Vertex[][] = [];
    pointData.exits.forEach((endPoint) => {
      const endKey = Vertex.KeyFromPoint(endPoint);
      const endVertex = vertexList.find((v) => v.key === endKey);
      if (!endVertex) {
        return; // this should not happen and we silently ignore it (worst case we just print out no success)
      }

      paths.push(dijkstra(vertexList, startVertex, endVertex));
    });

    // sort by shortest first
    paths.sort((a, b) => a.length - b.length);

    // in debug, print out the labyrinth path :)
    if (this.isDebug) {
      this.output.push(
        printLabyrinth(lab, paths.length > 0 ? paths[0] : undefined)
      );
    }

    // Output success / failure
    if (paths[0].length) {
      // we have a path, the duration is length of path - 1
      this.output.push(`Entkommen in ${paths[0].length - 1} Minute(n)!`);
    } else {
      this.output.push('Gefangen :-(');
    }
  }

  /**
   * Handles the layer creation of labyrinth
   *
   * @param line cleaned up stdin line
   */
  private handleLayerCreation(line: string): void {
    const lastLayer =
      this.currentLab.layers.length === this.currentLab.dimension.layers;

    const noLayers = !this.currentLab.layers.length;

    if (noLayers || !line.length) {
      // next layer ;)
      if (this.currentLab.layers.length) {
        this.validateCurrentLayerLength();
      }

      if (lastLayer) return;

      this.currentLab.layers.push({
        fields: [],
        hasExit: false,
        hasSpawn: false,
      });
    } else if (/\d \d \d/i.test(line)) {
      if (line === '0 0 0') {
        this.outputLabyrinthRuns();
      } else {
        this.labStep = LabyrinthProcessingStep.Dimension;
        this.currentLabIndex++;
        // TODO validate if the current labyrinth is okay
        this.handleDimensions(line);
      }
      return;
    } else if (lastLayer) {
      this.isCurrentLayerOutOfBound();
    }

    if (noLayers || line.length) {
      this.processLayerLine(line);
    }
  }

  /**
   * Check if the current layer (last index) of active labyrinth exceeds the length
   */
  private validateCurrentLayerLength(): void | never {
    const layer = this.currentLab.layers[this.currentLab.layers.length - 1];
    // validate the layer
    const length = layer.fields.length / this.currentLab.dimension.width;
    if (length !== this.currentLab.dimension.length) {
      throw new Error(
        `Invalid layer length of ${length} (should be ${this.currentLab.dimension.length})!`
      );
    }
  }

  /**
   * Check if the current layer (last index) of active labyrinth has too many fields
   */
  private isCurrentLayerOutOfBound(): void | never {
    const fieldCount =
      this.currentLab.layers[this.currentLab.layers.length - 1].fields.length;
    const expectedFieldCount =
      this.currentLab.dimension.width * this.currentLab.dimension.length;
    if (fieldCount > expectedFieldCount) {
      throw new Error(
        'Invalid new layer! All layers are done and 0 0 0 or a new labyrinth definition was expected!'
      );
    }
  }

  /**
   * Process the line finally for layer processing
   *
   * @param line input line with prior cleanup and validation
   */
  private processLayerLine(line: string): void {
    if (line.length !== this.currentLab.dimension.width) {
      // is the labyrinth definition not the expected width?
      throw new Error(
        `Invalid line length found (${line.length}, expected: ${this.currentLab.dimension.width}). Cant build a labyrinth!`
      );
    }

    // we can uppercase it
    line = line.toUpperCase();

    const layer = this.currentLab.layers[this.currentLab.layers.length - 1];
    for (const char of line) {
      switch (char) {
        case LabyrinthField.START:
          {
            if (layer.hasSpawn || this.currentLab.layerSpawn !== undefined) {
              throw new Error('Labyrinth has multiple Start positions!');
            }
            layer.hasSpawn = true;
            this.currentLab.layerSpawn = this.currentLab.layers.length;
          }
          break;
        case LabyrinthField.EXIT:
          {
            // register this layer as exit once
            if (!layer.hasExit) {
              this.currentLab.layerExits.push(this.currentLab.layers.length);
            }
            layer.hasExit = true;
          }
          break;
        case LabyrinthField.STONE:
        case LabyrinthField.AIR:
          // noting to do, just pass it
          break;
        default:
          throw new Error(`Invalid char "${char}" for labyrinth found!`);
      }
      layer.fields.push(char as LabyrinthField);
    }
    this.currentLab.layers[this.currentLab.layers.length - 1] = layer;
  }

  /**
   * Handle the dimension input
   *
   * @param line input line with prior cleanup and validation
   */
  private handleDimensions(line: string): void {
    const splitted = line.split(' ', 3);
    const LRC = dimensionLabelShortList.join(' ');

    if (splitted.length != 3) {
      this.output.push(
        `Invalid dimension (${line}), use ${LRC}, like 5 4 4`.red
      );
      return;
    }

    const dimension = splitted.map((d) => +d); // numeric
    const invalidIndex = dimension.findIndex(
      (d, i) =>
        isNaN(+d) ||
        +d < dimensionNumberLimits[i][0] ||
        +d > dimensionNumberLimits[i][1]
    );
    if (invalidIndex > -1) {
      const label = dimensionLabelList[invalidIndex];
      const labelShort = dimensionLabelShortList[invalidIndex];
      const limit = dimensionNumberLimits[invalidIndex];
      throw new Error(
        `Invalid number for ${labelShort} (${label}), must be number between ${limit[0]} and ${limit[1]}`
      );
    }

    this.labData[this.currentLabIndex] = {
      dimension: {
        layers: dimension[0],
        length: dimension[1],
        width: dimension[2],
      },
      layers: [],
      layerExits: [],
      layerSpawn: undefined,
    };
    this.labStep = LabyrinthProcessingStep.LayerCreation;

    if (this.isInteractive) {
      this.output.push(
        `Great! Now define ${dimension[0]} layers, by using the following structure:`
          .cyan
      );
      this.output.push(
        `- One of the layers must have an S for start position`.yellow
      );
      this.output.push(
        `- One of the layers must have at least one E for start position. (in theory multiple are possible)`
          .yellow
      );
      this.output.push(
        `- Use # for stone (not passable) or . for air (passable)`.yellow
      );
      this.output.push(`- Use 0 0 0 to finish up the labyrinth`.yellow);
      this.output.push(
        `Note you can continue to create a new labyrinth if you do not use 0 0 0 and instead a new ${LRC} line`
          .yellow
      );
    }
  }
}
