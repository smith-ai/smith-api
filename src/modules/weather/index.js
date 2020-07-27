import { action, actions } from '@smith-ai/smith-actions';
import OpenWeather from './openWeather';

const weather = new OpenWeather(process.env.WEATHER_API_KEY);

const getConditions = (result) => result.weather
  .map((weatherCond) => weatherCond.main)
  .join(' and ')
  .toLowerCase();

const getTemperature = (result) => `${result.main.temp.toFixed()}°C`;

action('what is the temperature in', async (city) => {
  const result = await weather.inCity(city);

  const temperature = getTemperature(result);

  return `Right now in ${city}, it is ${temperature}`;
});

action('what is the weather like in', async (city) => {
  const result = await weather.inCity(city);

  const conditions = getConditions(result);
  const temperature = getTemperature(result);

  return `Right now in ${city}, you can expect ${conditions}, with a temperature of ${temperature}`;
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
        .join('\n');

    return forecasts;
});

export { actions };
