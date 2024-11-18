type Stars = { star1: number | string; star2: number | string; path: string };

const fill = (length: number, fillChar: '-' | ' ') => {
  return [...Array(length).fill(fillChar)].join('')
}

const displayResult = ({ star1, star2, path }: Stars, i?: number) => {
  const day = +path.split('day_')[1].replace('.ts', '');
  const maxLength = Math.max(`${star1}`.length, `${star2}`.length);

  const titleEnd = maxLength + (day > 9 ? 1 : 2);

  const s1 = maxLength - `${star1}`.length;
  const s2 = maxLength - `${star2}`.length;
  const horizontalLine = fill(maxLength + 13, '-');

  return `
     ${horizontalLine}
    |      day_${day}${fill(titleEnd, ' ')}|
    |${horizontalLine}|
    |  star1 => ${star1}${fill(s1, ' ')}  |
    |  star2 => ${star2}${fill(s2, ' ')}  |
     ${horizontalLine}
    `;
};

export const showTheResult = (result: Stars) => {
  const textColor = `\x1b[34m`;
  console.log(textColor, displayResult(result));
};
