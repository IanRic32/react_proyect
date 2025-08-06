    import * as React from "react";
    import { initialState } from "./globalConstants";
    import { globalReducer } from "./globalReducer";

    const GlobalContext = React.createContext();

    export default function GlobalProvider({ children }) {
        const [state, dispatch] = React.useReducer(globalReducer, initialState);
        const value = React.useMemo(() => ({ state, dispatch }), [state]);

        return (
            <GlobalContext.Provider value={value}>
            {children}
            </GlobalContext.Provider>
        );
    }


