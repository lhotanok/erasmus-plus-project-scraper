import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';
import { buildStartRequests } from './api/search-projects-api.js';
import { InputSchema } from './types/InputSchema.js';

await Actor.init();

const input = await Actor.getInput<InputSchema>();

if (!input) {
    throw new Error('No input found. Please, provided input object in: storage/key_value_stores/default/INPUT.json');
}

const proxyConfiguration = await Actor.createProxyConfiguration(input.proxyConfiguration);

const crawler = new CheerioCrawler({
    proxyConfiguration,
    navigationTimeoutSecs: 280,
    additionalMimeTypes: ['application/json'],
    requestHandler: router,
});

await crawler.run(buildStartRequests(input));

await Actor.exit();
