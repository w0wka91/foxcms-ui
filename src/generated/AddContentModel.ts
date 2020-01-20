/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint, RelationType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddContentModel
// ====================================================

export interface AddContentModel_addContentModel_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface AddContentModel_addContentModel_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface AddContentModel_addContentModel_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface AddContentModel_addContentModel_fields_RelationField_relatesTo {
  __typename: "ContentModel";
  id: string;
  name: string;
}

export interface AddContentModel_addContentModel_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  relationType: RelationType;
  relatesTo: AddContentModel_addContentModel_fields_RelationField_relatesTo;
}

export type AddContentModel_addContentModel_fields = AddContentModel_addContentModel_fields_CreatedAtField | AddContentModel_addContentModel_fields_ScalarField | AddContentModel_addContentModel_fields_ListField | AddContentModel_addContentModel_fields_RelationField;

export interface AddContentModel_addContentModel {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  description: string | null;
  updatedAt: string;
  fields: AddContentModel_addContentModel_fields[];
}

export interface AddContentModel {
  addContentModel: AddContentModel_addContentModel;
}

export interface AddContentModelVariables {
  branchId: string;
  name: string;
  apiName: string;
  description: string;
}
