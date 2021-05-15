import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {auth} from '../lib/firebase';
import Image from 'next/image'

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

  const login = () => {
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
    <div className="container mx-auto pt-4 px-4">
      <div className="text-center mb-16">
        {/* logo.pngの整数比 209 : 191 */}
        <Image src="/logo.png" width="418" height="382" />
      </div>
      <form>
        <label className="flex justify-between items-center mb-4">
          <span className="w-48 whitespace-nowrap">メールアドレス</span>
          <input
            type="text"
            className="w-full rounded"
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label className="flex justify-between items-center mb-8">
          <span className="w-48 whitespace-nowrap">パスワード</span>
          <input
            type="password"
            className="w-full rounded"
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <div className="text-center">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded"
            onClick={login}
          >
              ログイン
          </button>
        </div>
        {errMsg && (
          <p>{ errMsg }</p>
        )}
      </form>
    </div>
  )
}

export default Login;
