import { getInputForDay } from '../../helpers/getInputForDay';
import { showTheResult } from '../../helpers/showTheResult';

(async () => {
  console.time('time');
  const [captcha] = (await getInputForDay(__filename)).trim().split('\n');

  let star1 = 0;
  let star2 = 0;

  for (let i = 0; i < captcha.length; i++) {
    const nextIndexForStar1 = (i + 1) % captcha.length;
    if (captcha[i] === captcha[nextIndexForStar1]) star1 += +captcha[i];

    const nextIndexForStar2 = (i + captcha.length / 2) % captcha.length;
    if (captcha[i] === captcha[nextIndexForStar2]) star2 += +captcha[i];
  }

  showTheResult({
    star1,
    star2,
    path: __filename,
  });
  console.timeEnd('time');
})();
