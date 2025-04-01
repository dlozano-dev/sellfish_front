// src/GlobalState.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { LOGIN } from "./utils/Constants.tsx";
import { Item } from "./components/shop/data/Item.ts";
import { PrimeReactProvider } from 'primereact/api';


// Define types for contexts
interface GlobalContextType {
    globalState: string;
    setGlobalState: React.Dispatch<React.SetStateAction<string>>;
}

interface UserContextType {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ItemContextType {
    item: Item | null;
    setItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

interface UserIdContextType {
    userId: string | null;
    setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create Contexts
// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const ItemContext = createContext<ItemContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

// Define Provider props type
interface GlobalProviderProps {
    children: ReactNode;
}

// Create a Provider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [globalState, setGlobalState] = useState<string>(LOGIN);
    const [user, setUser] = useState<string | null>(null);
    const [item, setItem] = useState<Item | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    return (
        <PrimeReactProvider>
            <GlobalContext.Provider value={{ globalState, setGlobalState }}>
                <UserContext.Provider value={{ user, setUser }}>
                    <ItemContext.Provider value={{ item, setItem }}>
                        <UserIdContext.Provider value={{ userId, setUserId }}>
                            {children}
                        </UserIdContext.Provider>
                    </ItemContext.Provider>
                </UserContext.Provider>
            </GlobalContext.Provider>
        </PrimeReactProvider>
    );
};
