/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint, RelationType } from "./globalTypes";

// ====================================================
// GraphQL fragment: ContentModelParts
// ====================================================

export interface ContentModelParts_previewField {
  __typename: "ScalarField" | "ListField" | "RelationField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface ContentModelParts_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface ContentModelParts_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface ContentModelParts_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface ContentModelParts_fields_RelationField_relatesTo_previewField {
  __typename: "ScalarField" | "ListField" | "RelationField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface ContentModelParts_fields_RelationField_relatesTo_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface ContentModelParts_fields_RelationField_relatesTo_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface ContentModelParts_fields_RelationField_relatesTo_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface ContentModelParts_fields_RelationField_relatesTo_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  relationType: RelationType;
}

export type ContentModelParts_fields_RelationField_relatesTo_fields = ContentModelParts_fields_RelationField_relatesTo_fields_CreatedAtField | ContentModelParts_fields_RelationField_relatesTo_fields_ScalarField | ContentModelParts_fields_RelationField_relatesTo_fields_ListField | ContentModelParts_fields_RelationField_relatesTo_fields_RelationField;

export interface ContentModelParts_fields_RelationField_relatesTo {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  previewField: ContentModelParts_fields_RelationField_relatesTo_previewField;
  fields: ContentModelParts_fields_RelationField_relatesTo_fields[];
}

export interface ContentModelParts_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  relationType: RelationType;
  relatesTo: ContentModelParts_fields_RelationField_relatesTo;
}

export type ContentModelParts_fields = ContentModelParts_fields_CreatedAtField | ContentModelParts_fields_ScalarField | ContentModelParts_fields_ListField | ContentModelParts_fields_RelationField;

export interface ContentModelParts {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  description: string | null;
  updatedAt: string;
  previewField: ContentModelParts_previewField;
  fields: ContentModelParts_fields[];
}
