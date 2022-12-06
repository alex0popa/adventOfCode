import fs from 'fs';

export const getInputForDay = async (path: string) => {
  const PATH = `inputs${path.split('solutions')[1].replace('.ts', '.in')}`;

  return fs.readFileSync(PATH, 'utf-8');
};
