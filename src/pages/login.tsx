import {useState} from 'react';
import {useRouter} from 'next/router';
import {auth} from '../lib/firebase';

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState(null);

  const login = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        router.push('/');
      })
      .catch(err => {
        setErrMsg('メールアドレス又はパスワードに誤りがあります。');
        console.log(err);
      });
  };

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
