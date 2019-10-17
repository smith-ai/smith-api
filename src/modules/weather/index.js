import { action, actions } from '@smith-ai/smith-actions';
import OpenWeather from './openWeather';

const weather = new OpenWeather();

const getConditions = (result) => result.weather
    .map((weatherCond) => weatherCond.main)
    .join(' and ')
    .toLowerCase();

action('what is the weather like in', async (city) => {
    const result = await weather.inCity(city);

    const conditions = getConditions(result)

    return `Right now in ${city}, you can expect ${conditions}`;
});

action('what is the forecast for', async (city) => {
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const result = await weather.forCity(city);

    const forecasts = result.list
        .filter((forecast) => forecast.dt_txt.includes('12:00:00'))
        .map((forecast) => {
            const date = new Date(forecast.dt_txt);
            const day = days[date.getDay()];

            const conditions = getConditions(forecast);

            return `On ${day}, you can expect ${conditions}.`;
        })
        .join(' ');

    return forecasts;
});

export { actions };