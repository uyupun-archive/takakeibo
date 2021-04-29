import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {auth} from '../lib/firebase';

const Index = () => {
  const router = useRouter();

  const checkIsLoggedIn = () => {
    auth.onAuthStateChanged(user => {
      if (!user) return router.push('/');
      console.log(user);
    })
  };

  useEffect(checkIsLoggedIn, []);

  return (
    <div>
      <h1>トップ</h1>
    </div>
  );
};

export default Index;
