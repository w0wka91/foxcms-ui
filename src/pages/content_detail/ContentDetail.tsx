import { RouteComponentProps, navigate } from '@reach/router'
import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Button, Card } from 'react-atomicus'
import { css } from 'emotion'
import { CONTENT_MODEL } from '../../gql/queries'
import { ContentModel } from '../../generated/ContentModel'
import { generateQuery, generateMutation } from '../../gql/utils'
import { isUserField } from '../../types/foxcms.global'
import { useForm } from 'react-hook-form'
import { DynamicInput } from './DynamicInput'
import { ContentMetadata } from './ContentMetadata'

interface ContentDetailProps extends RouteComponentProps {
  modelId?: string
  contentId?: string
  contentClient: any
}

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
        }
      },
    }
  )
  const onSubmit = (data: any) => {
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
                  isUserField(f) && (
                    <DynamicInput
                      key={f.id}
                      field={f}
                      contentClient={contentClient}
                      value={content ? content[f.apiName] : undefined}
                      formContext={formProps}
                    />
                  )
              )}
            </form>
          </Card>
          {!!contentId && <ContentMetadata content={content} />}
        </div>
      </div>
    </>
  ) : null
}

export { ContentDetail }
