/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Projects
// ====================================================

export interface Projects_projects_branches {
  __typename: "Branch";
  id: string;
  name: string;
}

export interface Projects_projects {
  __typename: "Project";
  id: string;
  name: string;
  generatedName: string;
  updatedAt: string;
  branches: Projects_projects_branches[];
}

export interface Projects {
  projects: Projects_projects[];
}
