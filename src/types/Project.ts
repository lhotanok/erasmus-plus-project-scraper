import { ProjectDocument } from './SearchProjectsResponse';

export type Project = ProjectDocument & {
    url: string;
    coveredCountries: string[];
};
