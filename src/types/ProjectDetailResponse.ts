export type ProjectDetailResponse = {
    isValorProject: boolean;
    coordinating: ProjectDetailOrganization;
    partners: ProjectDetailOrganization[];
    map: ProjectDetailMap;
    products_message: string;
    project: {
        domain: string;
        centralised: boolean;
        projectReference: string;
        identifier: string;
        externalRef: string;
        nationalIdentifier: string;
        europeanInnovativeTeachingAward: boolean;
        title: string;
        subtitle: string;
        website: string;
        level1Label: string;
        level1Code: string;
        level2Label: string;
        level2Code: string;
        level3Label: string;
        level3Code: string;
        callYear: string;
        description: string;
        reportSummary: string;
        reportSummaryBackground: string;
        reportSummaryObjectives: string;
        reportSummaryImplementation: string;
        reportSummaryResults: string;
        startDate: string;
        countries?: string;
        endDate: string;
        startYear: string;
        duration: string;
        grantedAmount: string;
        projectStatus: 'ONGOING' | 'FINALIZED';
        tags: string;
        nodeRef: string;
        displayExplanatoryNoticeForRemovedResults: boolean;
    };
};

export type ProjectDetailOrganization = {
    withdrawnFromProject: boolean;
    nodeRef: string;
    name: string;
    type: string;
    city: string;
    country: string;
    region: string;
    website: string;
    pic: string;
    status: string;
    phone: string;
    postalCode: string;
    street: string;
    address: string;
    email?: string;
    CPName?: string;
    CPEmail?: string;
};

export type ProjectDetailMap = {
    map: {
        total: number;
        coordinator: MapOrganization;
        partners: MapOrganization[]
    }
}

export type MapOrganization = {
    name: string;
    type: string;
    role: string;
    address: string;
    website: string;
    lat: string;
    lng: string;
    notAccurate: boolean;
};
