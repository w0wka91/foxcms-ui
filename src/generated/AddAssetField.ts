/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Concern } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddAssetField
// ====================================================

export interface AddAssetField_addAssetField {
  __typename: "AssetField";
  id: string;
  name: string;
  apiName: string;
  position: number;
  concern: Concern;
}

export interface AddAssetField {
  addAssetField: AddAssetField_addAssetField;
}

export interface AddAssetFieldVariables {
  modelId: string;
  fieldName: string;
  apiName: string;
  concern: Concern;
}
