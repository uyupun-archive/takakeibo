import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {auth} from '../lib/firebase';

const Index = () => {
  const router = useRouter();

  const checkIsLoggedIn = () => {
    auth.onAuthStateChanged(user => {
      if (!user) return router.push('/login');
      console.log(user);
    })
  };

  const logout = e => {
    auth.signOut();
  }

  useEffect(checkIsLoggedIn, []);

  return (
    <div>
      <h1>トップ</h1>
      <form onSubmit={logout}>
        <button type="submit">ログアウト</button>
      </form>
    </div>
  );
};

export default Index;
