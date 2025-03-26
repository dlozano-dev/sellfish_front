import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GlobalProvider } from './Navigation';

ReactDOM.createRoot(document.getElementById('root')).render(
    <GlobalProvider>
        <App />
    </GlobalProvider>
)
