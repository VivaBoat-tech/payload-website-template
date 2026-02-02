import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import type { CollectionConfig, TypedLocale } from 'payload'
import { revalidateDelete, revalidateLocation } from './hooks/revalidateLocation'

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          locale: data?.locale as TypedLocale,
          slug: data?.slug as string,
          collection: 'locations',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        locale: data?.locale as TypedLocale,
        slug: data?.slug as string,
        collection: 'locations',
        req,
      }),
  },
  defaultPopulate: {
    name: true,
    // categories: true,
    // meta: {
    //   image: true,
    //   description: true,
    // },
  },
  fields: [
    {
      label: 'Name',
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [],
          label: 'Content',
        },
        {
          fields: [
            {
              label: 'Country',
              name: 'country',
              type: 'text',
              required: false,
              localized: true,
            },
            {
              label: 'City',
              name: 'city',
              type: 'text',
              required: false,
              localized: true,
            },
            {
              label: 'Latitude',
              name: 'lat',
              type: 'text',
              required: false,
            },
            {
              label: 'Longitude',
              name: 'lon',
              type: 'text',
              required: false,
            },
          ],
          label: 'Maps',
        },
      ],
    },
    {
      label: 'Type',
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Harbour',
          value: 'harbour',
        },
        {
          label: 'Location',
          value: 'location',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      label: 'VivaBoat ID',
      name: 'vb_id',
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateLocation],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
