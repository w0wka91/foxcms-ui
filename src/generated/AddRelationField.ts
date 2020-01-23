/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RelationType, DisplayType, Concern, Constraint } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddRelationField
// ====================================================

export interface AddRelationField_addRelationField_field_relatesTo_previewField {
  __typename: "ScalarField" | "ListField" | "RelationField" | "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
}

export interface AddRelationField_addRelationField_field_relatesTo_fields_CreatedAtField {
  __typename: "CreatedAtField" | "IdField" | "PublishStatusField" | "UpdatedAtField";
  name: string;
  apiName: string;
  position: number;
}

export interface AddRelationField_addRelationField_field_relatesTo_fields_ScalarField {
  __typename: "ScalarField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
  concern: Concern;
  constraint: Constraint;
}

export interface AddRelationField_addRelationField_field_relatesTo_fields_ListField {
  __typename: "ListField";
  name: string;
  apiName: string;
  position: number;
  id: string;
  type: DisplayType;
}

export interface AddRelationField_addRelationField_field_relatesTo_fields_RelationField {
  __typename: "RelationField";
  name: string;
  apiName: string;
  position: number;
  relationType: RelationType;
}

export type AddRelationField_addRelationField_field_relatesTo_fields = AddRelationField_addRelationField_field_relatesTo_fields_CreatedAtField | AddRelationField_addRelationField_field_relatesTo_fields_ScalarField | AddRelationField_addRelationField_field_relatesTo_fields_ListField | AddRelationField_addRelationField_field_relatesTo_fields_RelationField;

export interface AddRelationField_addRelationField_field_relatesTo {
  __typename: "ContentModel";
  id: string;
  apiName: string;
  name: string;
  previewField: AddRelationField_addRelationField_field_relatesTo_previewField;
  fields: AddRelationField_addRelationField_field_relatesTo_fields[];
}

export interface AddRelationField_addRelationField_field {
  __typename: "RelationField";
  id: string;
  name: string;
  apiName: string;
  position: number;
  relationType: RelationType;
  relatesTo: AddRelationField_addRelationField_field_relatesTo;
}

export interface AddRelationField_addRelationField {
  __typename: "AddRelationFieldPayload";
  modelId: string;
  field: AddRelationField_addRelationField_field;
}

export interface AddRelationField {
  addRelationField: AddRelationField_addRelationField[];
}

export interface AddRelationFieldVariables {
  modelId: string;
  fieldName: string;
  apiName: string;
  relatesToModelId: string;
  relatesToFieldName: string;
  relatesToApiName: string;
  relationType: RelationType;
}
