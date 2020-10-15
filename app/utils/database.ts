import { createRxDatabase, RxDatabase, addRxPlugin, RxJsonSchema } from 'rxdb';
import * as PouchLevelDownPlugin from 'pouchdb-adapter-leveldb';
import leveldown from 'leveldown';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBKeyCompressionPlugin } from 'rxdb/plugins/key-compression';
import { RxDBEncryptionPlugin } from 'rxdb/plugins/encryption';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { remote } from 'electron';
import path from 'path';
import { IgDatabaseCollections } from '../types/rxdb';
import SessionOptions from '../types/session';
import UserPrefs from '../types/user-prefs';

const sessionOptionsSchema: RxJsonSchema<SessionOptions> = {
  title: 'session options schema',
  description: 'A single account session.',
  version: 0,
  keyCompression: true,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    proxy: {
      type: 'object',
      properties: {
        host: {
          type: 'string',
        },
        port: {
          type: 'number',
        },
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
      required: ['host', 'port'],
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    status: {
      type: 'string',
      default: 'inactive',
    },
  },
  encrypted: ['password'],
  required: ['id', 'username', 'password', 'status'],
};

const userPrefsSchema: RxJsonSchema<UserPrefs> = {
  title: 'user prefs schema',
  description: 'user settings and configuration.',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    browserPath: {
      type: 'string',
    },
  },
  required: ['id'],
};

export default class IgDatabase {
  private static readonly userDataPath = remote.app.getPath('userData');

  private static readonly options = {
    name: path.join(IgDatabase.userDataPath, 'clientdb'),
    adapter: leveldown,
    password: 'ig_puppet',
    multiInstance: false,
    eventReduce: true,
  };

  public static database: RxDatabase<IgDatabaseCollections>;

  private static loaded = false;

  public static async init() {
    if (this.loaded) return;

    // Add plugins
    addRxPlugin(RxDBValidatePlugin);
    addRxPlugin(RxDBQueryBuilderPlugin);
    addRxPlugin(RxDBKeyCompressionPlugin);
    addRxPlugin(RxDBEncryptionPlugin);
    addRxPlugin(RxDBUpdatePlugin);
    addRxPlugin(PouchLevelDownPlugin);

    // Setup tables
    this.database = await createRxDatabase<IgDatabaseCollections>(this.options);
    await this.database.collection({
      name: 'sessions',
      schema: sessionOptionsSchema,
    });

    await this.database.collection({
      name: 'userprefs',
      schema: userPrefsSchema,
    });

    if (!(await this.database.userprefs.findOne().exec())) {
      this.database.userprefs.insert({ id: '0' });
    }

    this.loaded = true;
  }

  public static async dispose() {
    await this.database.destroy();
  }
}
