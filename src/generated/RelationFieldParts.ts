/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RelationType } from "./globalTypes";

// ====================================================
// GraphQL fragment: RelationFieldParts
// ====================================================

export interface RelationFieldParts_relatesTo {
  __typename: "ContentModel";
  id: string;
  name: string;
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
