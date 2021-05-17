import {useEffect, useState, Fragment} from 'react';
import {useRouter} from 'next/router';
import firebase, {auth, db} from '../lib/firebase';
import {Category} from '../models/category';
import {Kinds} from '../models/kinds';
import {Finance, initFinance} from '../models/finance';
import {YearMonth} from '../models/yearMonth';
import {currency} from '../utility/currency';
import {convertYearMonth, convertMonthDay} from '../utility/date';
import {uuid} from '../utility/uuid';

const Index = () => {
  const router = useRouter();
  const financesCollectRef = db.collection('finances');

  const [uid, setUid] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [finances, setFinances] = useState<Array<Finance>>([]);
  const [finance, setFinance] = useState<Finance>(initFinance());
  const [yearMonths, setYearMonths] = useState<Array<YearMonth>>([]);
  const [yearMonth, setYearMonth] = useState<YearMonth | null>(null);
  const [totalSum, setTotalSum] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [selectedRowIdx, setSelectedRowIdx] = useState<number | null>(null);

  const checkIsLoggedIn = () => {
    auth.onAuthStateChanged(user => {
      if (!user) return router.push('/login');
      setUid(user.uid);
    });
  };

  const logout = () => {
    auth.signOut();
  };

  const fetchYearMonths = () => {
    if (uid) {
      financesCollectRef.doc(uid).collection('yearMonths').get().then(snapshot => {
        const yearMonths: Array<YearMonth> = [];
        let totalSum: number = 0;
        snapshot.forEach(doc => {
          if (!doc.exists) return;
          const data = doc.data() as YearMonth;
          if (!data) return;
          yearMonths.push(data);
          totalSum += data.total;
        });
        setYearMonths(yearMonths.reverse());
        setYearMonth(yearMonths[0]);
        setTotalSum(totalSum);
      });
    }
  };

  const fetchCategories = () => {
    db.collection('categories').get().then(snapshot => {
      const categories: Array<Category> = [];
      snapshot.forEach(doc => {
        if (!doc.exists) return;
        const data = doc.data() as Category;
        if (!data) return;
        categories.push(data);
      });
      categories.sort((a, b) => {
        if (a.id > b.id) return 1;
        return -1;
      });
      setCategories(categories);
    });
  };

  const overwriteCategoryName = (name: string, kind: number, type: string): string => {
    if (kind === Kinds.Income) return `${name} [収入]`;
    if (kind === Kinds.Expenditure) return `${name} [支出 - ${type}]`;
    return name;
  }

  const fetchFinances = () => {
    if (uid && yearMonth) {
      financesCollectRef.doc(uid).collection(yearMonth.yearMonth).orderBy('traded_at').get().then(snapshot => {
        const finances: Array<Finance> = [];
        snapshot.forEach(doc => {
          if (!doc.exists) return;
          const data = doc.data() as Finance;
          if (!data) return;
          finances.push(data);
        });
        setFinances(finances);
        calcBalance(finances);
      });
    }
  };

  const calcBalance = (finances: Array<Finance>) => {
    let income = 0;
    let expenditure = 0;
    for (const finance of finances) {
      if (finance.kind === Kinds.Income) income += finance.amount;
      if (finance.kind === Kinds.Expenditure) expenditure += finance.amount;
    }
    setBalance(income - expenditure);
  };

  const generateUuid = () => {
    setFinance(state => ({...state, uuid: uuid()}));
  };

  const createFinance = async () => {
    const ym = convertYearMonth(finance.traded_at);
    const res = await financesCollectRef.doc(uid).collection(ym).doc(finance.uuid).set(finance);
    const yearMonthsDocRef = financesCollectRef.doc(uid).collection('yearMonths').doc(ym);
    const d = await yearMonthsDocRef.get();
    const amount = finance.kind === Kinds.Expenditure ? -finance.amount : finance.amount;
    if (d.exists)
      await yearMonthsDocRef.update({
        yearMonth: ym,
        total: firebase.firestore.FieldValue.increment(amount),
      });
    else
      await yearMonthsDocRef.set({
        yearMonth: ym,
        total: amount,
      });
    return res;
  };

  const deleteFinance = async (finance: Finance) => {
    const ym = convertYearMonth(finance.traded_at);
    const res = await financesCollectRef.doc(uid).collection(ym).doc(finance.uuid).delete();
    const c = await financesCollectRef.doc(uid).collection(ym).get();
    const amount = finance.kind === Kinds.Income ? -finance.amount : finance.amount;
    if (c.docs.length <= 0)
      await financesCollectRef.doc(uid).collection('yearMonths').doc(ym).delete();
    else
      await financesCollectRef.doc(uid).collection('yearMonths').doc(ym).update({
        yearMonth: ym,
        total: firebase.firestore.FieldValue.increment(amount),
      });
    return res;
  };

  const convertIdToNameOfCategory = (categoryId: number): string => {
    if (!categories) return '';
    for (const category of categories)
      if (category.id === categoryId) return category.name;
    return '';
  };

  const showTableRow = () => {
    return finances.map((finance, idx) => {
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
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded mr-4"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-10 rounded"
                      onClick={async () => {
                        await deleteFinance(finance);
                        fetchFinances();
                        fetchYearMonths();
                      }}
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            )
          }
        </Fragment>
      );
    });
  };

  useEffect(checkIsLoggedIn, []);
  useEffect(fetchCategories, []);
  useEffect(fetchYearMonths, [uid]);
  useEffect(fetchFinances, [uid, yearMonth]);
  useEffect(generateUuid, [finances]);

  console.log(categories)

  return (
    <div className="container mx-auto pt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        {yearMonths.length > 0 && (
          <div>
            表示年月
            <select
              className="rounded ml-3"
              onChange={e => {
                const idx = Number(e.target.value)
                setYearMonth(yearMonths[idx]);
                fetchFinances();
              }}
            >
              {yearMonths.map((ym, idx) => {
                return (
                  <option key={idx} value={idx}>{ym.yearMonth}</option>
                )
              })}
            </select>
          </div>
        )}
        <button type="button" className="inline-block text-blue-400 underline ml-auto" onClick={logout}>ログアウト</button>
      </div>
      <form>
        <label>
          日付
          <input type="date" value={finance.traded_at} onChange={(e) => {
            setFinance(state => ({...state, traded_at: e.target.value}));
          }} />
        </label>
        <label>
          カテゴリ
          <select onChange={(e) => {
            const idx = Number(e.target.value);
            setFinance(state => ({...state, category: categories[idx].id}));
            setFinance(state => ({...state, kind: categories[idx].kind}));
          }}>
            {categories.length > 0 && categories.map((category, idx) => {
              return (
                <option key={idx} value={idx}>{overwriteCategoryName(category.name, category.kind, category.type)}</option>
              )
            })}
          </select>
        </label>
        <label>
          金額
          <input type="number" value={finance.amount} onChange={(e) => {
            setFinance(state => ({...state, amount: Number(e.target.value)}));
          }} />
        </label>
        <label>
          備考
          <input type="text" value={finance.description} onChange={(e) => {
            setFinance(state => ({...state, description: e.target.value}));
          }} />
        </label>
        <button type="button" onClick={async () => {
          await createFinance();
          fetchFinances();
          fetchYearMonths();
        }}>追加</button>
      </form>
      {finances.length > 0 && (
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
            {showTableRow()}
          </tbody>
        </table>
      )}
      {finances.length <= 0 && (
        <p>該当するデータがありません。</p>
      )}
      <div className="text-right">
        <div>
          収支:&nbsp;
          <span className={balance < 0 ? 'text-red-500' : undefined}>
            {balance > 0 ? balance === 0 ? 'プラマイゼロ' : '黒字' : '赤字'}
          </span>
          (
          <span className={balance < 0 ? 'text-red-500' : undefined}>{currency(balance)}</span>
          )
        </div>
        <div>
          全財産:&nbsp;
          <span className={totalSum < 0 ? 'text-red-500' : undefined}>{currency(totalSum)}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
