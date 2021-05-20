import {useState, Fragment} from 'react';
import {Finance} from '../models/finance';
import {Category} from '../models/category';
import {Kinds} from '../models/kinds';
import {currency} from '../utility/currency';
import {convertMonthDay} from '../utility/date';
import {Button} from '../components/button';

interface Props {
  categories: Array<Category>;
  finances: Array<Finance>;
  clickDeleteBtn: (finance: Finance) => void;
}

const Table = (props: Props) => {
  const { categories, finances, clickDeleteBtn } = props;
  if (categories.length <= 0 || finances.length <= 0) {
    return <p>該当するデータがありません。</p>;
  }

  const [selectedRowIdx, setSelectedRowIdx] = useState<number | null>(null);

  const convertIdToNameOfCategory = (categoryId: number): string => {
    for (const category of categories)
      if (category.id === categoryId) return category.name;
    return '';
  };

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
                  className={selectedRowIdx === idx ? 'cursor-pointer bg-blue-50' : 'cursor-pointer'}
                  onClick={() => {
                    if (selectedRowIdx === idx) setSelectedRowIdx(null);
                    else setSelectedRowIdx(idx);
                  }}
                >
                  {/* TODO: アイコンに変える */}
                  <td className="text-center pt-4">
                    { selectedRowIdx === idx ? '▼' : '▶︎' }
                  </td>
                  <td className="text-center pt-4">{convertMonthDay(finance.traded_at)}</td>
                  <td className="text-center pt-4">{convertIdToNameOfCategory(finance.category)}</td>
                  <td className="text-right pt-4">{finance.kind === Kinds.Income && currency(finance.amount)}</td>
                  <td className="text-right pt-4">{finance.kind === Kinds.Expenditure && currency(finance.amount)}</td>
                </tr>
                {
                  selectedRowIdx === idx && (
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
                          <Button customClass="mr-4">編集</Button>
                          <Button
                            color="red"
                            onClick={() => {
                              clickDeleteBtn(finance);
                              setSelectedRowIdx(null);
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
