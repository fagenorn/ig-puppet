import React, { ReactNode, useEffect, useState } from 'react';
import Loading from '../components/Loading';
import IgDatabase from '../utils/database';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  const [loaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const initDb = async () => {
      await IgDatabase.init();
      setIsLoaded(true);
    };

    initDb();
  }, [setIsLoaded]);
  return (
    <>
      {loaded && children}
      {!loaded && Loading()}
    </>
  );
}
