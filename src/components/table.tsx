import {useState, Fragment} from 'react';
import {Finance} from '../models/finance';
import {Kinds} from '../models/kinds';
import {currency} from '../utility/currency';
import {convertMonthDay} from '../utility/date';
import {Button} from '../components/button';

interface Props {
  finances: Array<Finance>;
  clickUpdateBtn: (finance: Finance) => void;
  clickDeleteBtn: (finance: Finance) => void;
  convertIdToNameOfCategory: (categoryId: number) => string;
}

const Table = (props: Props) => {
  const { finances, clickUpdateBtn, clickDeleteBtn, convertIdToNameOfCategory } = props;
  if (finances.length <= 0) {
    return <p>該当するデータがありません。</p>;
  }

  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);

  return (
    <table className="table-fixed w-full mb-8">
      <thead>
        <tr>
          <th className="w-1/12" />
          <th className="w-2/12">日付</th>
          <th className="w-3/12">カテゴリ</th>
          <th className="w-3/12">収入</th>
          <th className="w-3/12">支出</th>
        </tr>
      </thead>
      <tbody>
        {
          finances.map((finance, idx) => {
            return (
              <Fragment key={idx}>
                <tr
                  className={selectedFinance?.uuid === finance.uuid ? 'cursor-pointer bg-blue-50' : 'cursor-pointer'}
                  onClick={() => {
                    if (selectedFinance?.uuid === finance.uuid) setSelectedFinance(null);
                    else setSelectedFinance(finance);
                  }}
                >
                  {/* TODO: アイコンに変える */}
                  <td className="text-center pt-4">
                    { selectedFinance?.uuid === finance.uuid ? '▼' : '▶︎' }
                  </td>
                  <td className="text-center pt-4">{convertMonthDay(finance.traded_at)}</td>
                  <td className="text-center pt-4">{convertIdToNameOfCategory(finance.category)}</td>
                  <td className="text-right pt-4">{finance.kind === Kinds.Income && currency(finance.amount)}</td>
                  <td className="text-right pt-4">{finance.kind === Kinds.Expenditure && currency(finance.amount)}</td>
                </tr>
                {
                  selectedFinance?.uuid === finance.uuid && (
                    <tr className="bg-blue-50">
                      <td className="p-4" colSpan={5}>
                        {
                          finance.description && (
                            <div className="flex mb-4">
                              <span className="whitespace-nowrap">メモ：&nbsp;</span>
                              <p className="break-all">{finance.description}</p>
                            </div>
                          )
                        }
                        <div className="text-right">
                          <Button
                            customClass="mr-4"
                            onClick={() => {
                              clickUpdateBtn(finance);
                            }}
                          >
                            編集
                          </Button>
                          <Button
                            color="red"
                            onClick={() => {
                              clickDeleteBtn(finance);
                            }}
                          >
                            削除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                }
              </Fragment>
            );
          })
        }
      </tbody>
    </table>
  );
};

export {Table};
