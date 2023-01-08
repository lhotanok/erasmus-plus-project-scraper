import { ProxyConfigurationOptions } from 'crawlee';

export type InputSchema =
    ProjectStatus
    & KA1ActionTypes
    & KA2ActionTypes
    & KA3ActionTypes
    & JeanMonnetActionTypes
    & SportActionTypes & {
    projectAction?: string;
    proxyConfiguration: ProxyConfigurationOptions;
};

export type ProjectStatus = {
    ongoingProjects: boolean;
    completedProjects: boolean;
    withResultsProjects: boolean;
};

export type KA1ActionTypes = {
    'ka101-actionType-31046251': boolean;
    'ka102-actionType-31046252': boolean;
    'ka103-actionType-31064416': boolean;
    'ka103-actionType-31046253': boolean;
    'ka104-actionType-31046254': boolean;
    'ka105-actionType-31046255': boolean;
    'ka106-actionType-31046256': boolean;
    'ka107-actionType-31064388': boolean;
    'ka111-actionType-31046261': boolean;
    'ka116-actionType-31070549': boolean;
    'ka120-actionType-42801136': boolean;
    'ka122-actionType-43223904': boolean;
    'ka122-actionType-43223901': boolean;
    'ka122-actionType-43223898': boolean;
    'ka125-actionType-31088847': boolean;
    'ka131-actionType-43223907': boolean;
    'ka135-actionType-31081513': boolean;
    'ka152-actionType-43223913': boolean;
    'ka153-actionType-43223916': boolean;
    'ka154-actionType-43223919': boolean;
    'ka171-actionType-44442484': boolean;
};

export type KA2ActionTypes = {
    'ka200-actionType-31046264': boolean;
    'ka201-actionType-31046265': boolean;
    'ka202-actionType-31046266': boolean;
    'ka203-actionType-31046267': boolean;
    'ka204-actionType-31046268': boolean;
    'ka205-actionType-31046269': boolean;
    'ka206-actionType-31046270': boolean;
    'ka207-actionType-31046271': boolean;
    'ka210-actionType-43223928': boolean;
    'ka210-actionType-43223922': boolean;
    'ka210-actionType-43223925': boolean;
    'ka210-actionType-43223931': boolean;
    'ka211-actionType-31046275': boolean;
    'ka212-actionType-31046276': boolean;
    'ka213-actionType-31046277': boolean;
    'ka214-actionType-31046278': boolean;
    'ka219-actionType-31064430': boolean;
    'ka220-actionType-43223940': boolean;
    'ka220-actionType-43223943': boolean;
    'ka220-actionType-43223934': boolean;
    'ka220-actionType-43223937': boolean;
    'ka220-actionType-43223946': boolean;
    'ka226-actionType-43152710': boolean;
    'ka227-actionType-43152713': boolean;
    'ka229-actionType-31088851': boolean;
    'ka230-actionType-31099188': boolean;
};

export type KA3ActionTypes = {
    'ka308-actionType-31046287': boolean;
    'ka313-actionType-31046292': boolean;
    'ka314-actionType-31046293': boolean;
    'ka324-actionType-31046303': boolean;
    'ka326-actionType-31046305': boolean;
    'ka330-actionType-31046309': boolean;
    'ka333-actionType-31046312': boolean;
    'ka347-actionType-42194001': boolean;
    'ka347-actionType-31046326': boolean;
    'ka357-actionType-31058943': boolean;
    'ka359-actionType-31069111': boolean;
    'ka362-actionType-31068711': boolean;
    'ka364-actionType-31072487': boolean;
    'ka365-actionType-31072527': boolean;
    'ka366-actionType-31075307': boolean;
    'ka367-actionType-31079268': boolean;
    'ka369-actionType-31094869': boolean;
};

export type JeanMonnetActionTypes = {
    'academic-actionType-31046337': boolean;
    'excellence-actionType-31046338': boolean;
    'chairs-actionType-31046336': boolean;
    'networks-actionType-31046347': boolean;
    'projects-actionType-31046348': boolean;
    'supportToAcademy-actionType-31046343': boolean;
    'supportToCife-actionType-31046346': boolean;
    'supportToEu-actionType-31046342': boolean;
    'supportToInstitution-actionType-31046339': boolean;
};

export type SportActionTypes = {
    'partnerships-actionType-31046350': boolean;
    'nonProfit-actionType-31046351': boolean;
};
