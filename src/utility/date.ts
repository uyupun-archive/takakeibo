export const today = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${zeroPadding(date.getMonth() + 1)}-${zeroPadding(date.getDate())}`;
};

export const yearMonth = (d: string): string => {
  const ary = d.split('-');
  return `${ary[0]}-${ary[1]}`;
};

const zeroPadding = (n: number) => {
  if (n <= 9) return `0${n}`;
  return `${n}`;
}
