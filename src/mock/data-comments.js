
import { DIRECTORS,EMOJIS } from './const-data.js';
import { getRandomElement } from './util-data.js';


export const generateDataComments = () => {

  return [
    {
      id: 1,
      comment: 'Interesting setting and a good cast',
      emotion: getRandomElement(EMOJIS),
      author: getRandomElement(DIRECTORS),
      date: '2021-05-05T16:12:32.554Z',
    },
    {
      id: 2,
      comment: 'Booooooooooring',
      emotion: getRandomElement(EMOJIS),
      author: getRandomElement(DIRECTORS),
      date: '2021-04-11T16:12:32.554Z',
    },
    {
      id: 3,
      comment: 'Very very old. Meh',
      emotion: getRandomElement(EMOJIS),
      author: getRandomElement(DIRECTORS),
      date: '2010-05-10T16:12:32.554Z',
    },
    {
      id: 4,
      comment: 'Almost two hours? Seriously?',
      emotion: getRandomElement(EMOJIS),
      author: getRandomElement(DIRECTORS),
      date: '2018-01-11T16:12:32.554Z',
    },
    {
      id: 5,
      comment: 'Не смотрел, но осуждаю!',
      emotion: getRandomElement(EMOJIS),
      author: getRandomElement(DIRECTORS),
      date: '2021-05-05T20:12:32.554Z',
    },
  ];
};
