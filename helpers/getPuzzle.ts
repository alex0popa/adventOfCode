import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { promises as fs } from 'fs';

config({ path: './.env' });

const cookie = `session=${process.env.SESSION}`;

export const getPuzzle = async (
  day = new Date().getDate(),
  year = new Date().getFullYear(),
) => {
  const URL = `https://adventofcode.com/${year}/day/${day}/input`;

  try {
    const { data } = await axios.get<string, AxiosResponse<string>>(URL, {
      headers: { cookie },
      responseType: 'text',
      transformResponse: String,
    });

    const filePath = `inputs/year_${year}/day_${day}.in`;

    await fs.writeFile(filePath, data, 'utf8');

    console.log('\x1b[1;94m%s\x1b[0m', '!! - Input added - !!');
  } catch (error) {
    console.error('Error on download or file write: ', error);
  }
};
