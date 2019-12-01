/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint, RelationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: ContentModel
// ====================================================

export interface ContentModel_contentModel_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface ContentModel_contentModel_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface ContentModel_contentModel_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  type: DisplayType;
}

export interface ContentModel_contentModel_fields_RelationField_relatesTo {
  __typename: "ContentModel";
  name: string;
}

export interface ContentModel_contentModel_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  relationType: RelationType;
  relatesTo: ContentModel_contentModel_fields_RelationField_relatesTo;
}

export type ContentModel_contentModel_fields = ContentModel_contentModel_fields_CreatedAtField | ContentModel_contentModel_fields_ScalarField | ContentModel_contentModel_fields_ListField | ContentModel_contentModel_fields_RelationField;

export interface ContentModel_contentModel {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  description: string | null;
  fields: ContentModel_contentModel_fields[];
}

export interface ContentModel {
  contentModel: ContentModel_contentModel | null;
}

export interface ContentModelVariables {
  modelId: string;
}
