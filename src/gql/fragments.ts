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

export { SCALAR_FIELD_FRAGMENT }