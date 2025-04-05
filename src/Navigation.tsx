import React, { createContext, useState, ReactNode } from 'react';
import {EMPTY} from "./utils/Constants.tsx";
import { PrimeReactProvider } from 'primereact/api';

// Define types for contexts
interface GlobalContextType {
    globalState: string;
    setGlobalState: React.Dispatch<React.SetStateAction<string>>;
}

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserContextType {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

interface UserIdContextType {
    userId: string | null;
    setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create Contexts
// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

// Define Provider props type
interface GlobalProviderProps {
    children: ReactNode;
}

// Create a Provider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [globalState, setGlobalState] = useState<string>(EMPTY);
    const [user, setUser] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <PrimeReactProvider>
            <GlobalContext.Provider value={{ globalState, setGlobalState }}>
                <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
                    <UserContext.Provider value={{ user, setUser }}>
                        <UserIdContext.Provider value={{ userId, setUserId }}>
                            {children}
                        </UserIdContext.Provider>
                    </UserContext.Provider>
                </LoadingContext.Provider>
            </GlobalContext.Provider>
        </PrimeReactProvider>
    );
};
