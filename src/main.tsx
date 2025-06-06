import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GlobalProvider } from './Navigation';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <GlobalProvider>
        <App />
    </GlobalProvider>
)
