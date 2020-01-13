import gql from 'graphql-tag'

const SCALAR_FIELD_FRAGMENT = gql`
  fragment ScalarFieldParts on ScalarField {
    id
    name
    apiName
    type
    concern
    constraint
  }
`

const RELATION_FIELD_FRAGMENT = gql`
  fragment RelationFieldParts on RelationField {
    id
    name
    apiName
    relationType: type
    relatesTo {
      id
      name
    }
  }
`

export { SCALAR_FIELD_FRAGMENT, RELATION_FIELD_FRAGMENT }
