/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint, RelationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: ContentModels
// ====================================================

export interface ContentModels_contentModels_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface ContentModels_contentModels_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface ContentModels_contentModels_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  id: string;
  type: DisplayType;
}

export interface ContentModels_contentModels_fields_RelationField_relatesTo {
  __typename: "ContentModel";
  id: string;
  name: string;
}

export interface ContentModels_contentModels_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  id: string;
  relationType: RelationType;
  relatesTo: ContentModels_contentModels_fields_RelationField_relatesTo;
}

export type ContentModels_contentModels_fields = ContentModels_contentModels_fields_CreatedAtField | ContentModels_contentModels_fields_ScalarField | ContentModels_contentModels_fields_ListField | ContentModels_contentModels_fields_RelationField;

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
