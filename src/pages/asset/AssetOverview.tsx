import { RouteComponentProps } from '@reach/router'
import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PageHeader from '../../components/PageHeader'
import { Button, colors } from 'react-atomicus'
import { css } from 'emotion'
import { Assets } from '../../generated/Assets'
import { Image, Transformation } from 'cloudinary-react'
import gql from 'graphql-tag'

interface AssetOverviewProps extends RouteComponentProps {
  projectName?: string
  contentClient: any
}

interface Asset {
  public_id: string
  filename: string
  format: string
  resource_type: string
  width: number
  height: number
  bytes: number
  url: string
  secure_url: string
  thumbnail_url: string
}

const ASSETS = gql`
  query Assets {
    assets {
      __typename
      public_id
      secure_url
      thumbnail_url
    }
  }
`

const CREATE_ASSET = gql`
  mutation CreateAsset(
    $public_id: String!
    $filename: String!
    $format: String!
    $resource_type: String!
    $width: Int!
    $height: Int!
    $bytes: Int!
    $url: String!
    $secure_url: String!
    $thumbnail_url: String!
  ) {
    createAsset(
      data: {
        public_id: $public_id
        filename: $filename
        format: $format
        resource_type: $resource_type
        width: $width
        height: $height
        bytes: $bytes
        url: $url
        secure_url: $secure_url
        thumbnail_url: $thumbnail_url
        status: Published
      }
    ) {
      __typename
      public_id
      secure_url
      thumbnail_url
    }
  }
`

const AssetOverview: React.FC<AssetOverviewProps> = ({ contentClient }) => {
  const { data } = useQuery<{ assets: Asset[] }>(ASSETS, {
    client: contentClient,
  })
  const [addAsset] = useMutation(CREATE_ASSET, {
    update(cache, { data: { createAsset } }) {
      const data = cache.readQuery<Assets>({
        query: ASSETS,
      })
      console.log(data)
      const assets = data?.assets?.concat(createAsset)
      cache.writeQuery({
        query: ASSETS,
        data: { assets },
      })
    },
    client: contentClient,
  })
  var cloudinaryWidget = (window as any).cloudinary.createUploadWidget(
    {
      cloudName: 'foxcms',
      uploadPreset: 'gb43v3m2',
      sources: ['local'],
      clientAllowedFormats: ['png', 'gif', 'jpeg'],
      maxImageFileSize: 15000000,
      maxVideoFileSize: 150000000,
      styles: {
        palette: {
          window: '#FFF',
          windowBorder: colors.grey500,
          tabIcon: colors.grey800,
          menuIcons: colors.grey800,
          textDark: colors.grey100,
          textLight: colors.grey400,
          link: colors.blue500,
          error: colors.red500,
          inProgress: '#0078FF',
          complete: colors.green500,
          sourceBg: '#E4EBF1',
        },
        fonts: {
          "'Open Sans', cursive":
            'https://fonts.googleapis.com/css?family=Open+Sans',
        },
      },
    },
    (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        addAsset({
          variables: {
            filename: result.info.original_filename,
            format: result.info.format,
            resource_type: result.info.resource_type,
            width: result.info.width,
            height: result.info.height,
            bytes: result.info.bytes,
            url: result.info.url,
            secure_url: result.info.secure_url,
            thumbnail_url: result.info.thumbnail_url,
            public_id: result.info.public_id,
          },
        })
      }
    }
  )
  return (
    <>
      <div
        className={css`
          margin-top: 4.8rem;
        `}
      >
        <PageHeader title="Assets">
          <Button onClick={() => cloudinaryWidget.open()}>Upload asset</Button>
        </PageHeader>
        <div
          className={css`
            display: flex;
            align-items: flex-start;
            width: 96rem;
            flex-wrap: wrap;
          `}
        >
          {data?.assets.map(asset => (
            <div
              key={asset.public_id}
              className={css`
                margin: 0.4rem;
                border-radius: 3px;
                overflow: hidden;
                cursor: pointer;
              `}
            >
              <Image
                key={asset.public_id}
                cloudName="foxcms"
                publicId={asset.public_id}
              >
                <Transformation height="192" crop="scale" />
              </Image>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export { AssetOverview }
