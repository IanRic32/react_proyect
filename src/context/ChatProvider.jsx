import { useReducer } from 'react';
import { ChatContext } from './ChatContext';

const initialState = {
  messages: [],
  history: [],
  currentModel: 'deepseek-r1:1.5b',
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case 'LOAD_HISTORY':
      return {
        ...state,
        messages: action.payload.messages,
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}