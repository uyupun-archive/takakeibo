import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import firebase, {auth, db} from '../lib/firebase';
import {Category} from '../models/category';
import {Kind, KindIds} from '../models/kind';
import {Finance, initFinance} from '../models/finance';
import {currency} from '../utility/currency';
import {convertYearMonth} from '../utility/date';
import {uuid} from '../utility/uuid';

const Index = () => {
  const router = useRouter();
  const financesCollectRef = db.collection('finances');

  const [uid, setUid] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<Category> | null>(null);
  const [kinds, setKinds] = useState<Array<Kind> | null>(null);
  const [finances, setFinances] = useState<Array<Finance>>([]);
  const [finance, setFinance] = useState<Finance>(initFinance());
  const [yearMonths, setYearMonths] = useState<Array<string>>([]);
  const [yearMonth, setYearMonth] = useState<string>('');

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
      financesCollectRef.doc(uid).collection('yearMonths').doc('YWlxrSN0RZIbubZDBsFs').get().then(doc => {
        if (doc.exists) {
          setYearMonths(doc.data().payload);
          setYearMonth(doc.data().payload[0]);
        }
      });
    }
  };

  const fetchCategories = () => {
    db.collection('categories').doc('HCRNyazYt1Fvm7CrlQP5').get().then(doc => {
      if (doc.exists) setCategories(doc.data().payload);
    });
  };

  const fetchKinds = () => {
    db.collection('kinds').doc('iaI2xd2ukshFDD8IXe6j').get().then(doc => {
      if (doc.exists) setKinds(doc.data().payload);
    });
  };

  const fetchFinances = () => {
    if (uid && yearMonth) {
      financesCollectRef.doc(uid).collection(yearMonth).orderBy('traded_at').get().then(snapshot => {
        const finances = [];
        snapshot.forEach(doc => {
          if (doc.exists) finances.push(doc.data());
        });
        setFinances(finances);
      });
    }
  };

  const generateUuid = () => {
    setFinance(state => ({...state, uuid: uuid()}));
  };

  const createFinance = async () => {
    const ym = convertYearMonth(finance.traded_at);
    financesCollectRef.doc(uid).collection('yearMonths').doc('YWlxrSN0RZIbubZDBsFs').update({
      payload: firebase.firestore.FieldValue.arrayUnion(ym),
    });
    return await financesCollectRef.doc(uid).collection(ym).doc(finance.uuid).set(finance);
  };

  const deleteFinance = (finance: Finance) => {
    const ym = convertYearMonth(finance.traded_at);
    return financesCollectRef.doc(uid).collection(ym).doc(finance.uuid).delete().then(res => {
      financesCollectRef.doc(uid).collection(ym).get().then(res => {
        if (res.docs.length <= 0) financesCollectRef.doc(uid).collection('yearMonths').doc('YWlxrSN0RZIbubZDBsFs').update({
          payload: firebase.firestore.FieldValue.arrayRemove(ym),
        });
      });
    });
  };

  const convertIdToNameOfCategory = (categoryId: number): string => {
    for (const category of categories) {
      if (category.id === categoryId) return category.name;
    }
  };

  useEffect(checkIsLoggedIn, []);
  useEffect(fetchKinds, []);
  useEffect(fetchCategories, []);
  useEffect(fetchYearMonths, [uid]);
  useEffect(fetchFinances, [uid, yearMonth]);
  useEffect(generateUuid, [finances]);

  return (
    <div>
      <h1>トップ</h1>
      <button type="button" onClick={logout}>ログアウト</button>
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
            setFinance(state => ({...state, category: Number(e.target.value)}));
          }}>
            {categories && categories.map((category, idx) => {
              return (
                <option key={idx} value={category.id}>{category.name}</option>
              )
            })}
          </select>
        </label>
        <label>
          種別
          <select onChange={(e) => {
            setFinance(state => ({...state, kind: Number(e.target.value)}));
          }}>
            {kinds && kinds.map((kind, idx) => {
              return (
                <option key={idx} value={kind.id}>{kind.name}</option>
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
      {yearMonths.length > 0 && (
        <select onChange={(e) => {
          setYearMonth(e.target.value);
          fetchFinances();
        }}>
          {yearMonths.map((ym, idx) => {
            return (
              <option key={idx} value={ym}>{ym}</option>
            )
          })}
        </select>
      )}
      {finances.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>日付</th>
              <th>カテゴリ</th>
              <th>収入</th>
              <th>支出</th>
              <th>備考</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {finances && finances.map((finance, idx) => {
              return (
                <tr key={idx}>
                  <td>{finance.traded_at}</td>
                  <td>{convertIdToNameOfCategory(finance.category)}</td>
                  <td>{finance.kind === KindIds.Income && currency(finance.amount)}</td>
                  <td>{finance.kind === KindIds.Expenditure && currency(finance.amount)}</td>
                  <td>{finance.description}</td>
                  <td>
                    <button type="button">編集</button>
                  </td>
                  <td>
                    <button type="button" onClick={async () => {
                      await deleteFinance(finance);
                      fetchFinances();
                      fetchYearMonths();
                    }}>削除</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {finances.length <= 0 && (
        <p>該当するデータがありません。</p>
      )}
    </div>
  );
};

export default Index;
