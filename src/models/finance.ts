export interface Finance {
  category: string;
  kind: number;
  amount: number;
  description: string;
  traded_at: string;
};

export const initFinance = (): Finance => {
  return {
    category: 'salary',
    kind: 1,
    amount: 0,
    description: '',
    traded_at: '',
  };
};
