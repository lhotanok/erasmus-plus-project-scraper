import { log, ProxyConfigurationOptions, Request } from 'crawlee';
import {
    ProjectStatusCodes,
    SEARCHED_PROJECTS_PER_REQUEST,
    SEARCH_PROJECTS_INDEX,
    SEARCH_PROJECTS_URL,
} from '../constants.js';
import { InputSchema } from '../types/InputSchema.js';
import {
    CoordinatorPayload,
    PartnerPayload,
    ProjectPayload,
    SearchProjectPayload,
} from '../types/SearchProjectPayload.js';

export const parseSearchProjectFieldValue = (inputField: string) : string => {
    return inputField.replace(/[^-]+-/, '');
};

export const buildStartRequests = (input: InputSchema) : Request[] => {
    const payloads = buildSearchProjectsPayloads(input);

    const startRequests = payloads.map((payload) => buildSearchRequest(payload));

    log.info(`Built ${startRequests.length} start request${startRequests.length !== 1 ? 's' : ''}`);

    return startRequests;
};

export const buildSearchRequest = (payload: SearchProjectPayload, label? : string) : Request => {
    return new Request({
        url: SEARCH_PROJECTS_URL,
        method: 'POST',
        payload: JSON.stringify(payload),
        useExtendedUniqueKey: true,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(payload).length.toString(),
        },
        label,
    });
};

const buildSearchProjectsPayloads = (input: InputSchema, page = 1) : SearchProjectPayload[] => {
    const projectPayloads: ProjectPayload[] = [];

    if (input.ongoingProjects) {
        projectPayloads.push(buildProjectPayload(input, 'ongoing'));
    }

    if (input.completedProjects) {
        projectPayloads.push(buildProjectPayload(input, 'completed'));
    }

    if (projectPayloads.length === 0) {
        projectPayloads.push(buildProjectPayload(input));
    }

    const searchProjectPayloads : SearchProjectPayload[] = projectPayloads.map((project) => {
        const payload : SearchProjectPayload = {
            from: (page - 1) * SEARCHED_PROJECTS_PER_REQUEST,
            size: SEARCHED_PROJECTS_PER_REQUEST,
            index: SEARCH_PROJECTS_INDEX,
            keyword: '',
            sort: '',
            matchAllCountries: false,
            withAggregation: true,
            project,
            coordinator: buildCoordinatorPayload(input),
            partner: buildPartnerPayload(input),
        };

        return payload;
    });

    return searchProjectPayloads;
};

const buildProjectPayload = (input: InputSchema, projectStatus?: 'ongoing' | 'completed') : ProjectPayload => {
    let projectStatusValue: string | undefined;

    if (projectStatus === 'ongoing') {
        projectStatusValue = ProjectStatusCodes.ONGOING;
    } else if (projectStatus === 'completed') {
        projectStatusValue = ProjectStatusCodes.COMPLETED;
    }

    const projectLevel2 = buildProjectLevel2(input);
    const projectLevel3 = buildProjectLevel3(input);

    const project : ProjectPayload = {};

    // undefined values don't work here because of the later serialization
    if (projectStatus) {
        project.projectStatus = projectStatusValue;
    }

    if (projectLevel2) {
        project.projectLevel2 = projectLevel2;
    }

    if (projectLevel3) {
        project.projectLevel3 = projectLevel3;
    }

    return project;
};

const buildCoordinatorPayload = (input: InputSchema) : CoordinatorPayload => {
    log.debug('Input', { input });
    return {} as CoordinatorPayload;
};

const buildPartnerPayload = (input: InputSchema) : PartnerPayload => {
    log.debug('Input', { input });
    return {} as PartnerPayload;
};

const buildProjectLevel2 = (input: InputSchema) : string | undefined => {
    return input.projectAction
        ? input.projectAction.replace(/[^-]+-/, '')
        : undefined;
};

const buildProjectLevel3 = (input: InputSchema) : string | undefined => {
    const inputMap = input as Record<string, string | boolean | ProxyConfigurationOptions>;

    const level3Values: string[] = [];

    Object.entries(inputMap).forEach(([fieldName, fieldValue]) => {
        if (fieldName.match(/-actionType-/) && fieldValue === true) {
            level3Values.push(fieldName.replace(/[^-]+-actionType-/, ''));
        }
    });

    return level3Values.length > 0 ? level3Values.join(';') : undefined;
};
