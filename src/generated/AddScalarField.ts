/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DisplayType, Concern, Constraint } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddScalarField
// ====================================================

export interface AddScalarField_addScalarField {
  __typename: "ScalarField";
  id: string;
  name: string;
}

export interface AddScalarField {
  addScalarField: AddScalarField_addScalarField;
}

export interface AddScalarFieldVariables {
  modelId: string;
  fieldName: string;
  apiName: string;
  displayType: DisplayType;
  concern: Concern;
  constraint: Constraint;
}
