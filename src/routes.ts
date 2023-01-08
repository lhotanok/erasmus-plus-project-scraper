import { Actor } from 'apify';
import { Dataset, createCheerioRouter } from 'crawlee';
import { SearchProjectsResponse } from './types/SearchProjectsResponse.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ json, log }) => {
    const searchedProjects : SearchProjectsResponse = json;

    log.info(`Found ${searchedProjects.total} projects matching the search criteria`);

    await Actor.pushData(searchedProjects.projectDocuments);
});

router.addHandler('detail', async ({ request, $, log }) => {
    const title = $('title').text();
    log.info(`${title}`, { url: request.loadedUrl });

    await Dataset.pushData({
        url: request.loadedUrl,
        title,
    });
});
