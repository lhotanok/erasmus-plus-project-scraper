import { Actor, log } from 'apify';
import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';
import { buildStartRequests } from './search-projects-api.js';
import { InputSchema } from './types/InputSchema.js';
import { CrawlerState } from './types/CrawlerState.js';

await Actor.init();

const input = await Actor.getInput<InputSchema>();

if (!input) {
    throw new Error('No input found. Please, provided input object in: storage/key_value_stores/default/INPUT.json');
}

if (input.debugMode) {
    log.setLevel(log.LEVELS.DEBUG);
}

const { extractSimpleProjects, proxyConfiguration: proxyConfigurationOptions } = input;

const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfigurationOptions);

const crawler = new CheerioCrawler({
    proxyConfiguration,
    navigationTimeoutSecs: 280,
    maxRequestRetries: 10,
    additionalMimeTypes: ['application/json'],
    requestHandler: router,
});

await crawler.useState<CrawlerState>({ extractSimpleProjects });

await crawler.run(buildStartRequests(input));

await Actor.exit();
