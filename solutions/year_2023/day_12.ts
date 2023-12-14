import { sumArray } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const validCombination = (comb: string, checks: number[]) => {
  const counts: number[] = [];

  for (let index = 0, count = 0; index < comb.length; ++index) {
    const char = comb[index];
    
    if(char === '.') {
      if(count > 0) {
        counts.push(count);
      }

      count = 0;
    } else {
      ++count;
    }
  }

  let ok = checks.length === counts.length;

  for (let i = 0; i < checks.length && ok; i++) {
    if(counts[i] !== checks[i]) {
      ok = false
    }
  }

  return ok;
}

const testInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const getStar = (input: string[][], star = 0) => {
  input.forEach(([row, groupsStr]) => {
    const groups = groupsStr.split(',').map(Number);
    const damaged = sumArray(groups);
    const inputLineDamaged = row.split('').reduce((sum, char) => {
      return char === '#' ? sum + 1 : sum
    }, 0);
    let unknowns = 0;

    for (let i = 0; i < row.length; i++) if (row[i] === '?') ++unknowns;

    function findArrangements(length: number, combination: string = '', index: number = 0) {
      if (index === length) {
        const combinationDamaged = combination.split('').reduce((sum, char) => {
          return char === '#' ? sum + 1 : sum
        }, inputLineDamaged);

        if(combinationDamaged !== damaged) return;

        let i = 0;
        const transformedInputLine: string[] = [];
        
        for (let idx = 0; idx < row.length; idx++) {
          const char = row[idx];
          
          transformedInputLine.push(char === '?' ? combination[i++] : char);    
        }

        
    
        transformedInputLine.push('.');
    
        validCombination(transformedInputLine.join(''), groups) && ++star;
        
        return;
      }
  
      findArrangements(length, combination + '.', index + 1);
      findArrangements(length, combination + '#', index + 1);
    }

    findArrangements(unknowns);
  });

  return star;
}


(async () =>  {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  // const input = testInput.trim().split('\n');

  const inputStar1 = input.map(line => line.split(' '));
  const inputStar2 = input.map(line => {
    const [rowStr, groupsStr] = line.split(' ')
    const row = Array(5).fill(rowStr).join('?');
    const groups = Array(5).fill(groupsStr).join(',');

    return [row, groups];
  })
  const star1 = 0//getStar(inputStar1);

  function count(cfg: string, nums: number[]): number {
    if (cfg === "") {
      return nums.length === 0 ? 1 : 0;
    }
  
    if (nums.length === 0) {
      return cfg.includes("#") ? 0 : 1;
    }
  
    let result = 0;
  
    if (cfg[0] === "." || cfg[0] === "?") {
      result += count(cfg.slice(1), nums);
    }
  
    if (cfg[0] === "#" || cfg[0] === "?") {
      if (
        nums[0] <= cfg.length &&
        !cfg.slice(0, nums[0]).includes(".") &&
        (nums[0] === cfg.length || cfg[nums[0]] !== "#")
      ) {
        result += count(cfg.slice(nums[0] + 1), nums.slice(1));
      }
    }
  
    return result;
  }
  
  let total = 0;

  
  for (const line of input) {
    const [cfg, numsStr] = line.split(" ");
    const nums = numsStr.split(",").map(Number);
    total += count(cfg, nums);
  }
  
  console.log(total);
  
  // console.log(result);

  showTheResult({ star1, star2: 'WIP...', path: __filename });
})();
