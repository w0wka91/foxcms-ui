import { Concern, Constraint, DisplayType, RelationType } from '../../generated/globalTypes'
import { ContentModel_contentModel_fields as Field } from '../../generated/ContentModel'

const fieldName = (field: Field) => {
  switch (field.__typename) {
    case 'CreatedAtField':
    case 'UpdatedAtField':
      return 'DateTime'
    case 'IdField':
      return 'Identifier'
    case 'ScalarField':
      return typeName(field.type)
    case 'ListField':
      return `${typeName(field.type)} [ ]`
    case 'PublishStatusField':
      return 'Status'
    case 'RelationField':
      return field.relatesTo.name
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
  }
}

const typeIcon = (type: DisplayType) => {
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
  }
}

function typeName(displayType: DisplayType) {
  switch (displayType) {
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
  }
}

const isSystemField = (field: Field) => {
  return (
    field.__typename === 'IdField' ||
    field.__typename === 'CreatedAtField' ||
    field.__typename === 'UpdatedAtField' ||
    field.__typename === 'PublishStatusField'
  )
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
    default:
      return 'System field'
  }
}

export {
  typeName,
  fieldIcon,
  typeIcon,
  fieldName,
  isSystemField,
  fieldInfoTop,
  fieldInfoBottom,
}
