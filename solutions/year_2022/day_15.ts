import { extractNumbers } from '../../helpers/general';
import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  const input = (await getInputForDay(__filename))
    .trim()
    .split('\n')
    .map((l) => {
      const [startCol, startRow, beaconCol, beaconRow] = extractNumbers(l);

      return { startCol, startRow, beaconCol, beaconRow };
    });

  const TARGET_ROW = input.length > 14 ? 2000000 : 10;

  const getIntervals = (row: number) =>
    input
      .reduce<number[][]>(
        (intervals, { startCol, startRow, beaconCol, beaconRow }) => {
          const directionCol = Math.abs(startCol - beaconCol);
          const directionRow = Math.abs(startRow - beaconRow);

          const dist = directionCol + directionRow;

          const maxRow = startRow + dist;
          const minRow = startRow - dist;

          if (row <= maxRow && row >= minRow) {
            const delta = Math.abs((row < startRow ? minRow : maxRow) - row);

            const start = startCol - delta;
            const end = startCol + delta;

            intervals.push([start, end]);
          }

          return intervals;
        },
        []
      )
      // sort by start interval value
      .sort(([a], [b]) => a - b);

  const star1Intervals = getIntervals(TARGET_ROW);

  const startInterval = star1Intervals[0][0];
  const endInterval = star1Intervals
    .slice(1)
    .reduce(
      (val, [start, end]) => (val >= start && val < end ? end : val),
      star1Intervals[0][1]
    );

  const star1 = endInterval - startInterval;

  // PART TWO
  const TUNING = 4000000;
  const MAX_ROW = input.length > 14 ? TUNING : 20;

  // tuning frequency
  let star2 = 0;

  for (let row = 0, canSearch = true; row <= MAX_ROW && canSearch; ++row) {
    const intervals = getIntervals(row).filter(([, end]) => end >= 0);

    if (intervals.length > 0) {
      let [, endInterval] = intervals[0];

      for (let i = 1; i < intervals.length && canSearch; i++) {
        const [start, end] = intervals[i];

        if (endInterval >= start && endInterval < end) {
          endInterval = end;
        } else if (endInterval < start && endInterval < end) {
          canSearch = false;

          star2 = (endInterval + 1) * TUNING + row;
        }
      }
    }
  }

  showTheResult({ star1, star2, path: __filename });
})();

/**
 *
 * --- Day 15: Beacon Exclusion Zone ---
 *
 * You feel the ground rumble again as the distress signal leads you to a large
 * network of subterranean tunnels. You don't have time to search them all, but
 * you don't need to: your pack contains a set of deployable sensors that you
 * imagine were originally built to locate lost Elves.
 *
 * The sensors aren't very powerful, but that's okay; your handheld device
 * indicates that you're close enough to the source of the distress signal to use
 * them. You pull the emergency sensor system out of your pack, hit the big
 * button on top, and the sensors zoom off down the tunnels.
 *
 * Once a sensor finds a spot it thinks will give it a good reading, it attaches
 * itself to a hard surface and begins monitoring for the nearest signal source
 * beacon. Sensors and beacons always exist at integer coordinates.
 * Each sensor knows its own position and can determine the position of a beacon
 * precisely; however, sensors can only lock on to the one beacon closest to the
 * sensor as measured by the Manhattan distance. (There is never a tie where two
 * beacons are the same distance to a sensor.)
 *
 * It doesn't take long for the sensors to report back their positions and
 * closest beacons (your puzzle input). For example:
 *
  Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  Sensor at x=9, y=16: closest beacon is at x=10, y=16
  Sensor at x=13, y=2: closest beacon is at x=15, y=3
  Sensor at x=12, y=14: closest beacon is at x=10, y=16
  Sensor at x=10, y=20: closest beacon is at x=10, y=16
  Sensor at x=14, y=17: closest beacon is at x=10, y=16
  Sensor at x=8, y=7: closest beacon is at x=2, y=10
  Sensor at x=2, y=0: closest beacon is at x=2, y=10
  Sensor at x=0, y=11: closest beacon is at x=2, y=10
  Sensor at x=20, y=14: closest beacon is at x=25, y=17
  Sensor at x=17, y=20: closest beacon is at x=21, y=22
  Sensor at x=16, y=7: closest beacon is at x=15, y=3
  Sensor at x=14, y=3: closest beacon is at x=15, y=3
  Sensor at x=20, y=1: closest beacon is at x=15, y=3
 *
 * So, consider the sensor at 2,18; the closest beacon to it is at -2,15.
 * For the sensor at 9,16, the closest beacon to it is at 10,16.
 *
 * Drawing sensors as S and beacons as B, the above arrangement of sensors and
 * beacons looks like this:
 *
 *                1    1    2    2
 *      0    5    0    5    0    5
 *  0 ....S.......................
 *  1 ......................S.....
 *  2 ...............S............
 *  3 ................SB..........
 *  4 ............................
 *  5 ............................
 *  6 ............................
 *  7 ..........S.......S.........
 *  8 ............................
 *  9 ............................
 * 10 ....B.......................
 * 11 ..S.........................
 * 12 ............................
 * 13 ............................
 * 14 ..............S.......S.....
 * 15 B...........................
 * 16 ...........SB...............
 * 17 ................S..........B
 * 18 ....S.......................
 * 19 ............................
 * 20 ............S......S........
 * 21 ............................
 * 22 .......................B....
 *
 * This isn't necessarily a comprehensive map of all beacons in the area, though.
 * Because each sensor only identifies its closest beacon, if a sensor detects a
 * beacon, you know there are no other beacons that close or closer to that sensor.
 * There could still be beacons that just happen to not be the closest beacon to
 * any sensor. Consider the sensor at 8,7:
 *
 *                1    1    2    2
 *      0    5    0    5    0    5
 * -2 ..........#.................
 * -1 .........###................
 *  0 ....S...#####...............
 *  1 .......#######........S.....
 *  2 ......#########S............
 *  3 .....###########SB..........
 *  4 ....#############...........
 *  5 ...###############..........
 *  6 ..#################.........
 *  7 .#########S#######S#........
 *  8 ..#################.........
 *  9 ...###############..........
 * 10 ....B############...........
 * 11 ..S..###########............
 * 12 ......#########.............
 * 13 .......#######..............
 * 14 ........#####.S.......S.....
 * 15 B........###................
 * 16 ..........#SB...............
 * 17 ................S..........B
 * 18 ....S.......................
 * 19 ............................
 * 20 ............S......S........
 * 21 ............................
 * 22 .......................B....
 *
 * This sensor's closest beacon is at 2,10, and so you know there are no beacons
 * that close or closer (in any positions marked #).
 *
 * None of the detected beacons seem to be producing the distress signal, so
 * you'll need to work out where the distress beacon is by working out where it
 * isn't. For now, keep things simple by counting the positions where a beacon
 * cannot possibly be along just a single row.
 *
 * So, suppose you have an arrangement of beacons and sensors like in the example
 * above and, just in the row where y=10, you'd like to count the number of
 * positions a beacon cannot possibly exist. The coverage from all sensors near
 * that row looks like this:
 *
 *                  1    1    2    2
 *        0    5    0    5    0    5
 *  9 ...#########################...
 * 10 ..####B######################..
 * 11 .###S#############.###########.
 *
 * In this example, in the row where y=10, there are 26 positions where a beacon
 * cannot be present.
 *
 * Consult the report from the sensors you just deployed.
 * In the row wherey=2000000,how many positions cannot contain a beacon?
 * 
 
 * --- Part Two ---
 * 
 * Your handheld device indicates that the distress signal is coming from a beacon
 * nearby. The distress beacon is not detected by any sensor, but the distress
 * beacon must have x and y coordinates each no lower than 0 and no larger than 4000000.
 * 
 * To isolate the distress beacon's signal, you need to determine its tuning
 * frequency, which can be found by multiplying its x coordinate by 4000000 and
 * then adding its y coordinate.
 * 
 * In the example above, the search space is smaller: instead, the x and y
 * coordinates can each be at most 20. With this reduced search area, there is
 * only a single position that could have a beacon: x=14, y=11. The tuning
 * frequency for this distress beacon is 56000011.
 * 
 * Find the only possible position for the distress beacon. What is its tuning frequency?
 * 
 */
