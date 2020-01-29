/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RelationType, DisplayType, Concern, Constraint } from "./globalTypes";

// ====================================================
// GraphQL fragment: RelationFieldParts
// ====================================================

export interface RelationFieldParts_relatesTo_previewField {
  __typename: "ScalarField" | "ListField" | "RelationField" | "AssetField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface RelationFieldParts_relatesTo_fields_AssetField {
  __typename: "AssetField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface RelationFieldParts_relatesTo_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface RelationFieldParts_relatesTo_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface RelationFieldParts_relatesTo_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  relationType: RelationType;
}

export type RelationFieldParts_relatesTo_fields = RelationFieldParts_relatesTo_fields_AssetField | RelationFieldParts_relatesTo_fields_ScalarField | RelationFieldParts_relatesTo_fields_ListField | RelationFieldParts_relatesTo_fields_RelationField;

export interface RelationFieldParts_relatesTo {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  previewField: RelationFieldParts_relatesTo_previewField;
  fields: RelationFieldParts_relatesTo_fields[];
}

export interface RelationFieldParts {
  __typename: "RelationField";
  id: string;
  name: string;
  apiName: string;
  position: number;
  relationType: RelationType;
  relatesTo: RelationFieldParts_relatesTo;
}
