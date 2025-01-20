import { visitDirections } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');
  const input = (await getInputForDay(__filename)).trim().split('\n');
  const inputz = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`.split('\n');
  const visited = new Set();
  let totalPrice = 0;

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (!visited.has(`${row},${col}`)) {
        let area = 0;
        let perimeter = 0;
        const label = input[row][col];
        const tail = [{ tRow: row, tCol: col }];

        while (tail.length > 0) {
          const coords = tail.shift();

          if (!coords) continue;

          const { tRow, tCol } = coords;

          if (visited.has(`${tRow},${tCol}`)) continue;

          visited.add(`${tRow},${tCol}`);
          area++;

          visitDirections(tRow, tCol, (newRow, newCol) => {
            if (input[newRow]?.[newCol] !== label) {
              perimeter++;

              return;
            }

            if (!visited.has(`${newRow},${newCol}`)) {
              tail.push({ tRow: newRow, tCol: newCol });
            }
          });
        }

        const price = area * perimeter;

        totalPrice += price;
      }
    }
  }

  // console.log(input);

  showTheResult({ star1: totalPrice, star2: 'WIP...', path: __filename });
  console.timeEnd('time');
})();
