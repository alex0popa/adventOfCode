
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import {extractNumbers} from '../../helpers/general';

const getStar1 = ({mapsList, seeds}: { seeds: number[], mapsList: number[][][] }) => {
  for (const maps of mapsList) {
    for (let idx = 0; idx < seeds.length; idx++) {
      const seed = seeds[idx];

      for (const [destination, source, range] of maps) {
        if(seed >= source && seed < source + range) {
          seeds[idx] = seed + (destination -source);
        }
      }
    }
  };

  return Math.min(...seeds);
}

const getStart2 = ({ mapsList, seeds }: { mapsList: number[][][], seeds: number[] }) => {
  let ranges: [number, number][] = [];
  
  for (let i = 0; i < seeds.length; i += 2) {
    ranges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
  }

  for (const maps of mapsList) {
    const partialRanges: [number, number][] = [];

    while(ranges.length) {
      const [start, end] = ranges.pop() ?? [0, 0];

      let find = false;

      for (const [destination, source, range] of maps) {
        if((start >= source && start < (source + range)) || (end < (source + range) && end >= source)) {
          find = true;
          let newStart  = start < source ? source : start;
          let newEnd = end < (source + range) ? end : (source + range - 1);

          partialRanges.push([newStart + (destination - source), newEnd + (destination - source)])
          
          if(start < newStart) ranges.push([start, newStart - 1])
          
          if (end > newEnd)  ranges.push([newEnd + 1, end])
        }
      };

      if (!find) partialRanges.push([start, end]);
    }

    ranges = partialRanges;
  }

  return Math.min(...ranges.flat());
}

(async () =>  {
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const seeds = extractNumbers(input.shift() ?? '');
  const mapsList = input.reduce<number[][][]>((arr, line) => { 
    if(line.includes('map')) arr.push([]);
    else if(line) arr[arr.length - 1].push(extractNumbers(line));
    
    return arr;
  }, []);
  
  const star1 = getStar1({ mapsList, seeds: [...seeds] })
  const star2 = getStart2({ mapsList, seeds })

  showTheResult({ star1, star2, path: __filename });
})();