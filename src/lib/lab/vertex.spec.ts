import test from 'ava';

import { Vertex } from './vertex.class';

test('should handle vertex creation and key compare correctly', async (t) => {
  const a = new Vertex(0, 1, 2);
  const b = new Vertex(0, 1, 2);
  const c = new Vertex(5, 8, 6);

  t.true(a.equals(b));
  t.true(b.equals(a));
  t.false(a.equals(c));
  t.false(c.equals(b));

  t.deepEqual(a.x, 0);
  t.deepEqual(a.y, 1);
  t.deepEqual(a.z, 2);

  t.deepEqual(c.point, [c.x, c.y, c.z]);

  t.deepEqual(a.key, '0,1,2');
  t.deepEqual(c.key, '5,8,6');
  t.deepEqual(new Vertex().key, '0,0,0');
});
