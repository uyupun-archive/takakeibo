import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {auth, db} from '../lib/firebase';

const Index = () => {
  const router = useRouter();
  const financesCollectRef = db.collection('finances');

  const [uid, setUid] = useState(null);
  const [categories, setCategories] = useState(null);
  const [kinds, setKinds] = useState(null);
  const [finances, setFinances] = useState(null);

  const checkIsLoggedIn = () => {
    auth.onAuthStateChanged(user => {
      if (!user) return router.push('/login');
      setUid(user.uid);
    });
  };

  const logout = e => {
    auth.signOut();
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
    if (uid)
      financesCollectRef.doc(uid).get().then(doc => {
        if (doc.exists) setFinances(doc.data().payload);
      });
  };

  useEffect(checkIsLoggedIn, []);
  useEffect(fetchKinds, []);
  useEffect(fetchCategories, []);
  useEffect(fetchFinances, [uid]);

  return (
    <div>
      <h1>トップ</h1>
      <form onSubmit={logout}>
        <button type="submit">ログアウト</button>
      </form>
      <form>
        <label>
          日付
          <input type="date" />
        </label>
        <label>
          カテゴリ
          <select>
            {categories && categories.map((category, idx) => {
              return (
                <option key={idx} value={category.name}>{category.display_name}</option>
              )
            })}
          </select>
        </label>
        <label>
          種別
          <select>
            {kinds && kinds.map((kind, idx) => {
              return (
                <option key={idx} value={kind.name}>{kind.display_name}</option>
              )
            })}
          </select>
        </label>
        <label>
          金額
          <input type="number" />
        </label>
        <label>
          備考
          <input type="text" />
        </label>
        <button type="submit">追加</button>
      </form>
      <table border="1">
        <thead>
          <tr>
            <th>日付</th>
            <th>カテゴリ</th>
            <th>収入</th>
            <th>支出</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {finances && finances.map((finance, idx) => {
            return (
              <tr key={idx}>
                <td>{finance.traded_at}</td>
                <td>{finance.category}</td>
                <td>{finance.income}</td>
                <td>{finance.expenditure}</td>
                <td>
                  <button type="button">編集</button>
                </td>
                <td>
                  <button type="button">削除</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
