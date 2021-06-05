import {today} from '../utility/date';
export interface Finance {
  uuid: string;
  category: number;
  kind: number;
  amount: number;
  description: string;
  traded_at: string;
};

export const initFinance = (): Finance => {
  return {
    uuid: '',
    category: 1,
    kind: 1,
    amount: 0,
    description: '',
    traded_at: today(),
  };
};

export interface CustomFinance {
  uuid: string;
  category: string;
  kind: number;
  amount: number;
  description: string;
  traded_at: string;
}
