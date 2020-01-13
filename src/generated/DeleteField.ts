/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteField
// ====================================================

export interface DeleteField_deleteField {
  __typename: "DeleteFieldPayload";
  modelId: string;
  fieldId: string;
}

export interface DeleteField {
  deleteField: DeleteField_deleteField[];
}

export interface DeleteFieldVariables {
  modelId: string;
  fieldId: string;
}
