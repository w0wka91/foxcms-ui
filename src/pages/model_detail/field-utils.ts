import {
  Concern,
  Constraint,
  DisplayType,
  RelationType,
} from '../../generated/globalTypes'
import { ContentModel_contentModel_fields as Field } from '../../generated/ContentModel'
import {
  isScalarField,
  isUserField,
  isAssetField,
  FieldSkeleton,
  FieldType,
  SystemModel,
  isFieldSkeleton,
} from '../../types/foxcms.global'

const fieldName = (field: Field) => {
  switch (field.__typename) {
    case 'CreatedAtField':
    case 'UpdatedAtField':
      return 'DateTime'
    case 'IdField':
      return 'Identifier'
    case 'ScalarField':
      return fieldTypeName(field)
    case 'ListField':
      return `${fieldTypeName(field)} [ ]`
    case 'PublishStatusField':
      return 'Status'
    case 'RelationField':
      return field.relatesTo.name
    case 'AssetField':
      return 'Asset'
  }
}

const fieldIcon = (field: Field) => {
  switch (field.__typename) {
    case 'CreatedAtField':
    case 'UpdatedAtField':
      return 'calendar'
    case 'IdField':
      return 'database'
    case 'PublishStatusField':
      return 'cloud'
    case 'ScalarField':
    case 'ListField':
      return typeIcon(field.type)
    case 'RelationField':
      return 'git-merge'
    case 'AssetField':
      return 'image'
    default:
      return 'feather'
  }
}

const typeIcon = (type: FieldType) => {
  switch (type) {
    case DisplayType.DATE:
      return 'calendar'
    case DisplayType.CHECKBOX:
      return 'toggle-left'
    case DisplayType.FLOAT:
      return 'hash'
    case DisplayType.INTEGER:
      return 'hash'
    case DisplayType.JSON_EDITOR:
      return 'code'
    case DisplayType.MULTI_LINE_TEXT:
      return 'align-left'
    case DisplayType.SINGLE_LINE_TEXT:
      return 'type'
    case SystemModel.ASSET:
      return 'image'
    default:
      return 'feather'
  }
}

function fieldTypeName(field: Field | FieldSkeleton) {
  if ((isUserField(field) && isScalarField(field)) || isFieldSkeleton(field)) {
    switch (field.type as FieldType) {
      case DisplayType.CHECKBOX:
        return 'Checkbox'
      case DisplayType.DATE:
        return 'Date'
      case DisplayType.FLOAT:
        return 'Float'
      case DisplayType.INTEGER:
        return 'Integer'
      case DisplayType.JSON_EDITOR:
        return 'Json'
      case DisplayType.MULTI_LINE_TEXT:
        return 'Multi line text'
      case DisplayType.SINGLE_LINE_TEXT:
        return 'Single line text'
      case SystemModel.ASSET:
        return 'Asset'
    }
  } else if (isAssetField(field)) {
    return 'Asset'
  }
}

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

const fieldInfoTop = (field: Field) => {
  switch (field.__typename) {
    case 'ScalarField':
      return field.concern === Concern.REQUIRED ? capitalize(field.concern) : ''
    default:
      return ''
  }
}

const fieldInfoBottom = (field: Field) => {
  switch (field.__typename) {
    case 'ScalarField':
      return field.constraint === Constraint.UNIQUE
        ? capitalize(field.constraint)
        : ''
    case 'RelationField':
      switch (field.relationType) {
        case RelationType.ONE_TO_ONE:
        case RelationType.ONE_TO_ONE_DIRECTIVE:
          return 'One to one'
        case RelationType.ONE_TO_MANY:
          return 'One to many'
        case RelationType.MANY_TO_ONE:
          return 'Many to one'
        case RelationType.MANY_TO_MANY:
          return 'Many to many'
      }
      break
    case 'ListField':
      return 'List field'
  }
}

export {
  fieldTypeName,
  fieldIcon,
  typeIcon,
  fieldName,
  fieldInfoTop,
  fieldInfoBottom,
}
