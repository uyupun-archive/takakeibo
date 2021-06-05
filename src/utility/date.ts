export const today = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${zeroPadding(date.getMonth() + 1)}-${zeroPadding(date.getDate())}`;
};

export const convertYearMonth = (d: string): string => {
  const ary = d.split('-');
  return `${ary[0]}-${ary[1]}`;
};

export const convertMonthDay = (d: string): string => {
  const ary = d.split('-');
  return `${ary[1]}-${ary[2]}`;
};

export const convertLastDay = (d: string): string => {
  const ary = d.split('-');
  return `${new Date(Number(ary[0]), Number(ary[1]), 0).getDate()}`;
};

export const convertDay = (d: string): string => {
  const ary = d.split('-');
  return `${ary[2]}`;
};

const zeroPadding = (n: number) => {
  if (n <= 9) return `0${n}`;
  return `${n}`;
};
