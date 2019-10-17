import axios from "axios";

export default class OpenWeather {
    /**
     * Constructor. Create a new OpenWeather API client
     * using the given API key.
     *
     * @param {string} apiKey OpenWeather API key
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Helper function for executing an OpenWeather API
     * request.
     *
     * @param {object} params GET parameters to use in the request
     */
    async doRequest(endpoint, params) {
        params.APPID = process.env.WEATHER_API_KEY;

        const result = await axios({
            url: `https://api.openweathermap.org/data/2.5/${endpoint}`,
            method: 'get',
            params,
        });

        return result.data;
    }

    /**
     * Retrieve the current weather conditions in the
     * given city by city name.
     *
     * @param {string} city Name of city
     */
    async inCity(city) {
        return this.doRequest('weather', {
            q: city,
        });
    }
}