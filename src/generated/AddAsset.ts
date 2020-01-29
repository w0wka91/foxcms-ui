/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddAsset
// ====================================================

export interface AddAsset_addAsset {
  __typename: "Asset";
  publicId: string;
  secureUrl: string;
  thumbnailUrl: string;
}

export interface AddAsset {
  addAsset: AddAsset_addAsset;
}

export interface AddAssetVariables {
  generatedName: string;
  fileName: string;
  format: string;
  resourceType: string;
  width: number;
  height: number;
  bytes: number;
  url: string;
  secureUrl: string;
  thumbnailUrl: string;
  publicId: string;
}
