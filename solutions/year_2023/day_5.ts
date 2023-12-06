
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';
import {extractNumbers} from '../../helpers/general';

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

(async () =>  {
  // const input = (await getInputForDay(__filename)).trim().split('\n');
  const input = testInput.trim().split('\n');
  const seeds = extractNumbers(input.shift() ?? '');
  let ranges: [number, number][] = [];
  
  for (let i = 0; i < seeds.length; i += 2) ranges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
  

  const mapsList = input.reduce<number[][][]>((arr, line) => { 
    if(line.includes('map')) arr.push([]);
    else if(line) arr[arr.length - 1].push(extractNumbers(line));
    
    return arr;
  }, []);

  mapsList.forEach(maps => {
    seeds.forEach((seed, idx) => {
      maps.forEach(([destination, source, range]) => {
        if(seed >= source && seed < source + range) {
          seeds[idx] = seed + (destination -source);
        }
      })
    });

  });

  console.log(ranges);

  mapsList.forEach(maps => {
    
    const partialRanges: [number, number][] = [];
    ranges.forEach(([start, end], idx) => {

      let find = false;
      maps.forEach(([destination, source, range]) => {
        if((start >= source && start < (source + range)) || (end < (source + range) && end >= source)) {
          find = true;
          let newStart  = start < source ? source : start;
          let newEnd = end < source + range ? end : source + range -1;
         
          if(start < newStart) {
            partialRanges.push([start, newStart - 1])
          }

          if (end > newEnd) {
            partialRanges.push([newEnd + 1, end])
          }

          partialRanges.push([newStart + (destination -source), newEnd + (destination - source)])
        }
      });

      if (!find) partialRanges.push([start, end]);
    });

    console.log(JSON.stringify(partialRanges))
    if (partialRanges.length) ranges = partialRanges;
    
    
  });

  const star1 = Math.min(...seeds);
  const star2 = Math.min(...ranges.flat());

  showTheResult({ star1, star2, path: __filename });
})();
