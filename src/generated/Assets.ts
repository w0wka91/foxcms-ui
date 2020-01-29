/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Assets
// ====================================================

export interface Assets_assets {
  __typename: "Asset";
  publicId: string;
  secureUrl: string;
  thumbnailUrl: string;
}

export interface Assets {
  assets: Assets_assets[];
}

export interface AssetsVariables {
  generatedName: string;
}
