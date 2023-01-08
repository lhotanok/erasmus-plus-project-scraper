export type SearchProjectPayload = {
    from: number;
    size: number;
    index: string;
    keyword: string;
    sort: string;
    matchAllCountries: boolean;
    withAggregation: boolean;
    project: ProjectPayload;
    coordinator: OrganizationPayload;
    partner: OrganizationPayload;
};

export type ProjectPayload = {
    projectStatus? : string;
    projectLevel2? : string;
    projectLevel3? : string;
};

export type OrganizationPayload = {
    /** Multiple country codes can be joined by ';' */
    organisationCountry?: string;
};
