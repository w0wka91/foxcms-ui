/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint } from "./globalTypes";

// ====================================================
// GraphQL query operation: ContentModels
// ====================================================

export interface ContentModels_contentModels_fields_RelationField {
  __typename: "RelationField" | "CreatedAtField" | "IdField" | "ListField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface ContentModels_contentModels_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export type ContentModels_contentModels_fields = ContentModels_contentModels_fields_RelationField | ContentModels_contentModels_fields_ScalarField;

export interface ContentModels_contentModels {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
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
