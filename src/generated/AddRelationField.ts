/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RelationType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddRelationField
// ====================================================

export interface AddRelationField_addRelationField_relatesTo {
  __typename: "ContentModel";
  id: string;
  name: string;
}

export interface AddRelationField_addRelationField {
  __typename: "RelationField";
  id: string;
  name: string;
  apiName: string;
  relationType: RelationType;
  relatesTo: AddRelationField_addRelationField_relatesTo;
}

export interface AddRelationField {
  addRelationField: AddRelationField_addRelationField;
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
