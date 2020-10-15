import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { AtomicUpdateFunction } from 'rxdb';
import UserPrefsOption from '../types/user-prefs';
import IgDatabase from '../utils/database';

export default function UserPrefs(): [
  UserPrefsOption,
  boolean,
  (fun: AtomicUpdateFunction<UserPrefsOption>) => void
] {
  const isMounted = useRef(true);
  const [userprefs, setUserPrefs] = useState({} as UserPrefsOption);
  const [loading, setisLoading] = useState(true);
  const updateUserPrefs = (fun: AtomicUpdateFunction<UserPrefsOption>) => {
    IgDatabase.database.userprefs
      .findOne()
      .exec()
      .then((result) => result?.atomicUpdate(fun))
      .catch(() => null);
  };
  const [sub, setSub] = useState({} as Subscription);

  useEffect(() => {
    IgDatabase.database.userprefs
      .findOne()
      .exec()
      .then((prefs) => {
        if (!isMounted.current) return prefs;
        if (!prefs) throw new Error('Userprefs not found');
        setSub(
          prefs.$.subscribe((curr) => {
            if (!isMounted.current) return;
            setUserPrefs(curr);
            setisLoading(false);
          })
        );
        return prefs;
      })
      .catch(() => null);

    return () => {
      if (sub.unsubscribe) sub.unsubscribe();
      isMounted.current = false;
    };
  }, [sub]);

  return [userprefs, loading, updateUserPrefs];
}
