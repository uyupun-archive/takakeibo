import {useState} from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = e => {
    e.preventDefault();
    console.log(email);
    console.log(password);
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
      </form>
    </div>
  )
}

export default Login;
