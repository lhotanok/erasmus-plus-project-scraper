import { log, ProxyConfigurationOptions, Request } from 'crawlee';
import {
    ProjectStatusCodes,
    SEARCHED_PROJECTS_PER_REQUEST,
    SEARCH_PROJECTS_INDEX,
    SEARCH_PROJECTS_URL,
} from './constants.js';
import { InputSchema } from './types/InputSchema.js';
import {
    OrganizationPayload,
    ProjectPayload,
    SearchProjectPayload,
} from './types/SearchProjectPayload.js';

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
            coordinator: buildOrganizationPayload(input, input.partnerCountries, 'coordinatorType'),
            partner: buildOrganizationPayload(input, input.partnerCountries, 'partnerType'),
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

const buildOrganizationPayload = (
    input: InputSchema,
    countries: string[],
    type: 'coordinatorType' | 'partnerType',
) : OrganizationPayload => {
    const payload: OrganizationPayload = {};

    if (countries.length > 0) {
        payload.organisationCountry = countries.join(';');
    }

    const organizationTypes = getInputFieldValuesFromCategory(input, type);

    if (organizationTypes.length > 0) {
        payload.organisationType = organizationTypes.join(';');
    }

    return payload;
};

const buildProjectLevel2 = (input: InputSchema) : string | undefined => {
    return input.projectAction
        ? parseSearchProjectFieldValue(input.projectAction)
        : undefined;
};

const buildProjectLevel3 = (input: InputSchema) : string | undefined => {
    const level3Values = getInputFieldValuesFromCategory(input, 'actionType');
    return level3Values.length > 0 ? level3Values.join(';') : undefined;
};

const getInputFieldValuesFromCategory = (
    input: InputSchema,
    category: 'actionType' | 'coordinatorType' | 'partnerType',
) : string[] => {
    const inputMap = input as Record<string, string | boolean | ProxyConfigurationOptions>;

    const values: string[] = [];

    Object.entries(inputMap).forEach(([fieldName, fieldValue]) => {
        if (fieldName.match(`-${category}-`) && fieldValue === true) {
            values.push(fieldName.replace(new RegExp(`[^-]+-${category}-`), ''));
        }
    });

    return values;
};
