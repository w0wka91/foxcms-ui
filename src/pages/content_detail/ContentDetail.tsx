import { RouteComponentProps, navigate } from '@reach/router'
import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import {
  Button,
  Card,
  Input,
  Datepicker,
  Label,
  Icon,
  colors,
  Checkbox,
} from 'react-atomicus'
import { css } from 'emotion'
import { CONTENT_MODEL } from '../../gql/queries'
import { ContentModel } from '../../generated/ContentModel'
import { generateQuery, generateMutation } from '../../gql/utils'
import {
  isUserField,
  UserField,
  isScalarField,
} from '../../types/foxcms.global'
import { useForm, Controller, FormContextValues } from 'react-hook-form'
import { DisplayType, Concern } from '../../generated/globalTypes'
import Dayjs from 'dayjs'
import { Editor } from '@tinymce/tinymce-react'
import CodeMirror from 'react-codemirror'

interface ContentDetailProps extends RouteComponentProps {
  modelId?: string
  contentId?: string
  contentClient: any
}

const resolveInputComponent = (
  field: UserField,
  value: any,
  {
    register,
    errors,
    control,
  }: Omit<FormContextValues<any>, 'handleSubmit' | 'formState' | 'watch'>
) => {
  let component = <span>{field.name}</span>
  if (isScalarField(field)) {
    switch (field.type) {
      case DisplayType.SINGLE_LINE_TEXT:
      case DisplayType.INTEGER:
      case DisplayType.FLOAT:
        component = (
          <Input
            defaultValue={value}
            ref={register({
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
              errors[field.apiName]
                ? (errors[field.apiName] as any).message
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
            control={control}
            name={field.apiName}
            onChange={d => Dayjs(d).toISOString()}
            as={
              <Datepicker
                label={field.name}
                formatDate={date => {
                  return Dayjs(date).format('DD.MM.YYYY')
                }}
                parseDate={dateStr => {
                  const date = Dayjs(dateStr, 'DD.MM.YYYY')
                  if (date.isValid()) {
                    return date.toDate()
                  }
                }}
              />
            }
          />
        )
        break
      case DisplayType.MULTI_LINE_TEXT:
        component = (
          <>
            <Label>{field.name}</Label>
            <Controller
              control={control}
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
            control={control}
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
              control={control}
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

const Info = ({
  label,
  value,
}: {
  label: string
  value: string | React.ReactNode
}) => (
  <div
    className={css`
      display: flex;
      flex-direction: column;
    `}
  >
    <Label>{label}</Label>
    <span>{value}</span>
  </div>
)

const ContentDetail: React.FC<ContentDetailProps> = ({
  modelId,
  contentId,
  contentClient,
}) => {
  const { data: modelData, loading } = useQuery<ContentModel>(CONTENT_MODEL, {
    variables: { modelId },
  })
  const { handleSubmit, formState, watch, ...formProps } = useForm()
  const { data: contentData } = useQuery(
    generateQuery(modelData?.contentModel, contentId),
    { client: contentClient, skip: !modelData || !contentId }
  )
  const content = contentData
    ? contentData[modelData?.contentModel?.apiName.toLowerCase() ?? '']
    : undefined
  const [mutateContent] = useMutation(
    generateMutation(modelData?.contentModel, watch(), contentId),
    {
      client: contentClient,
      onCompleted: data => {
        if (!contentId) {
          const newContentId =
            data[`create${modelData?.contentModel?.apiName}`]['id']
          navigate('./edit/' + newContentId)
        } else {
          console.log('UPDATE COMPLETED')
        }
      },
    }
  )
  const onSubmit = (data: any) => {
    console.log(data)
    mutateContent({ variables: data })
  }
  if (loading) return null
  return modelData?.contentModel && (content || !contentId) ? (
    <>
      <div
        className={css`
          margin-top: 4.8rem;
        `}
      >
        <PageHeader
          title={modelData.contentModel.name}
          subtitle={contentId ? `#${contentId}` : ''}
        >
          <Button
            type="submit"
            form="content-data-form"
            disabled={!formState.dirty}
          >
            Save
          </Button>
        </PageHeader>
        <div
          className={css`
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            min-width: 96rem;
          `}
        >
          <Card
            className={css`
              flex-basis: ${!contentId ? '100%' : '70%'};
              padding: 2.4rem 3.2rem;
              overflow: visible;
            `}
          >
            <form
              noValidate
              id="content-data-form"
              onSubmit={handleSubmit(onSubmit)}
              className={css`
                & > * {
                  margin-bottom: 1.2rem;
                }
              `}
            >
              {modelData.contentModel.fields.map(
                f =>
                  isUserField(f) &&
                  resolveInputComponent(
                    f,
                    content ? content[f.apiName] : undefined,
                    formProps
                  )
              )}
            </form>
          </Card>
          {!!contentId && (
            <div
              className={css`
                flex-basis: 25%;
                background: #fff;
                border: 1px solid ${colors.grey200};
                border-radius: 3px;
                min-width: auto;
                padding: 2.4rem 3.2rem;
                & > *:not(:last-child) {
                  margin-bottom: 1.6rem;
                }
              `}
            >
              <Info
                label="Status"
                value={
                  <div
                    className={css`
                      display: flex;
                      align-items: center;
                      & > *:not(:last-child) {
                        margin-right: 1.2rem;
                      }
                    `}
                  >
                    <Icon
                      name="circle"
                      fill={
                        content?.status === 'Published'
                          ? colors.green500
                          : content?.status === 'Pending'
                          ? colors.blue400
                          : 'none'
                      }
                    />
                    <span>{content?.status}</span>
                  </div>
                }
              />
              <Info
                label="Created at"
                value={Dayjs(content?.createdAt).format('DD.MM.YYYY HH:mm')}
              />
              <Info
                label="Updated at"
                value={Dayjs(content?.updatedAt).format('DD.MM.YYYY HH:mm')}
              />
            </div>
          )}
        </div>
      </div>
    </>
  ) : null
}

export { ContentDetail }
