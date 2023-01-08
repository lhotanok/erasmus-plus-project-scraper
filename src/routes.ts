import { Actor, log, RequestQueue } from 'apify';
import { createCheerioRouter } from 'crawlee';
import { buildSearchRequest } from './api/search-projects-api.js';
import { LABELS, SEARCHED_PROJECTS_PER_REQUEST } from './constants.js';
import { Project } from './types/Project.js';
import { SearchProjectPayload } from './types/SearchProjectPayload.js';
import { ProjectDocument, SearchProjectsResponse } from './types/SearchProjectsResponse.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ json, crawler, request }) => {
    const searchedProjects : SearchProjectsResponse = json;

    log.info(`Found ${searchedProjects.total} projects matching the provided search criteria`);

    const { payload } = request;
    const searchPayload : SearchProjectPayload = JSON.parse(payload || '{}');

    const requestQueue = await crawler.getRequestQueue();
    await enqueueSearchProjectsPages(requestQueue, searchPayload, searchedProjects.total);

    await saveProjects(searchedProjects.projectDocuments, request.payload);
});

router.addHandler(LABELS.SEARCH_PROJECTS_PAGE, async ({ json, request }) => {
    const searchedProjects : SearchProjectsResponse = json;

    await saveProjects(searchedProjects.projectDocuments, request.payload);
});

const enqueueSearchProjectsPages = async (requestQueue: RequestQueue, searchPayload: SearchProjectPayload, totalProjects: number) => {
    let from = SEARCHED_PROJECTS_PER_REQUEST;

    const payload = { ...searchPayload };

    while (from < totalProjects) {
        payload.from = from;

        await requestQueue.addRequest(
            buildSearchRequest(payload, LABELS.SEARCH_PROJECTS_PAGE),
        );

        from += SEARCHED_PROJECTS_PER_REQUEST;
    }

    log.info(`Enqueued ${from / SEARCHED_PROJECTS_PER_REQUEST} pagination requests for projects search`);
};

const saveProjects = async (projectDocuments: ProjectDocument[], requestPayload?: string) => {
    const payload: SearchProjectPayload = JSON.parse(requestPayload || '{}');
    const { from, project } = payload;

    log.info(`Saving ${projectDocuments.length} projects`, { from, project });

    const projects = projectDocuments.map((projectDoc) => extendProjectData(projectDoc));

    await Actor.pushData(projects);
};

const extendProjectData = (projectDocument: ProjectDocument) : Project => {
    const project: Project = {
        url: `https://erasmus-plus.ec.europa.eu/projects/search/details/${projectDocument.projectName}`,
        ...projectDocument,
        coveredCountries: projectDocument.projectCoverage.split('|'),
    };

    return project;
};
