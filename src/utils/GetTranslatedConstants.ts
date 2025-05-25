import { t } from 'i18next';

export function translateOptions(options: { name: string, value: string }[]) {
    return options.map(state => ({
        ...state,
        name: t(state.name),
    }));
}