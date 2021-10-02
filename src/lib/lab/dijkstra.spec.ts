import test from 'ava';

import { mockVertexList } from '../mock';

import { dijkstra } from './dijkstra';
import { Vertex } from './vertex.class';

test('should find shortest path in same layer', (t) => {
  const vertexList = mockVertexList(3, 3, 3);
  const path = dijkstra(vertexList, new Vertex(0, 0, 0), new Vertex(2, 0, 0));

  t.deepEqual(
    path.map((v) => v.key),
    ['0,0,0', '1,0,0', '2,0,0']
  );
});

test('should find shortest path through multiple layers', (t) => {
  const vertexList = mockVertexList(3, 3, 3);
  const path = dijkstra(vertexList, new Vertex(0, 0, 0), new Vertex(2, 2, 2));

  t.deepEqual(
    path.map((v) => v.key),
    ['0,0,0', '1,0,0', '2,0,0', '2,1,0', '2,2,0', '2,2,1', '2,2,2']
  );
});

test('should find no path if exit is out of layer', (t) => {
  const vertexList = mockVertexList(3, 3, 3);
  const path = dijkstra(vertexList, new Vertex(0, 0, 0), new Vertex(5, 5, 5));

  t.deepEqual(
    path.map((v) => v.key),
    []
  );
});

test('should find no path if start is out of layer', (t) => {
  const vertexList = mockVertexList(3, 3, 3);

  const path = dijkstra(vertexList, new Vertex(5, 5, 5), new Vertex(2, 2, 2));

  t.deepEqual(
    path.map((v) => v.key),
    []
  );
});

test('should find no path for empty vertex list', (t) => {
  const path = dijkstra([], new Vertex(0, 0, 0), new Vertex(2, 2, 2));

  t.deepEqual(
    path.map((v) => v.key),
    []
  );
});

test.serial(
  'should not find a path if start is surrounded with stones',
  (t) => {
    const vertexList = mockVertexList(3, 3, 1);
    vertexList[0].neighbors = [];
    // splice from reverse, or we mess up the indexes
    vertexList.splice(3, 1); // south of start
    vertexList.splice(1, 1); // east of start

    // S#..
    // #...
    // ...E
    const path = dijkstra(vertexList, new Vertex(0, 0, 0), new Vertex(2, 2, 0));

    t.deepEqual(path, []);
  }
);

test.serial('should not find a path if there are no neighbors', (t) => {
  const vertexList = mockVertexList(3, 3, 1);
  vertexList.forEach((_v, i) => {
    vertexList[i].neighbors = [];
  });

  const path = dijkstra(vertexList, new Vertex(0, 0, 0), new Vertex(2, 2, 0));

  t.deepEqual(path, []);
});
