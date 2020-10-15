import { useEffect, useState } from 'react';
import { RxDocument } from 'rxdb';
import { Subscription } from 'rxjs';
import SessionOptions from '../types/session';
import IgDatabase from '../utils/database';

export default function Sessions(): [
  // eslint-disable-next-line @typescript-eslint/ban-types
  RxDocument<SessionOptions, {}>[],
  boolean
] {
  const [sessions, setSessions] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-types
    [] as RxDocument<SessionOptions, {}>[]
  );
  const [loading, setisLoading] = useState(true);
  const subs: Subscription[] = [];

  useEffect(() => {
    const currentSub = IgDatabase.database.sessions
      .find({
        selector: {},
        sort: [{ id: 'asc' }],
      })
      .$.subscribe((result) => {
        if (!result) {
          return;
        }

        setSessions(result);
        setisLoading(false);
      });

    subs.push(currentSub);

    return () => subs.forEach((sub) => sub.unsubscribe());
  }, [subs]);

  return [sessions, loading];
}
