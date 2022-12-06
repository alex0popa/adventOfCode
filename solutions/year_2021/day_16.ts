import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

const HEXA: Record<string, string> = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

const day16 = async () => {
  const input = await getInputForDay(__filename);

  let str = input.split('').reduce((a, c) => a + HEXA[c], '');

  const getLiteral = (s: string) => {
    let bin = '';
    let l = 0;

    for (let ok = true; ok; ) {
      const group = s.slice(1, 5);

      bin += group;
      s[0] === '0' && (ok = false);
      s = s.slice(5);
      l += 5;
    }

    str = str.slice(l);
  };

  let tot = 0;

  const compute = () => {
    if (str.length < 11) return;

    const version = parseInt(str.slice(0, 3), 2);
    tot += version;

    const typeID = parseInt(str.slice(3, 6), 2);

    str = str.slice(6);
    if (typeID === 4) {
      getLiteral(str);

      compute();
    } else {
      const lengthTypeID = +str[0];
      str = str.slice(1);

      if (lengthTypeID) {
        let length = parseInt(str.slice(0, 11));
        str = str.slice(11);

        while (length--) compute();
      } else {
        const length = parseInt(str.slice(0, 15));
        str = str.slice(15);
        const aux = str.slice(length);
        str = str.slice(0, length);

        compute();

        str = aux;
      }
    }
    // console.log(x, version, typeID)
  };

  compute();

  console.log('tot => ', tot);

  // typeID - 4 = literal value 1xxxx1xxxx0xxxx
  // typeID !== 4 operator: next bit - 0 next 15 bites tell the length of its sub-packets
  //                                 - 1 next 11 bites tell the number of its sub-packets

  showTheResult({ star1: 0, star2: 0, path: __filename });
};

day16();
