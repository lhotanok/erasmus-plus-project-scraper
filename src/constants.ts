export const LABELS = {
    SEARCH_PROJECTS_PAGE: 'SEARCH_PROJECTS_PAGE',
};

/** For search request payload, field name 'projectStatus' */
export const ProjectStatusCodes = {
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
};

/** For search request payload, should be set to '1' if 'Projects With Results' is set */
export const ProjectWithResultsFieldName = 'projectTotalPublishedResults';

/** More values should be joined by ';'. Only level 3 allows multiple values. */
export const ProjectLevelFieldNames = {
    LEVEL_2: 'projectLevel2',
    LEVEL_3: 'projectLevel3',
};

// Search project constants

export const SEARCH_PROJECTS_URL = 'https://ec.europa.eu/programmes/service/search/project/search';
export const SEARCH_PROJECTS_INDEX = 'eplus2021';
export const SEARCHED_PROJECTS_PER_REQUEST = 1000;
