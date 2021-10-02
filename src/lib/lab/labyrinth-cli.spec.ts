import test from 'ava';

import { mockExampleLabyrinth } from '../mock';

import { LabyrinthCli } from './labyrinth-cli.class';

test('should process Labyrinth example correctly', (t) => {
  const app = new LabyrinthCli();
  mockExampleLabyrinth.split('\n').forEach((line) => {
    app.processLine(line);
  });
  t.deepEqual(app.output, ['Entkommen in 11 Minute(n)!', 'Gefangen :-(']);
});

test('should process Labyrinth with no way out correctly', (t) => {
  const app = new LabyrinthCli();
  const example = ['1 3 3', 'S#.', '##.', '..E', '', '0 0 0'];
  example.forEach((line) => {
    app.processLine(line);
  });
  t.deepEqual(app.output, ['Gefangen :-(']);
});

test('should find the fastest exit with multiple exits', (t) => {
  const app = new LabyrinthCli();
  const example = ['1 3 3', 'S..', '..E', '..E', '', '0 0 0'];
  example.forEach((line) => {
    app.processLine(line);
  });
  t.deepEqual(app.output, ['Entkommen in 3 Minute(n)!']);
});

test('should find the fastest exit with complex labyrinth & multiple exits + --debug printout', (t) => {
  const argv = process.argv;
  process.argv.push('--debug');
  const app = new LabyrinthCli();
  const example = `5 5 5
#####
#S...
#.###
#.###
#.###

#####
####.
####.
####.
#...#

#####
#...#
#.#.#
#....
###.#

#####
#.###
#####
#####
#####

#####
#..E#
#.#.#
#E.E#
#####

0 0 0`;
  example.split('\n').forEach((line) => {
    app.processLine(line);
  });
  process.argv = argv;
  t.deepEqual(app.output.slice(-1), ['Entkommen in 16 Minute(n)!']);
});

test('should printout failed lab escape with --debug and instructions with --interactive', (t) => {
  const argv = process.argv;
  process.argv.push('--debug');
  process.argv.push('--interactive');
  const app = new LabyrinthCli();
  const example = `3 5 5
#####
#S...
#.###
#.###
#.###

#####
####.
####.
####.
#...#

#####
#E..#
#####
#...#
#####

0 0 0`;
  example.split('\n').forEach((line) => {
    app.processLine(line);
  });
  process.argv = argv;
  t.deepEqual(app.output.length, 9);
});

test('should throw error if not enough layers are entered', (t) => {
  const app = new LabyrinthCli();
  const example = `3 5 5
#####
#S...
#.###
#.###
#.###

#####
####.
####.
####.
#...#

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if there is no start', (t) => {
  const app = new LabyrinthCli();
  const example = `1 5 5
#####
#....
#.###
#.###
#E###

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /has no start/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if there is no exit', (t) => {
  const app = new LabyrinthCli();
  const example = `1 5 5
#####
#S...
#.###
#.###
#.###

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /has no exit/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if invalid character was supplied', (t) => {
  const app = new LabyrinthCli();
  const example = `1 5 5
#####
#S..x
#.###
#.###

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid char/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if layer 1 length is invalid', (t) => {
  const app = new LabyrinthCli();
  const example = `2 5 5
#####
#S..E
#.###
#.###

#####
#...E
#.###
#.###
#.###

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid layer length/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if layer length 2 is invalid', (t) => {
  const app = new LabyrinthCli();
  const example = `2 5 5
#####
#S..E
#.###
#.###
#.###

#####
#...E
#.###
#.###

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid layer length/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if layer length is larger', (t) => {
  const app = new LabyrinthCli();
  const example = `2 3 3
###
#S.
#.#
#.#
#.#

#.#
#.#
#.#

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid layer length/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if layer width is larger', (t) => {
  const app = new LabyrinthCli();
  const example = `1 3 3
#####
#S..E
#.###

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid line length found/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error if layer more layers are defined', (t) => {
  const app = new LabyrinthCli();
  const example = `1 3 3
###
#S.
#E#

###
#..
#.#

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid new layer!/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error for invalid R value', (t) => {
  const app = new LabyrinthCli();
  const example = `1 31 31
###
#S.
#E#

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid number for R/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error for invalid L value', (t) => {
  const app = new LabyrinthCli();
  const example = `31 3 3
###
#S.
#E#

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid number for L/);
    errorThrown = true;
  }
  t.true(errorThrown);
});

test('should throw error for invalid C value', (t) => {
  const app = new LabyrinthCli();
  const example = `3 3 a
###
#S.
#E#

0 0 0`;
  let errorThrown = false;
  try {
    example.split('\n').forEach((line) => {
      app.processLine(line);
    });
  } catch (_err) {
    t.true(_err instanceof Error);
    t.regex((_err as Error).message, /Invalid number for C/);
    errorThrown = true;
  }
  t.true(errorThrown);
});
