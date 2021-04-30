import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {auth} from '../lib/firebase';

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const checkIsLoggedIn = () => {
    auth.onAuthStateChanged(user => {
      if (user) return router.push('/');
    });
  };

  const login = (e: {preventDefault: () => void;}) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        router.push('/');
      })
      .catch(err => {
        setErrMsg('メールアドレス又はパスワードに誤りがあります。');
      });
  };

  useEffect(checkIsLoggedIn, []);

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={login}>
        <label>
          メールアドレス
          <input
            type="text"
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">ログイン</button>
        {errMsg && (
          <p>{ errMsg }</p>
        )}
      </form>
    </div>
  )
}

export default Login;
