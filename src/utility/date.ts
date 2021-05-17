export const today = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${zeroPadding(date.getMonth() + 1)}-${zeroPadding(date.getDate())}`;
};

export const convertYearMonth = (d: string): string => {
  const ary = d.split('-');
  return `${ary[0]}-${ary[1]}`;
};

const zeroPadding = (n: number) => {
  if (n <= 9) return `0${n}`;
  return `${n}`;
}

export const convertMonthDay = (d: string): string => {
  const ary = d.split('-');
  return `${ary[1]}-${ary[2]}`;
}
