import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const getSparseHash = (lengths: number[], loops: number) => {
  const list = Array.from({ length: 256 }, (_, i) => i);
  let skipSize = 0;
  let start = 0;

  for (let loop = 0; loop < loops; loop++) {
    for (const length of lengths) {
      for (let i = 0; i < length / 2; ++i) {
        const idx = (start + i) % list.length;
        const revIdx = (start + length - 1 - i) % list.length;

        [list[idx], list[revIdx]] = [list[revIdx], list[idx]];
      }

      start = (start + length + skipSize) % list.length;
      skipSize++;
    }
  }

  return list;
};

const computeDenseHash = (sparseHash: number[]): number[] => {
  const denseHash: number[] = [];

  // Loop through 16 blocks (each containing 16 numbers)
  for (let i = 0; i < 16; i++) {
    // Start with the first number in the block
    let blockXor = sparseHash[i * 16];

    // XOR with the next number in the block
    for (let j = 1; j < 16; j++) {
      blockXor ^= sparseHash[i * 16 + j];
    }

    denseHash.push(blockXor);
  }

  return denseHash;
};

const toHex = (denseHash: number[]): string => {
  return denseHash.map((num) => num.toString(16).padStart(2, '0')).join('');
};

export const knotHash = (lengths: number[]) => {
  const standardLengthSuffixValues = [17, 31, 73, 47, 23];
  const sparseHash = getSparseHash(
    [...lengths, ...standardLengthSuffixValues],
    64,
  );
  const denseHash = computeDenseHash(sparseHash);
  return toHex(denseHash);
};

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n')[0];
  const star1Lengths = extractNumbers(input);

  const [first, second] = getSparseHash(star1Lengths, 1);
  const star1 = first * second;

  const star2Lengths = [...input.split('').map((char) => char.charCodeAt(0))];

  const star2 = knotHash(star2Lengths);

  showTheResult({
    star1,
    star2,
    path: __filename,
  });
  console.timeEnd('time');
})();
