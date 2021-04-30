import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {auth, db} from '../lib/firebase';

const Index = () => {
  const router = useRouter();
  const financesCollectRef = db.collection('finances');

  const [uid, setUid] = useState(null);
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

  const fetchFinances = () => {
    if (uid)
      financesCollectRef.doc(uid).get().then(doc => {
        if (doc.exists) setFinances(doc.data().data);
      });
  };

  useEffect(checkIsLoggedIn, []);
  useEffect(fetchFinances, [uid]);

  return (
    <div>
      <h1>トップ</h1>
      <form onSubmit={logout}>
        <button type="submit">ログアウト</button>
      </form>
      <table border="1">
        <thead>
          <tr>
            <th>日付</th>
            <th>カテゴリ</th>
            <th>収入</th>
            <th>支出</th>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
