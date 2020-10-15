export interface Proxy {
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export default interface SessionOptions {
  id: string;
  proxy?: Proxy;
  username: string;
  password: string;
  status: 'active' | 'inactive' | 'loading';
}
