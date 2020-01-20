/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint, RelationType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ReorderField
// ====================================================

export interface ReorderField_reorderField_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface ReorderField_reorderField_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface ReorderField_reorderField_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface ReorderField_reorderField_fields_RelationField_relatesTo {
  __typename: "ContentModel";
  id: string;
  name: string;
}

export interface ReorderField_reorderField_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  relationType: RelationType;
  relatesTo: ReorderField_reorderField_fields_RelationField_relatesTo;
}

export type ReorderField_reorderField_fields = ReorderField_reorderField_fields_CreatedAtField | ReorderField_reorderField_fields_ScalarField | ReorderField_reorderField_fields_ListField | ReorderField_reorderField_fields_RelationField;

export interface ReorderField_reorderField {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  description: string | null;
  updatedAt: string;
  fields: ReorderField_reorderField_fields[];
}

export interface ReorderField {
  reorderField: ReorderField_reorderField | null;
}

export interface ReorderFieldVariables {
  modelId: string;
  from: number;
  to: number;
}
