export type IconKey = 'diamond' | 'meditation';

export type ChapterConfig = {
  icon?: IconKey;
  reverse?: boolean;
};

const firstTen: Record<number, ChapterConfig> = {
  0: {
    icon: 'meditation',

    reverse: true,
  },
  1: {},
  2: {
    icon: 'diamond',

    reverse: true,
  },
  3: {},
  4: {},
  5: { reverse: true },
  6: { icon: 'diamond' },
  7: {
    icon: 'meditation',
  },
  8: { icon: 'diamond', reverse: true },
  9: { icon: 'meditation', reverse: true },
};

function dynamicForAfterTen(index: number): ChapterConfig {
  const isEven = index % 2 === 0;
  const isEvenGroup = Math.floor((index + 1) / 2) % 2 === 0;

  return {
    icon: isEvenGroup ? 'diamond' : 'meditation',
    reverse: !isEven,
  };
}

export default function getChapterConfig(index: number): ChapterConfig {
  if (index in firstTen) return firstTen[index]!;
  return dynamicForAfterTen(index);
}

export const decorations = [
  {
    condition: (length: number) => length >= 3,
    styles: {
      left: 0,
      top: 0,
    },
  },
  {
    condition: (length: number) => length >= 5,
    styles: {
      right: 0,
      top: 500,
    },
  },
];
