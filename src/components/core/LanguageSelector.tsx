import { useTranslation } from 'react-i18next';

export const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng).then();
    };

    return (
        <div className="mr-4 mb-4 absolute bottom-0 right-0">
            {/* Language Selector */}
            <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="it">IT</option>
            </select>
        </div>
    );
};
