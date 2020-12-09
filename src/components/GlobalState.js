import React, {createContext, useState} from 'react'

export const GlobalContext = createContext();

const initialState = {
    currentUser: {}
}

const GlobalState = ({children}) => {
    const [state, setState] = useState(initialState);

    return (
        <GlobalContext.Provider value={[state, setState]}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalState;