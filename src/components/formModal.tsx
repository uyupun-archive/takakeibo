import {useState} from 'react';
import {Finance} from '../models/finance';
import {Category} from '../models/category';
import {Kinds} from '../models/kinds';
import {Modal} from './modal'

interface Props {
  finance: Finance;
  categories: Array<Category>;
  isVisible: boolean;
  cancelText?: string;
  submitText?: string;
  submitBtnColor?: 'blue' | 'red';
  onCancel: () => void;
  onSubmit: (finance: Finance) => void;
}

const FormModal = (props: Props) => {
  if (!props.finance.uuid || !props.categories.length) return null;

  const {categories, isVisible, cancelText, submitText, submitBtnColor, onCancel, onSubmit} = props;
  const [finance, setFinance] = useState<Finance>(props.finance);

  const overwriteCategoryName = (name: string, kind: number, type: string): string => {
    if (kind === Kinds.Income) return `${name} [収入]`;
    if (kind === Kinds.Expenditure) return `${name} [支出 - ${type}]`;
    return name;
  }

  return (
    <Modal
      isVisible={isVisible}
      cancelText={cancelText}
      submitText={submitText}
      submitBtnColor={submitBtnColor}
      onCancel={() => onCancel()}
      onSubmit={() => onSubmit(finance)}
    >
      <div>
        <label className="flex justify-between item-center mb-6">
          <span className="flex item-center w-24">
            日付
            <span className="text-red-500 ml-1.5">*</span>
          </span>
          <input
            type="date"
            className="flex-1 ml-10 rounded"
            value={finance.traded_at}
            onChange={(e) => {
              setFinance(state => ({...state, traded_at: e.target.value}));
            }}
          />
        </label>
        <label className="flex justify-between item-center mb-6">
          <span className="flex item-center w-24">
            カテゴリ
            <span className="text-red-500 ml-1.5">*</span>
          </span>
          <select
            className="flex-1 ml-10 rounded"
            onChange={(e) => {
              const idx = Number(e.target.value);
              setFinance(state => ({...state, category: categories[idx].id}));
              setFinance(state => ({...state, kind: categories[idx].kind}));
            }}
          >
            {categories.length > 0 && categories.map((category, idx) => {
              return (
                <option key={idx} value={idx}>{overwriteCategoryName(category.name, category.kind, category.type)}</option>
              )
            })}
          </select>
        </label>
        <label className="flex justify-between item-center mb-6">
          <span className="flex item-center w-24">
            金額
            <span className="text-red-500 ml-1.5">*</span>
          </span>
          <input
            type="number"
            className="flex-1 ml-10 rounded"
            value={finance.amount}
            onChange={(e) => {
              setFinance(state => ({...state, amount: Number(e.target.value)}));
            }}
          />
        </label>
        <label className="flex justify-between item-center">
          <span className="flex item-center w-24">備考</span>
          <input
            type="text"
            className="flex-1 ml-10 rounded"
            value={finance.description}
            onChange={(e) => {
              setFinance(state => ({...state, description: e.target.value}));
            }}
          />
        </label>
      </div>
    </Modal>
  )
}

export {FormModal}