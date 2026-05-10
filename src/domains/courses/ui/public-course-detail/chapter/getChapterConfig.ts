export type IconKey = 'diamond' | 'meditation';

export type ChapterConfig = {
  icon?: IconKey;
  reverse?: boolean;
  showDecoration?: boolean;
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
  8: { reverse: true },
  9: { reverse: true },
  10: { icon: 'diamond' },
  11: { icon: 'meditation' },
  12: { reverse: true },
  13: { reverse: true },
  14: { icon: 'diamond' },
  15: { icon: 'meditation' },
  16: { reverse: true },
  17: { reverse: true },
  18: { },
  19: { reverse: true },
  20: {icon: 'diamond'  },
  21: { reverse: true },
  22: { reverse: true },
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
    showDecoration: true,
  },
  {
    condition: (length: number) => length >= 6,
    styles: {
      right: 0,
      top: 550,
    },
  },
  {
    condition: (length: number) => length >= 11,
    styles: {
      left: 0,
      top: 1350,
    },
  },
  {
    condition: (length: number) => length >= 16,
    styles: {
      right: 0,
      top: 1900,
    },
  },
];
