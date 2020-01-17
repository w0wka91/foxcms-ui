import React from 'react'
import { UserField, isScalarField } from '../../types/foxcms.global'
import { FormContextValues, Controller } from 'react-hook-form'
import { DisplayType, Concern } from '../../generated/globalTypes'
import { Input, Datepicker, Label, Checkbox, colors } from 'react-atomicus'
import Dayjs from 'dayjs'
import { Editor } from '@tinymce/tinymce-react'
import CodeMirror from 'react-codemirror'
import { css } from 'emotion'

interface DynamicInputProps {
  field: UserField
  value: any
  formContext: Omit<
    FormContextValues<any>,
    'handleSubmit' | 'formState' | 'watch'
  >
}

const DynamicInput = ({ field, value, formContext }: DynamicInputProps) => {
  let component = <span>{field.name}</span>
  if (isScalarField(field)) {
    switch (field.type) {
      case DisplayType.SINGLE_LINE_TEXT:
      case DisplayType.INTEGER:
      case DisplayType.FLOAT:
        component = (
          <Input
            defaultValue={value}
            ref={formContext.register({
              required:
                field.concern === Concern.REQUIRED && 'This field is required',
              pattern: {
                value:
                  field.type === DisplayType.INTEGER
                    ? /^\d+$/
                    : field.type === DisplayType.FLOAT
                    ? /^\d*\.?\d*$/
                    : /.*/,
                message:
                  field.type === DisplayType.INTEGER
                    ? 'Please enter a valid integer value'
                    : field.type === DisplayType.FLOAT
                    ? 'Please enter a valid decimal value'
                    : '',
              },
            })}
            type={
              field.type === DisplayType.SINGLE_LINE_TEXT ? 'text' : 'number'
            }
            step={field.type === DisplayType.INTEGER ? '1' : '0.01'}
            error={
              formContext.errors[field.apiName]
                ? (formContext.errors[field.apiName] as any).message
                : ''
            }
            autoComplete="off"
            name={field.apiName}
            label={field.name}
          />
        )
        break
      case DisplayType.DATE:
        component = (
          <Controller
            defaultValue={value}
            control={formContext.control}
            name={field.apiName}
            onChange={d => Dayjs(d).toISOString()}
            as={<Datepicker label={field.name} format="DD.MM.YYYY" />}
          />
        )
        break
      case DisplayType.MULTI_LINE_TEXT:
        component = (
          <>
            <Label>{field.name}</Label>
            <Controller
              control={formContext.control}
              name={field.apiName}
              onChangeName="onEditorChange"
              as={
                <Editor
                  apiKey="bxy35zz9elhssbq6xaqkusblsw0kzzu5hvcvjkt3xvd7i08r"
                  init={{
                    height: 384,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                    ],
                    toolbar: `undo redo | formatselect | bold italic backcolor |
                        alignleft aligncenter alignright alignjustify |
                        bullist numlist outdent indent | removeformat | help`,
                  }}
                  initialValue={value}
                />
              }
            />
          </>
        )
        break
      case DisplayType.CHECKBOX:
        component = (
          <Controller
            control={formContext.control}
            name={field.apiName}
            defaultValue={value ?? false}
            as={Checkbox}
            label={field.name}
          />
        )
        break
      case DisplayType.JSON_EDITOR:
        component = (
          <>
            <Label>{field.name}</Label>
            <Controller
              name={field.apiName}
              control={formContext.control}
              as={
                <CodeMirror
                  className={css`
                    border: 1px solid ${colors.grey200};
                    border-radius: 3px;
                    overflow: hidden;
                  `}
                  options={{
                    lineNumbers: true,
                    mode: 'application/json',
                  }}
                />
              }
            />
          </>
        )
    }
  }
  return <div key={field.id}>{component}</div>
}

export { DynamicInput }
