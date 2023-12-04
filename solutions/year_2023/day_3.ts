
import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () =>  {
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const chars = ['=', '*', '+', '/', '#', '&', '-', '%', '$', '@'];

  let star1 = 0;

  const isAPartNumber = (row: number, cols: number[]) => {
    const startRow = row - 1;
    const endRow = row + 1;
    const startCol = cols[0] - 1;
    const endCol = cols.slice(-1)[0] +1;

    for (let i = startRow; i <= endRow; ++i)
      for (let j = startCol; j <= endCol; ++j)
        if(chars.includes(input[i]?.[j])) return true;
        
    return false;
  }

  for (let row = 0; row < input.length; ++row) {
    let stringNumber = '', colIndexes: number[] = [];

    for (let col = 0; col <= input[row].length; ++col) {
      if(!isNaN(+input[row][col])) {
        stringNumber += input[row][col];
        colIndexes.push(col);
      } else if(stringNumber) {
        if (isAPartNumber(row, colIndexes)) star1 += Number(stringNumber);

        stringNumber = '';
        colIndexes = [];
      }
    }
  }

  let star2 = 0;
  const rowLength = input[0].length;

  const getGearRatio = (row: number, col: number) => {
    const rows = [row - 1, row, row + 1];
    let numbers: number[] = [];

    rows.forEach(currentRow => {
      let left = col - 1, right = col + 1;
      const line = input[currentRow];

      while(!isNaN(+line[left]) && left > 0) --left;
      while(!isNaN(+line[right]) && right < rowLength) ++right;

      const subString = line.slice(left, right);
      const stringNumbers = extractNumbers(subString);

      numbers = [...numbers, ...stringNumbers];
    })

    return numbers.length === 2 ? numbers[0] * numbers[1] : 0;
  }

  for (let row = 0; row < input.length; ++row)
    for (let col = 0; col < input[row].length; ++col)
      if(input[row][col] === '*')  star2 += getGearRatio(row, col);

  showTheResult({ star1, star2, path: __filename });
})();
