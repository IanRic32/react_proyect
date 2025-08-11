import * as React from "react";

// 1. Estado inicial y tipos de acción
const initialState = {
  messages: [],
  currentChat: [],
};

const ActionTypes = {
  SAVE_HISTORY: "@save_history",
  LOAD_MESSAGES: "@load_messages",
  CURRENT_CHAT: "@current_chat",
};

// 2. Reductor
function globalReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SAVE_HISTORY: {
      if (!state.currentChat?.length) return state;
      
      try {
        const history = JSON.parse(localStorage.getItem("history") || "[]");
        const newChat = {
          title: state.currentChat[0]?.text?.substring(0, 50) || "Nuevo chat",
          content: [...state.currentChat],
          createdAt: new Date().toISOString(),
        };

        const updatedHistory = [newChat, ...history];
        localStorage.setItem("history", JSON.stringify(updatedHistory));

        return {
          ...state,
          messages: updatedHistory,
          currentChat: [],
        };
      } catch (error) {
        console.error("Error saving history:", error);
        return state;
      }
    }

    case ActionTypes.LOAD_MESSAGES: {
      try {
        const history = localStorage.getItem("history");
        if (!history) return { ...state, messages: [] };
        
        return {
          ...state,
          messages: JSON.parse(history),
        };
      } catch (error) {
        console.error("Error loading messages:", error);
        return { ...state, messages: [] };
      }
    }

    case ActionTypes.CURRENT_CHAT: {
      return {
        ...state,
        currentChat: [...action.payload],
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// 3. Creación del Contexto
const GlobalContext = React.createContext();

// 4. Proveedor del Contexto
export function GlobalProvider({ children }) {
  const [state, dispatch] = React.useReducer(globalReducer, initialState);
  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

// 5. Hook personalizado
export function useGlobal() {
  const context = React.useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}