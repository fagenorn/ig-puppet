import { RxDatabase, RxCollection, RxDocument } from 'rxdb';
import SessionOptions from './session';
import UserPrefs from './user-prefs';

// Session
type SessionDocument = RxDocument<SessionOptions>;

type SessionCollection = RxCollection<SessionOptions>;

// User Prefs
type UserPrefsDocument = RxDocument<UserPrefs>;

type UserPrefsCollection = RxCollection<UserPrefs>;

type IgDatabaseCollections = {
  sessions: SessionCollection;
  userprefs: UserPrefsCollection;
};

type IgDatabase = RxDatabase<IgDatabaseCollections>;
