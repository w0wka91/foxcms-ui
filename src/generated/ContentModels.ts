/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint, RelationType } from "./globalTypes";

// ====================================================
// GraphQL query operation: ContentModels
// ====================================================

export interface ContentModels_contentModels_previewField {
  __typename: "ScalarField" | "ListField" | "RelationField" | "AssetField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface ContentModels_contentModels_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface ContentModels_contentModels_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface ContentModels_contentModels_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface ContentModels_contentModels_fields_AssetField {
  __typename: "AssetField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  concern: Concern;
}

export interface ContentModels_contentModels_fields_RelationField_relatesTo_previewField {
  __typename: "ScalarField" | "ListField" | "RelationField" | "AssetField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface ContentModels_contentModels_fields_RelationField_relatesTo_fields_AssetField {
  __typename: "AssetField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface ContentModels_contentModels_fields_RelationField_relatesTo_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface ContentModels_contentModels_fields_RelationField_relatesTo_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface ContentModels_contentModels_fields_RelationField_relatesTo_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  relationType: RelationType;
}

export type ContentModels_contentModels_fields_RelationField_relatesTo_fields = ContentModels_contentModels_fields_RelationField_relatesTo_fields_AssetField | ContentModels_contentModels_fields_RelationField_relatesTo_fields_ScalarField | ContentModels_contentModels_fields_RelationField_relatesTo_fields_ListField | ContentModels_contentModels_fields_RelationField_relatesTo_fields_RelationField;

export interface ContentModels_contentModels_fields_RelationField_relatesTo {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  previewField: ContentModels_contentModels_fields_RelationField_relatesTo_previewField;
  fields: ContentModels_contentModels_fields_RelationField_relatesTo_fields[];
}

export interface ContentModels_contentModels_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  relationType: RelationType;
  relatesTo: ContentModels_contentModels_fields_RelationField_relatesTo;
}

export type ContentModels_contentModels_fields = ContentModels_contentModels_fields_CreatedAtField | ContentModels_contentModels_fields_ScalarField | ContentModels_contentModels_fields_ListField | ContentModels_contentModels_fields_AssetField | ContentModels_contentModels_fields_RelationField;

export interface ContentModels_contentModels {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  description: string | null;
  updatedAt: string;
  previewField: ContentModels_contentModels_previewField;
  fields: ContentModels_contentModels_fields[];
}

export interface ContentModels {
  contentModels: ContentModels_contentModels[];
}

export interface ContentModelsVariables {
  branchId: string;
}
