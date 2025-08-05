import { createContext } from 'react';

export const ChatContext = createContext({
  state: null,
  dispatch: () => {},
});