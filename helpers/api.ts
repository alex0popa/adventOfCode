import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { promises as fs } from 'fs';

config({ path: './.env' });

const axiosConfig = {
  headers: { cookie: `session=${process.env.SESSION}` },
  responseType: 'text',
  transformResponse: String,
} as const;

export const downloadPuzzle = async ({
  day = new Date().getDate(),
  year = new Date().getFullYear(),
}) => {
  const URL = `https://adventofcode.com/${year}/day/${day}/input`;

  try {
    const { data: inputData } = await axios.get<string, AxiosResponse<string>>(
      URL,
      axiosConfig,
    );

    const filePath = `inputs/year_${year}/day_${day}.in`;

    await fs.writeFile(filePath, inputData, 'utf8');

    console.log('\x1b[1;94m%s\x1b[0m', '!! - Input added - !!');
  } catch (inputError) {
    console.error('Error on input download or file write: ', inputError);
  }
};

export const downloadStory = async ({
  day = new Date().getDate(),
  year = new Date().getFullYear(),
}) => {
  // Download puzzle description (story) https://adventofcode.com/2025/day/12
  const STORY_URL = `https://adventofcode.com/${year}/day/${day}`;

  try {
    const { data: storyData } = await axios.get<string, AxiosResponse<string>>(
      STORY_URL,
      axiosConfig,
    );

    console.log({ storyData });

    const descriptionFile = `problems/year_${year}/day_${day}.txt`;

    await fs.writeFile(descriptionFile, storyData, 'utf8');

    console.log(
      '\x1b[1;93m%s\x1b[0m',
      '!! - Puzzle description downloaded - !!',
    );
  } catch (storyError) {
    console.error('Error on description download: ', storyError);
  }
};

export const submitAnswer = async ({
  day = new Date().getDate(),
  year = new Date().getFullYear(),
  level,
  answer,
}: {
  day: number;
  year: number;
  level: 1 | 2;
  answer: string | number;
}) => {
  const SUBMIT_URL = `https://adventofcode.com/${year}/day/${day}/answer`;

  try {
    const formData = new URLSearchParams();
    formData.append('level', level.toString());
    formData.append('answer', answer.toString());

    const { data: submitResponse } = await axios.post<
      string,
      AxiosResponse<string>
    >(SUBMIT_URL, formData, axiosConfig);

    console.log({ submitResponse });

    console.log(
      '\x1b[1;92m%s\x1b[0m',
      `!! - Answer [${answer}] submitted - !!`,
    );
  } catch (submitError) {
    console.error('Error on answer submission: ', submitError);
  }
};
