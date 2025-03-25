// src/GlobalState.js
import React, { createContext, useState } from 'react';

// Create a Context
export const GlobalContext = createContext();
export const UserContext = createContext();
export const ItemContext = createContext();
export const UserIdContext = createContext();


// Create a Provider component
export const GlobalProvider = ({ children }) => {
    const [globalState, setGlobalState] = useState("Login");
    const [user, setUser] = useState(null);
    const [item, setItem] = useState(null);
    const [userId, setUserId] = useState(null);

    return (
        <GlobalContext.Provider value={{ globalState, setGlobalState }}>
            <UserContext.Provider value={{ user, setUser }}>
                <ItemContext.Provider value={{item, setItem}}>
                    <UserIdContext.Provider value={{userId, setUserId}}> 
                        {children}
                    </UserIdContext.Provider>
                </ItemContext.Provider>
            </UserContext.Provider>
        </GlobalContext.Provider>
    );
};