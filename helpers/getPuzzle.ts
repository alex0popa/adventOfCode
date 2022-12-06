import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { writeFile } from 'fs';

config({ path: './.env' });

const cookie = `session=${process.env.SESSION}`;

export const getPuzzle = async (
  day = new Date().getDate(),
  year = new Date().getFullYear()
) => {
  const URL = `https://adventofcode.com/${year}/day/${day}/input`;

  const { data } = await axios.get<string, AxiosResponse<string>>(URL, {
    headers: { cookie },
  });

  return await writeFile(`inputs/year_${year}/day_${day}.in`, data, (_) =>
    console.log(`\x1b[1;94m%s\x1b[0m`, '!! - Input added - !!')
  );
};
