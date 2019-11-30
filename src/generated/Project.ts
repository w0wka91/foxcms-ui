/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Project
// ====================================================

export interface Project_project_branches {
  __typename: "Branch";
  id: string;
  name: string;
}

export interface Project_project {
  __typename: "Project";
  id: string;
  name: string;
  generatedName: string;
  branches: Project_project_branches[];
}

export interface Project {
  project: Project_project | null;
}

export interface ProjectVariables {
  generatedName: string;
}
