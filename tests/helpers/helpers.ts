export const MONTHS_SHORT_RU = [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
];

export const MONTHS_RU = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];


export function getSearchDate(daysFromToday: number) {
    const date = new Date();

    date.setDate(date.getDate() + daysFromToday);

    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        searchDate:
            String(date.getDate()).padStart(2, '0') +
            String(date.getMonth() + 1).padStart(2, '0'),
    };
}
//import { MONTHS_RU, MONTHS_SHORT_RU, getSearchDate } from './helpers/helpers.ts';