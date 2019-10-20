import { action, actions } from '@smith-ai/smith-actions';
import News from './news';

const news = new News(process.env.NEWS_API_KEY);

const getHeadlines = (articles) => articles
    .map((article) => ` - ${article.title}`)
    .join('.\n');

const getTopHeadlines = (articles) => {
    const headlines = getHeadlines(articles);

    return `Here are the top headlines from ${articles[0].source.name}:\n${headlines}`;
};

action('give me the top headlines for', async (keyword) => {
    const articles = await news.headlines({ keyword });

    const headlines = getHeadlines(articles);

    return `Here are the top headlines for ${keyword}:\n${headlines}`;
});

action('give me the top headlines from', async (source) => {
    const sourceId = source
        .toLowerCase()
        .split(' ')
        .join('-');

    const articles = await news.headlines({
        source: sourceId,
    });

    return getTopHeadlines(articles);
});

action('give me the top headlines', async () => {
    const articles = await news.headlines({ 
        source: 'bbc-news',
    });

    return getTopHeadlines(articles);
});

export { actions };
