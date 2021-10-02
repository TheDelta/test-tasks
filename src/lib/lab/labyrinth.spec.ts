import test from 'ava';

import {
  mockLabData,
  mockLabLayers,
  mockPointLayers as mockPointList,
  mockVertexList,
} from '../mock';
import { LabyrinthField } from '../shared/labyrinth.type';

import { buildPointListFromLabyrinthData, printLabyrinth } from './labyrinth';
import { Vertex } from './vertex.class';

test('should return empty pont list for no data', async (t) => {
  const data = mockLabData();

  // point list test
  const pointList = buildPointListFromLabyrinthData(data);
  t.deepEqual(pointList, {
    exits: [],
    start: undefined,
    points: [],
  });

  // vertex test
  t.deepEqual(Vertex.buildVertexListFromPoints(pointList.points), []);
});

test('should return valid vertex & point list for 1x layers of 1x1', async (t) => {
  const data = mockLabData(
    mockLabLayers([
      [[LabyrinthField.AIR]].reduce((combined, row) => combined.concat(row)),
    ]),
    1
  );

  // point list test
  const pointList = buildPointListFromLabyrinthData(data);
  t.deepEqual(pointList, {
    exits: [],
    start: undefined,
    points: mockPointList(1, 1, 1),
  });

  // vertex test
  t.deepEqual(
    Vertex.buildVertexListFromPoints(pointList.points),
    mockVertexList()
  );
});

test('should return valid vertex & point list for 1x layers of 2x2', async (t) => {
  const data = mockLabData(
    mockLabLayers([
      [
        [LabyrinthField.AIR, LabyrinthField.EXIT],
        [LabyrinthField.START, LabyrinthField.AIR],
      ].reduce((combined, row) => combined.concat(row)),
    ]),
    2
  );

  // point list test
  const pointList = buildPointListFromLabyrinthData(data);
  t.deepEqual(pointList, {
    exits: [[1, 0, 0]],
    start: [0, 1, 0],
    points: mockPointList(2, 2, 1),
  });

  // vertex test
  t.deepEqual(
    Vertex.buildVertexListFromPoints(pointList.points),
    mockVertexList(2, 2, 1)
  );
});

test('should return valid vertex & point list for 2x layers of 2x2', async (t) => {
  const data = mockLabData(
    mockLabLayers([
      [
        [LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.START, LabyrinthField.AIR],
      ].reduce((combined, row) => combined.concat(row)),
      [
        [LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.EXIT],
      ].reduce((combined, row) => combined.concat(row)),
    ]),
    2
  );

  // point list test
  const pointList = buildPointListFromLabyrinthData(data);
  t.deepEqual(pointList, {
    exits: [[1, 1, 1]],
    start: [0, 1, 0],
    points: mockPointList(2, 2, 2),
  });

  // vertex test
  t.deepEqual(
    Vertex.buildVertexListFromPoints(pointList.points),
    mockVertexList(2, 2, 2)
  );
});

test('should return valid vertex & point list for 2x layers of 3x3', async (t) => {
  const data = mockLabData(
    mockLabLayers([
      [
        [LabyrinthField.AIR, LabyrinthField.START, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
      ].reduce((combined, row) => combined.concat(row)),
      [
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.EXIT],
      ].reduce((combined, row) => combined.concat(row)),
    ]),
    3
  );

  // point list test
  const pointList = buildPointListFromLabyrinthData(data);
  t.deepEqual(pointList, {
    exits: [[2, 2, 1]],
    start: [1, 0, 0],
    points: mockPointList(3, 3, 2),
  });

  // vertex test
  t.deepEqual(
    Vertex.buildVertexListFromPoints(pointList.points),
    mockVertexList(3, 3, 2)
  );
});

test('should output labyrinth of 2x layers of 3x3', async (t) => {
  const data = mockLabData(
    mockLabLayers([
      [
        [LabyrinthField.AIR, LabyrinthField.START, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
      ].reduce((combined, row) => combined.concat(row)),
      [
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.AIR],
        [LabyrinthField.AIR, LabyrinthField.AIR, LabyrinthField.EXIT],
      ].reduce((combined, row) => combined.concat(row)),
    ]),
    3
  );

  // point list test
  const output = printLabyrinth(data);
  t.is(
    output,
    `.${'S'.cyan}.
...
...

...
...
..${'E'.blue}`
  );
});
