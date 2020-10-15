import { useCallback, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import launch from 'launchpad';
import { AtomicUpdateFunction } from 'rxdb';
import UserPrefsOption from '../types/user-prefs';
import IgDatabase from '../utils/database';

export default function UserPrefs(): [
  UserPrefsOption,
  boolean,
  (fun: AtomicUpdateFunction<UserPrefsOption>) => void,
  () => Promise<void>
] {
  const isMounted = useRef(true);
  const [userprefs, setUserPrefs] = useState({} as UserPrefsOption);
  const [loading, setisLoading] = useState(true);
  const getFirefoxInstallPath = () =>
    new Promise<string>((resolve) => {
      launch.local((_err, local) => {
        local.browsers((__err, browsers) => {
          if (!browsers) {
            resolve('');
            return;
          }

          for (let index = 0; index < browsers.length; index += 1) {
            const browser = browsers[index];
            if (browser.name === 'firefox') {
              resolve(browser.binPath);
              return;
            }
          }

          resolve('');
        });
      });
    });
  const updateUserPrefs = (fun: AtomicUpdateFunction<UserPrefsOption>) => {
    IgDatabase.database.userprefs
      .findOne()
      .exec()
      .then((result) => result?.atomicUpdate(fun))
      .catch(() => null);
  };
  const autoDetectBrowserPath = useCallback(async () => {
    if (!isMounted.current) return;
    setisLoading(true);
    const path = await getFirefoxInstallPath();
    if (path)
      updateUserPrefs((prefs) => {
        prefs.browserPath = path;
        return prefs;
      });
    setisLoading(false);
  }, []);
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
          })
        );
        return prefs;
      })
      .catch(() => null);

    return () => {
      if (sub.unsubscribe) sub.unsubscribe();
    };
  }, [sub]);

  useEffect(() => {
    IgDatabase.database.userprefs
      .findOne()
      .exec()
      .then(async (result) => {
        if (!isMounted.current) return result;
        if (!result) throw new Error('Userprefs not found');
        if (!result.browserPath) await autoDetectBrowserPath();
        setisLoading(false);
        return result;
      })
      .catch(() => null);

    return () => {
      isMounted.current = false;
    };
  }, [autoDetectBrowserPath]);

  return [userprefs, loading, updateUserPrefs, autoDetectBrowserPath];
}
