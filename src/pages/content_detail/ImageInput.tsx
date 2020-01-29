import React from 'react'
import {
  RelationField,
  ScalarField,
  AssetField,
} from '../../types/foxcms.global'
import { FormContextValues, Controller } from 'react-hook-form'
import { useQuery } from '@apollo/react-hooks'
import { generateQuery } from '../../gql/utils'
import { RelationType } from '../../generated/globalTypes'
import pluralize from 'pluralize'
import { Label, Select, colors, Button } from 'react-atomicus'
import { css } from 'emotion'

interface ImageInputProps {
  field: AssetField
  value: any
  formContext: Omit<
    FormContextValues<any>,
    'handleSubmit' | 'formState' | 'watch'
  >
  contentClient: any
}

const ImageInput = ({
  field,
  value,
  formContext,
  contentClient,
}: ImageInputProps) => {
  return (
    <div>
      <Label>{field.name}</Label>
      <div
        className={css`
          border-radius: 3px;
          border: 1px solid ${colors.grey200};
          padding: 3.2rem 4.8rem;
          display: flex;
          justify-content: center;
        `}
      >
        <Button
          type="button"
          hierarchy="secondary"
          onClick={() => alert('load from assets...')}
        >
          <Button.Icon name="image" />
          <span>From assets</span>
        </Button>
      </div>
    </div>
  )
}

export { ImageInput }
