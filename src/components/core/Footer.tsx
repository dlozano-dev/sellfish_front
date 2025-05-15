import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation();


    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng).then();
    };

    return (
        <div className='flex justify-between items-center px-4 w-full h-20 bg-white shadow-sm relative z-50'>
            <span>{t("Profile")}</span>

            {/* Language Selector */}
            <div className="ml-4">
                <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                    <option value="fr">FR</option>
                    <option value="de">DE</option>
                </select>
            </div>
        </div>
    );
};
