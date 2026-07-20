import { AsyncLocalStorage } from 'async_hooks';

export interface UserContext {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const userContextStorage = new AsyncLocalStorage<UserContext>();
