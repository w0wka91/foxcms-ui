/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContentModels
// ====================================================

export interface ContentModels_contentModels_fields {
  __typename: "ScalarField" | "ListField" | "RelationField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  apiName: string;
}

export interface ContentModels_contentModels {
  __typename: "ContentModel";
  id: string;
  name: string;
  apiName: string;
  description: string | null;
  updatedAt: string;
  fields: ContentModels_contentModels_fields[];
}

export interface ContentModels {
  contentModels: ContentModels_contentModels[];
}

export interface ContentModelsVariables {
  branchId: string;
}
