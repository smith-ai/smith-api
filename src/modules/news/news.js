import axios from 'axios';

export default class News {
    /**
     * Constructor. Create a new News API client
     * using the given API key.
     * 
     * @param {string} apiKey News API key
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Helper function for executing a News API request.
     * 
     * @param {string} endpoint API endpoint to hit
     * @param {object} params GET parameters to use in the request
     */
    async doRequest(endpoint, params) {
        params.apiKey = this.apiKey;

        const result = await axios({
            url: `https://newsapi.org/v2/${endpoint}`,
            method: 'get',
            params,
        });

        return result.data;
    }

    /**
     * Get the top headlines for the given conditions.
     * 
     * @param {object} param0 Parameters to retrieve headlines for
     * @param {number} pageSize Number of articles to include in a page
     * @param {number} page Page to retrieve
     */
    async headlines({ keyword = null, country = null, category = null, source = null }, pageSize = 5, page = 1) {
        const params = { pageSize, page };

        if (keyword) params.q = keyword;

        if (source) {
            params.sources = source;
        } else {
            if (country) params.country = country;
            if (category) params.category = category;
        }

        const result = await this.doRequest('top-headlines', params);

        return result.articles;
    }
}
