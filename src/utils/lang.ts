import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './langs/es.json';
import en from './langs/en.json';
import de from './langs/de.json';
import it from './langs/it.json';
import fr from './langs/fr.json';

const resources = { es, en, de, it, fr };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
i18n.use(initReactI18next).init({
    lng: 'en',
    resources,
    fallbackLng: 'en',
}).then(() => {});

export default { i18n };