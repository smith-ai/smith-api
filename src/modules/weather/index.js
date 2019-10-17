import { action, actions } from '@smith-ai/smith-actions';
import OpenWeather from './openWeather';

const weather = new OpenWeather();

action('what is the weather like in', async (city) => {
    const result = await weather.inCity(city);

    const conditions = result.weather
        .map((weatherCond) => weatherCond.main)
        .join(' and ')
        .toLowerCase();

    return `Right now in ${city}, you can expect ${conditions}`;
});

export { actions };