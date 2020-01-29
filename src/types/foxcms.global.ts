import {
  ContentModel_contentModel_fields_CreatedAtField,
  ContentModel_contentModel_fields_ListField,
  ContentModel_contentModel_fields_RelationField,
  ContentModel_contentModel_fields_ScalarField,
  ContentModel_contentModel_fields_AssetField,
} from '../generated/ContentModel'
import { DisplayType } from '../generated/globalTypes'

export interface User {
  username: string
}

export function isFieldSkeleton(
  field: SystemField | UserField | FieldSkeleton
): field is FieldSkeleton {
  return (field as ScalarField).__typename === undefined
}

export function isScalarField(
  field: UserField | FieldSkeleton
): field is ScalarField {
  return (field as ScalarField).__typename === 'ScalarField'
}

export function isAssetField(
  field: SystemField | UserField | FieldSkeleton
): field is AssetField {
  return (field as AssetField).__typename === 'AssetField'
}

export function isListField(
  field: SystemField | UserField | FieldSkeleton
): field is ListField {
  return (field as ListField).__typename === 'ListField'
}

export function isSystemField(
  field: SystemField | UserField
): field is SystemField {
  return (field as UserField).id == null
}

export function isUserField(
  field: SystemField | UserField | FieldSkeleton
): field is UserField {
  return (field as UserField).id != null
}

export function isRelationField(
  field: SystemField | UserField
): field is RelationField {
  return (field as UserField).__typename === 'RelationField'
}

export type UserField = ScalarField | ListField | RelationField | AssetField

export enum SystemModel {
  ASSET = 'ASSET',
}

export type FieldType = DisplayType | SystemModel

export type FieldSkeleton = {
  type: FieldType
}

export type RelationField = ContentModel_contentModel_fields_RelationField

export type ListField = ContentModel_contentModel_fields_ListField

export type ScalarField = ContentModel_contentModel_fields_ScalarField

export type SystemField = ContentModel_contentModel_fields_CreatedAtField

export type AssetField = ContentModel_contentModel_fields_AssetField
