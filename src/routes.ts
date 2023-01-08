import { Actor, log, RequestQueue } from 'apify';
import { CheerioCrawler, createCheerioRouter, Request, sleep } from 'crawlee';
import { buildSearchRequest } from './search-projects-api.js';
import { LABELS, SEARCHED_PROJECTS_PER_REQUEST } from './constants.js';
import { CrawlerState } from './types/CrawlerState.js';
import { Project } from './types/Project.js';
import { ProjectDetailUserData } from './types/ProjectDetailUserData.js';
import { SearchProjectPayload } from './types/SearchProjectPayload.js';
import { ProjectDocument, SearchProjectsResponse } from './types/SearchProjectsResponse.js';
import { ProjectDetailResponse } from './types/ProjectDetailResponse.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ json, crawler, request }) => {
    const searchedProjects : SearchProjectsResponse = json;

    log.info(`Found ${searchedProjects.total} projects matching the provided search criteria`);

    const { payload } = request;
    const searchPayload : SearchProjectPayload = JSON.parse(payload || '{}');

    const requestQueue = await crawler.getRequestQueue();
    await enqueueSearchProjectsPages(requestQueue, searchPayload, searchedProjects.total);

    await saveOrEnqueueProjects(crawler, searchedProjects.projectDocuments, request.payload);
});

router.addHandler(LABELS.SEARCH_PROJECTS_PAGE, async ({ json, crawler, request }) => {
    const searchedProjects : SearchProjectsResponse = json;

    await saveOrEnqueueProjects(crawler, searchedProjects.projectDocuments, request.payload);
});

router.addHandler<ProjectDetailUserData>(LABELS.PROJECT_DETAIL, async ({ json, request: { userData } }) => {
    const projectDetailResponse : ProjectDetailResponse = json;
    const { isValorProject, coordinating: coordinator, partners, map, project: projectData } = projectDetailResponse;

    const { project } = userData;

    log.info(`Opened project: ${projectDetailResponse.project.title}`, { url: project.url });

    const projectDetail = {
        ...project,
        ...projectData,
        coordinator,
        partners,
        map,
        isValorProject,
        projectStatus: project.projectStatus,
    };

    delete projectDetail.countries;

    await Actor.pushData(projectDetail);
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

const saveOrEnqueueProjects = async (crawler: CheerioCrawler, projectDocuments: ProjectDocument[], requestPayload?: string) => {
    const state = await crawler.useState<CrawlerState>();

    if (state.extractSimpleProjects) {
        await saveProjects(projectDocuments, requestPayload);
        return;
    }

    const projects = projectDocuments.map((projectDoc) => extendProjectData(projectDoc));

    const projectRequests = projects.map((project) => new Request<ProjectDetailUserData>({
        url: `https://ec.europa.eu/programmes/service/es/project/projectCard?projectId=workspace://SpacesStore/${project.projectId}`,
        userData: {
            label: LABELS.PROJECT_DETAIL,
            project,
        },
    }));

    await sleep(10_000);

    const payload: SearchProjectPayload = JSON.parse(requestPayload || '{}');
    const { from, project } = payload;

    log.info(`Enqueuing ${projectRequests.length} project links`, { from, project });

    const requestQueue = await crawler.getRequestQueue();
    await requestQueue.addRequests(
        projectRequests,
        { forefront: true },
    );
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
