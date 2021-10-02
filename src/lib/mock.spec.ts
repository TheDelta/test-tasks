import test from 'ava';

import { Vertex } from './lab/vertex.class';
import { mockPointLayers, mockVertexList } from './mock';

test('should return point list of 1x layer with each 1x1', async (t) => {
  const pointList = mockPointLayers();
  t.deepEqual(pointList, [[0, 0, 0]]);
});

test('should return point list of 2x layer with each 1x2', async (t) => {
  const pointList = mockPointLayers(1, 2, 2);
  t.deepEqual(pointList, [
    [0, 0, 0],
    [0, 1, 0],

    [0, 0, 1],
    [0, 1, 1],
  ]);
});

test('should return point list of 3x layer with each 2x3', async (t) => {
  const pointList = mockPointLayers(2, 3, 3);
  t.deepEqual(pointList, [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 2, 0],
    [1, 2, 0],

    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
    [0, 2, 1],
    [1, 2, 1],

    [0, 0, 2],
    [1, 0, 2],
    [0, 1, 2],
    [1, 1, 2],
    [0, 2, 2],
    [1, 2, 2],
  ]);
});

// Vertex List Mock

test('should return vertex list of 1x layer with each 1x1', async (t) => {
  const expected: Vertex[] = [];

  // l1
  expected.push(new Vertex(0, 0, 0));

  const vertexList = mockVertexList(1, 1, 1);
  t.deepEqual(vertexList, expected);
});

test('should return vertex list of 2x layer with each 1x2', async (t) => {
  const expected: Vertex[] = [];

  // l1
  expected.push(new Vertex(0, 0, 0));
  expected[expected.length - 1].neighbors = ['0,1,0', '0,0,1'];
  expected.push(new Vertex(0, 1, 0));
  expected[expected.length - 1].neighbors = ['0,0,0', '0,1,1'];

  // l2
  expected.push(new Vertex(0, 0, 1));
  expected[expected.length - 1].neighbors = ['0,1,1', '0,0,0'];
  expected.push(new Vertex(0, 1, 1));
  expected[expected.length - 1].neighbors = ['0,0,1', '0,1,0'];

  const vertexList = mockVertexList(1, 2, 2);
  t.deepEqual(vertexList, expected);
});
