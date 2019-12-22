import {
  ContentModel_contentModel_fields_CreatedAtField,
  ContentModel_contentModel_fields_ListField,
  ContentModel_contentModel_fields_RelationField,
  ContentModel_contentModel_fields_ScalarField,
} from '../generated/ContentModel'

export interface User {
  username: string
}

export function isFieldSkeleton(field: ScalarField | ListField | RelationField | FieldSkeleton): field is FieldSkeleton {
  return (field as ScalarField).__typename === undefined
}

export function isScalarField(field: ScalarField | ListField | RelationField | FieldSkeleton): field is ScalarField {
  return (field as ScalarField).__typename === 'ScalarField'
}

export function isListField(field: ScalarField | ListField | RelationField | FieldSkeleton): field is ListField {
  return (field as ListField).__typename === 'ListField'
}

export function isSystemField(field: SystemField | UserField): field is SystemField {
  return (field as UserField).id == null
}

export function isUserField(field: SystemField | UserField): field is UserField {
  return (field as UserField).id != null
}

export type UserField = ScalarField
  | ListField | RelationField;

export type FieldSkeleton = Pick<ContentModel_contentModel_fields_ScalarField, 'type'>

export type RelationField = ContentModel_contentModel_fields_RelationField

export type ListField = ContentModel_contentModel_fields_ListField

export type ScalarField = ContentModel_contentModel_fields_ScalarField

export type SystemField = ContentModel_contentModel_fields_CreatedAtField