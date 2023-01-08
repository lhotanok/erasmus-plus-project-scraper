export type SearchProjectPayload = {
    from: number;
    size: number;
    index: string;
    keyword: string;
    sort: string;
    matchAllCountries: boolean;
    withAggregation: boolean;
    project: ProjectPayload;
    coordinator: CoordinatorPayload;
    partner: PartnerPayload;
};

export type ProjectPayload = {
    projectStatus? : string;
    projectLevel2? : string;
    projectLevel3? : string;
};

export type CoordinatorPayload = {
    //
};

export type PartnerPayload = {
    //
};
