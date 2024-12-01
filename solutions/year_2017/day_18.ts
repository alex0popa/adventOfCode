import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

type Instruction = 'snd' | 'set' | 'mul' | 'add' | 'mod' | 'jgz' | 'rcv';
type Registers = { [key: string]: number };

const getValue = (str: string | undefined, registers: Registers) => {
  // str is string, a instruction name
  if (str && isNaN(+str)) {
    return registers[str] ?? 0;
  }

  // str is number
  if (str && !isNaN(+str)) {
    return +str;
  }

  throw new Error(`Wrong value for Y: [${str}]`);
};

const getStar1 = (instructions: string[], registers: Registers = {}) => {
  let frequencyLastSoundPlayed: number = -Infinity;

  for (let i = 0; i < instructions.length; ++i) {
    const [instruction, X, Y] = instructions[i].split(' ') as [
      Instruction,
      string,
      string | undefined,
    ];

    if (instruction === 'snd') {
      frequencyLastSoundPlayed = registers[X];

      continue;
    }

    if (instruction === 'set') {
      const yValue = getValue(Y, registers);
      registers[X] = yValue;

      continue;
    }

    if (instruction === 'add') {
      const yValue = getValue(Y, registers);
      registers[X] += yValue;

      continue;
    }

    if (instruction === 'mul') {
      const yValue = getValue(Y, registers);
      registers[X] *= yValue;

      continue;
    }

    if (instruction === 'mod') {
      const yValue = getValue(Y, registers);
      registers[X] %= yValue;

      continue;
    }

    if (instruction === 'rcv') {
      if (registers[X]) {
        break;
      }
    }

    if (instruction === 'jgz') {
      if (registers[X]) {
        const yValue = getValue(Y, registers);
        i += yValue - 1;

        continue;
      }
    }
  }

  return frequencyLastSoundPlayed;
};

type State = {
  idx: number;
  id: 0 | 1;
  registers: Registers;
  queue: number[];
  running: boolean;
};

const getStar2 = (instructions: string[]) => {
  let star2 = 0;

  const execute = (state: State, otherQueue: number[]) => {
    const [instruction, X, Y] = instructions[state.idx].split(' ') as [
      Instruction,
      string,
      string | undefined,
    ];

    if (!state.running) {
      console.log({ instruction, X, id: state.id, Q: state.queue });
    }

    if (instruction === 'snd') {
      const value = getValue(X, state.registers);

      otherQueue.push(value);

      star2 += state.id;
    }

    if (instruction === 'rcv') {
      if (state.queue.length > 0) {
        state.registers[X] = state.queue.shift()!;
        state.running = true;
      } else {
        state.running = false;
        return; // Pause execution until a value is available
      }
    }

    if (instruction === 'set') {
      const value = getValue(Y, state.registers);
      state.registers[X] = value;
    }

    if (instruction === 'add') {
      const value = getValue(Y, state.registers);
      state.registers[X] += value;
    }

    if (instruction === 'mul') {
      const value = getValue(Y, state.registers);
      state.registers[X] *= value;
    }

    if (instruction === 'mod') {
      const value = getValue(Y, state.registers);
      state.registers[X] %= value;
    }

    if (instruction === 'jgz') {
      if (state.registers[X]) {
        const value = getValue(Y, state.registers);
        state.idx += value - 1;
      }
    }

    ++state.idx;
  };

  let progress = 0;

  const states: State[] = [
    { idx: 0, id: 0, registers: { p: 0 }, queue: [], running: true },
    { idx: 0, id: 1, registers: { p: 1 }, queue: [], running: true },
  ];

  while ((states[0].running || states[1].running) && progress < 100000) {
    ++progress;
    execute(states[0], states[1].queue);
    execute(states[1], states[0].queue);
  }
  console.log(states);
  return star2;
};

(async () => {
  console.time('time');
  const instructions = (await getInputForDay(__filename)).trim().split('\n');

  showTheResult({
    star1: getStar1([...instructions]),
    star2: 'wip...',
    path: __filename,
  });
  console.timeEnd('time');
})();
