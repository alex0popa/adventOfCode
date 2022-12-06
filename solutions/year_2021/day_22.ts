
  import { getInputForDay } from '../../helpers/getInputForDay';
  import { showTheResult } from '../../helpers/showTheResult';

  (async () =>  {
    const input = (await getInputForDay(__filename));
  
    console.log('!! - Boilerplate added - !!');
  
    showTheResult({ star1: 'WIP...', star2: 'WIP...', path: __filename });
  })();
