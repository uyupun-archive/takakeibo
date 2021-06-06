import {useState} from 'react';
import {Finance} from '../models/finance';
import {Category} from '../models/category';
import {Kinds} from '../models/kinds';
import {Modal} from './modal'
import {convertYearMonth, convertLastDay, convertDay} from '../utility/date'

interface Props {
  finance: Finance;
  categories: Array<Category>;
  isVisible: boolean;
  cancelText?: string;
  submitText?: string;
  submitBtnColor?: 'blue' | 'red';
  mode: 'create' | 'update';
  onCancel: () => void;
  onSubmit: (finance: Finance) => void;
}

const FormModal = (props: Props) => {
  const {categories, isVisible, cancelText, submitText, submitBtnColor, mode, onCancel, onSubmit} = props;

  if (!props.finance.uuid || !categories.length || !isVisible) return null;

  const [finance, setFinance] = useState<Finance>(props.finance);
  const [selectedDay, setSelectedDay] = useState<string>(mode === 'create' ? '' : convertDay(props.finance.traded_at));

  const overwriteCategoryName = (name: string, kind: number, type: string): string => {
    if (kind === Kinds.Income) return `${name} [収入]`;
    if (kind === Kinds.Expenditure) return `${name} [支出 - ${type}]`;
    return name;
  }

  const getOptionElements = (): Array<JSX.Element> => {
    const options = [];
    for (let i = 1; i <= Number(convertLastDay(finance.traded_at)); i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  }

  const getSelectedFinance = (): Finance => {
    const yearMonth = convertYearMonth(finance.traded_at);
    const shapedSelectedDay = Number(selectedDay) <= 9 ? `0${selectedDay}` : selectedDay
    return {...finance, traded_at: `${yearMonth}-${shapedSelectedDay}`}
  }

  return (
    <Modal
      isVisible={isVisible}
      cancelText={cancelText}
      submitText={submitText}
      submitBtnColor={submitBtnColor}
      submitBtnDisabled={!(finance.traded_at && finance.category && finance.amount)}
      onCancel={() => onCancel()}
      onSubmit={() => onSubmit(
        mode === 'create' ? finance : getSelectedFinance()
      )}
    >
      <div>
        <label className="flex justify-between item-center mb-6">
          <span className="flex item-center w-24">
            日付
            <span className="text-red-500 ml-1.5">*</span>
          </span>
          {
            mode === 'create'
              ? <input
                  type="date"
                  className="flex-1 ml-10 rounded"
                  value={finance.traded_at}
                  onChange={(e) => {
                    setFinance(state => ({...state, traded_at: e.target.value}));
                  }}
                />
              : <span className="flex-1 ml-10">
                  <span>{convertYearMonth(finance.traded_at)}</span>
                  <select
                    className="ml-5 rounded"
                    defaultValue={Number(convertDay(finance.traded_at))}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    {getOptionElements()}
                  </select>
                </span>
          }
        </label>
        <label className="flex justify-between item-center mb-6">
          <span className="flex item-center w-24">
            カテゴリ
            <span className="text-red-500 ml-1.5">*</span>
          </span>
          <select
            className="flex-1 ml-10 rounded"
            value={finance.category}
            onChange={(e) => {
              const categoryId = Number(e.target.value);
              const findCategory = categories.find((category) => category.id === categoryId)
              if (!findCategory) return
              setFinance(state => ({...state, category: findCategory.id}));
              setFinance(state => ({...state, kind: findCategory.kind}));
            }}
          >
            {categories.length > 0 && categories.map((category, idx) => {
              return (
                <option key={idx} value={category.id}>{overwriteCategoryName(category.name, category.kind, category.type)}</option>
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